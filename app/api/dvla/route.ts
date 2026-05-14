import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { registrationNumber } = await req.json();

    if (!registrationNumber) {
      return NextResponse.json(
        { error: "Registration number is required" },
        { status: 400 }
      );
    }

    const res = await fetch(
      "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.DVLA_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber: String(registrationNumber)
            .replace(/\s/g, "")
            .toUpperCase(),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "DVLA lookup failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("DVLA lookup error:", error);

    return NextResponse.json(
      { error: "Something went wrong with the DVLA lookup" },
      { status: 500 }
    );
  }
}