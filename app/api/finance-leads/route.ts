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

function optionalMoney(value: unknown): number | null {
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

  const name = textField(body.name, 100);
  const email = textField(body.email, 254);
  const phone = textField(body.phone, 30);
  const ownershipYears = nonnegativeNumber(body.ownershipYears, 10);
  const annualMiles = nonnegativeNumber(body.annualMiles, 1_000_000);
  const monthlyBudget = optionalMoney(body.monthlyBudget);
  const deposit = optionalMoney(body.deposit);
  const reg = optionalText(body.reg, 12);
  const make = optionalText(body.make, 80);
  const model = optionalText(body.model, 80);
  const purchaseType = optionalText(body.purchaseType, 20);

  if (
    !name ||
    !email ||
    !isValidEmail(email) ||
    !phone ||
    !/^[+()\d\s.-]{7,30}$/.test(phone) ||
    phone.replace(/\D/g, "").length < 7 ||
    body.consent !== true ||
    ownershipYears === null ||
    !Number.isInteger(ownershipYears) ||
    ownershipYears < 1 ||
    annualMiles === null ||
    monthlyBudget === null ||
    deposit === null ||
    reg === null ||
    make === null ||
    model === null ||
    purchaseType === null
  ) {
    return NextResponse.json({ error: "Invalid enquiry details" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Enquiry service unavailable" }, { status: 503 });
  }

  const html = `
    <h2>New finance enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Registration:</strong> ${escapeHtml(reg || "Not provided")}</p>
    <p><strong>Make:</strong> ${escapeHtml(make || "Not provided")}</p>
    <p><strong>Model:</strong> ${escapeHtml(model || "Not provided")}</p>
    <hr />
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <hr />
    <p><strong>Purchase type:</strong> ${escapeHtml(purchaseType || "Not provided")}</p>
    <p><strong>Ownership years:</strong> ${ownershipYears}</p>
    <p><strong>Annual miles:</strong> ${annualMiles}</p>
    <p><strong>Monthly budget:</strong> £${monthlyBudget.toLocaleString("en-GB")}</p>
    <p><strong>Deposit:</strong> £${deposit.toLocaleString("en-GB")}</p>
    <p><strong>Contact consent:</strong> Yes</p>
  `;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "CarCalc <noreply@carcalc.app>",
      to: "admincarcalc@gmail.com",
      subject: "New CarCalc finance enquiry",
      html,
    });

    if (error) {
      console.error("Email provider rejected finance enquiry");
      return NextResponse.json({ error: "Could not send enquiry" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    console.error("Finance enquiry delivery failed");
    return NextResponse.json({ error: "Could not send enquiry" }, { status: 502 });
  }
}