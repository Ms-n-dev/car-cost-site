import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const lead = await req.json();

    if (!lead.name || !lead.email || !lead.phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "CarCalc <noreply@carcalc.app>",
      to: "admincarcalc@gmail.com",
subject: `New finance lead - ${lead.reg || lead.make || "CarCalc"}`,
      html: `
  <h2>New finance lead</h2>

  <p><strong>Name:</strong> ${lead.name}</p>
  <p><strong>Registration:</strong> ${lead.reg || "Not provided"}</p>
  <p><strong>Make:</strong> ${lead.make || "Not provided"}</p>
  <p><strong>Model:</strong> ${lead.model || "Not provided"}</p>

  <hr />

  <p><strong>Email:</strong> ${lead.email}</p>
  <p><strong>Phone:</strong> ${lead.phone}</p>

  <hr />

  <p><strong>Purchase type:</strong> ${lead.purchaseType || "Not provided"}</p>
  <p><strong>Ownership years:</strong> ${lead.ownershipYears}</p>
  <p><strong>Annual miles:</strong> ${lead.annualMiles}</p>

  <hr />

  <p><strong>Monthly budget:</strong> ${
    lead.monthlyBudget ? `£${lead.monthlyBudget}` : "Not provided"
  }</p>
  <p><strong>Deposit:</strong> ${
    lead.deposit ? `£${lead.deposit}` : "Not provided"
  }</p>
`,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send finance lead" },
      { status: 500 }
    );
  }
}