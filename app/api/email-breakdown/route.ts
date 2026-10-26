import { Resend } from "resend";
import {
  escapeHtml,
  isRecord,
  isValidEmail,
  nonnegativeNumber,
  readJsonBody,
  textField,
} from "@/lib/requestValidation";

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function POST(request: Request) {
  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) {
    return Response.json(
      { error: parsedBody.status === 413 ? "Request too large" : "Invalid request" },
      { status: parsedBody.status }
    );
  }

  const body = parsedBody.value;
  if (!isRecord(body)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const email = textField(body.email, 254);
  if (!email || !isValidEmail(email)) {
    return Response.json({ error: "Invalid email" }, { status: 400 });
  }

  const numericFields = [
    "ownershipYears",
    "totalCost",
    "monthlyCost",
    "costPerMile",
    "totalFuelCost",
    "totalInsurance",
    "totalTax",
    "totalMaintenance",
    "totalMiscCosts",
    "annualMiles",
    "carValue",
    "carYear",
    "purchaseCost",
  ] as const;
  const values = Object.fromEntries(
    numericFields.map((field) => [field, nonnegativeNumber(body[field])])
  ) as Record<(typeof numericFields)[number], number | null>;
  const purchaseType = body.purchaseType;

  if (
    Object.values(values).some((value) => value === null) ||
    (purchaseType !== "cash" && purchaseType !== "finance") ||
    !Number.isInteger(values.ownershipYears) ||
    values.ownershipYears! < 1 ||
    values.ownershipYears! > 10
  ) {
    return Response.json({ error: "Invalid breakdown values" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return Response.json({ error: "Email service unavailable" }, { status: 503 });
  }

  const fuelType = escapeHtml(textField(body.fuelType, 32) ?? "Not specified");
  const carType = escapeHtml(textField(body.carType, 32) ?? "Not specified");
  const carYear = values.carYear!;
  const annualMiles = values.annualMiles!;
  const carValue = values.carValue!;
  const purchaseCostLabel =
    purchaseType === "finance" ? "Finance cash paid during period" : "Depreciation";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a;">
      <h1>Your CarCalc breakdown</h1>
      <p>Here is your estimated ownership cost breakdown over <strong>${values.ownershipYears} year(s)</strong>.</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:20px 0;">
        <h2 style="margin-top:0;">Summary</h2>
        <p><strong>Total cost:</strong> ${money(values.totalCost!)}</p>
        <p><strong>Monthly cost:</strong> ${money(values.monthlyCost!)}</p>
        <p><strong>Cost per mile:</strong> £${values.costPerMile!.toFixed(2)}</p>
      </div>
      <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <h2 style="margin-top:0;">Breakdown</h2>
        <p><strong>Fuel:</strong> ${money(values.totalFuelCost!)}</p>
        <p><strong>Insurance:</strong> ${money(values.totalInsurance!)}</p>
        <p><strong>Road tax:</strong> ${money(values.totalTax!)}</p>
        <p><strong>Maintenance:</strong> ${money(values.totalMaintenance!)}</p>
        <p><strong>${purchaseCostLabel}:</strong> ${money(values.purchaseCost!)}</p>
        <p><strong>Other costs:</strong> ${money(values.totalMiscCosts!)}</p>
      </div>
      ${purchaseType === "finance" ? "<p>Finance cash paid includes deposit, scheduled payments during the selected period, and any entered final payment due within it. The estimate does not subtract the car's end value.</p>" : ""}
      <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />
      <p style="font-size:13px;color:#64748b;">Inputs used: ${carYear}, ${fuelType}, ${carType}, ${money(carValue)} value, ${annualMiles} miles/year.</p>
      <p style="font-size:13px;color:#64748b;">These are estimates only. Real costs may vary depending on condition, usage, market changes, insurance profile and maintenance history.</p>
      <p><a href="https://carcalc.app" style="color:#2563eb;">Run another calculation</a></p>
    </div>
  `;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "CarCalc <noreply@carcalc.app>",
      to: [email],
      subject: "Your CarCalc ownership breakdown",
      html,
    });

    if (error) {
      console.error("Email provider rejected breakdown request");
      return Response.json({ error: "Could not send breakdown" }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch {
    console.error("Email breakdown delivery failed");
    return Response.json({ error: "Could not send breakdown" }, { status: 502 });
  }
}