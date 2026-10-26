import { NextResponse } from "next/server";
import { isRecord, readJsonBody, textField } from "@/lib/requestValidation";

export async function POST(request: Request) {
  const parsedBody = await readJsonBody(request, 2_048);
  if (!parsedBody.ok) {
    return NextResponse.json(
      { error: parsedBody.status === 413 ? "Request too large" : "Invalid request" },
      { status: parsedBody.status }
    );
  }

  const body = parsedBody.value;
  if (!isRecord(body)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const registrationNumber = textField(body.registrationNumber, 12)
    ?.replace(/\s/g, "")
    .toUpperCase();

  if (!registrationNumber || !/^[A-Z0-9]{2,8}$/.test(registrationNumber)) {
    return NextResponse.json(
      { error: "Enter a valid vehicle registration" },
      { status: 400 }
    );
  }

  const apiKey = process.env.DVLA_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Vehicle lookup unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationNumber }),
        signal: AbortSignal.timeout(8_000),
      }
    );

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const status = response.status === 404 ? 404 : 502;
      return NextResponse.json(
        { error: status === 404 ? "Vehicle not found" : "Vehicle lookup failed" },
        { status }
      );
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    return NextResponse.json(
      { error: timedOut ? "Vehicle lookup timed out" : "Vehicle lookup failed" },
      { status: timedOut ? 504 : 502 }
    );
  }
}