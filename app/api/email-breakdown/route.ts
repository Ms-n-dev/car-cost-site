import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not set");
}

const resend = new Resend(resendApiKey);

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      ownershipYears,
      totalCost,
      monthlyCost,
      costPerMile,
      totalFuelCost,
      totalInsurance,
      totalTax,
      totalDepreciation,
      annualMiles,
      carValue,
      carYear,
      fuelType,
      carType,
    } = body;

    if (!email || !String(email).includes("@")) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a;">
        <h1>Your CarCalc breakdown</h1>

        <p>Here’s your estimated ownership cost breakdown over <strong>${ownershipYears} year(s)</strong>.</p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin:20px 0;">
          <h2 style="margin-top:0;">Summary</h2>
          <p><strong>Total cost:</strong> ${money(totalCost)}</p>
          <p><strong>Monthly cost:</strong> ${money(monthlyCost)}</p>
          <p><strong>Cost per mile:</strong> £${Number(costPerMile || 0).toFixed(2)}</p>
        </div>

        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
          <h2 style="margin-top:0;">Breakdown</h2>
          <p><strong>Fuel:</strong> ${money(totalFuelCost)}</p>
          <p><strong>Insurance:</strong> ${money(totalInsurance)}</p>
          <p><strong>Road tax:</strong> ${money(totalTax)}</p>
          <p><strong>Depreciation:</strong> ${money(totalDepreciation)}</p>
        </div>

        <hr style="margin:24px 0;border:none;border-top:1px solid #e2e8f0;" />

        <p style="font-size:13px;color:#64748b;">
          Inputs used: ${carYear}, ${fuelType}, ${carType}, ${money(carValue)} value, ${annualMiles} miles/year.
        </p>

        <p style="font-size:13px;color:#64748b;">
          These are estimates only. Real costs may vary depending on condition, usage, market changes, insurance profile and maintenance history.
        </p>

        <p>
          <a href="https://carcalc.app" style="color:#2563eb;">Run another calculation</a>
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
from: "CarCalc <noreply@carcalc.app>",
      to: [email],
      bcc: ["admincarcalc@gmail.com"],
      subject: "Your CarCalc ownership breakdown",
      html,
    });

if (error) {
  console.error("RESEND ERROR:", error);
  return Response.json({ error }, { status: 500 });
}

    return Response.json({ success: true });
} catch (err) {
  console.error("EMAIL ROUTE ERROR:", err);
  return Response.json({ error: "Something went wrong" }, { status: 500 });
}
}