import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  escapeHtml,
  isRecord,
  isValidEmail,
  nonnegativeNumber,
  readJsonBody,
  textField,
} from "@/lib/requestValidation";

function optionalText(value: unknown, maxLength: number): string | null {
  if (value === undefined || value === "") return "";
  return textField(value, maxLength);
}

function optionalNumber(value: unknown): number | null {
  if (value === undefined || value === "") return 0;
  return nonnegativeNumber(value, 10_000_000);
}

export async function POST(request: Request) {
  const parsedBody = await readJsonBody(request);
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

  const service = body.service;
  const name = textField(body.name, 100);
  const email = textField(body.email, 254);
  const phone = textField(body.phone, 30);
  const postcode = optionalText(body.postcode, 10);
  const registration = optionalText(body.reg, 12);
  const makeModel = optionalText(body.makeModel, 120);
  const carYear = optionalNumber(body.carYear);
  const annualMiles = optionalNumber(body.annualMiles);
  const currentMileage = optionalNumber(body.currentMileage);

  if (
    (service !== "insurance" && service !== "warranty") ||
    !name ||
    !email ||
    !isValidEmail(email) ||
    !phone ||
    !/^[+()\d\s.-]{7,30}$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    body.consent !== true ||
    postcode === null ||
    registration === null ||
    makeModel === null ||
    carYear === null ||
    annualMiles === null ||
    currentMileage === null ||
    (service === "insurance" && !/^[A-Z0-9 ]{5,8}$/i.test(postcode))
  ) {
    return NextResponse.json({ error: "Invalid enquiry details" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Enquiry service unavailable" }, { status: 503 });
  }

  const serviceLabel = service === "insurance" ? "Insurance" : "Warranty";
  const html = `
    <h2>New ${serviceLabel.toLowerCase()} enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Postcode:</strong> ${escapeHtml(postcode || "Not provided")}</p>
    <hr />
    <p><strong>Registration:</strong> ${escapeHtml(registration || "Not provided")}</p>
    <p><strong>Vehicle:</strong> ${escapeHtml(makeModel || "Not provided")}</p>
    <p><strong>Year:</strong> ${carYear || "Not provided"}</p>
    <p><strong>Annual miles:</strong> ${annualMiles || "Not provided"}</p>
    <p><strong>Current mileage:</strong> ${currentMileage || "Not provided"}</p>
    <p><strong>Contact consent:</strong> Yes</p>
  `;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "CarCalc <noreply@carcalc.app>",
      to: "admincarcalc@gmail.com",
      subject: `New CarCalc ${serviceLabel.toLowerCase()} enquiry`,
      html,
    });

    if (error) {
      console.error("Email provider rejected affiliate enquiry");
      return NextResponse.json({ error: "Could not send enquiry" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Affiliate enquiry delivery failed");
    return NextResponse.json({ error: "Could not send enquiry" }, { status: 502 });
  }
}