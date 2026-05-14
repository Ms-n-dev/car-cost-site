import { useState } from "react";
import type { V2FormData } from "@/app/v2/page";
import { trackEvent } from "@/lib/gtag";

type Results = {
  totalCost: number;
  monthlyCost: number;
  runningCosts: number;
  totalDepreciation: number;
  insuranceTotal: number;
  taxTotal: number;
  fuelTotal: number;
  servicingTotal: number;
  tyresTotal: number;
  repairsTotal: number;
  miscTotal: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: V2FormData;
  results: Results;
};

export default function EmailBreakdownModal({
  open,
  onClose,
  data,
  results,
}: Props) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  async function sendBreakdown() {
    setSending(true);

    const [make, model] = (data.makeModel || "").split(" | ");

const res = await fetch("/api/email-breakdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
body: JSON.stringify({
  email,

  ownershipYears: data.ownershipYears,

  totalCost: results.totalCost,
  monthlyCost: results.monthlyCost,

  costPerMile:
    results.totalCost /
    Math.max((data.annualMiles || 0) * data.ownershipYears, 1),

  totalFuelCost: results.fuelTotal,
  totalInsurance: results.insuranceTotal,
  totalTax: results.taxTotal,
  totalDepreciation: results.totalDepreciation,
  totalMaintenance:
  results.servicingTotal + results.tyresTotal + results.repairsTotal,

totalMiscCosts: results.miscTotal,

  annualMiles: data.annualMiles,
  carValue: data.carValue,
  carYear: data.carYear,
  fuelType: data.fuelType,
  carType: "standard",
}),
    });

    setSending(false);

    if (!res.ok) {
      alert("Could not send breakdown. Please try again.");
      return;
    }
trackEvent("submitted_email_breakdown");
    alert("Breakdown sent — check your inbox.");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Email breakdown
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Send this breakdown to yourself
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We’ll email your estimated ownership cost breakdown so you can
              come back to it later.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-500 hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <input
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
        />

        <button
          type="button"
          disabled={!email.trim() || sending}
          onClick={sendBreakdown}
          className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-lg shadow-slate-300 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? "Sending..." : "Email me this breakdown"}
        </button>
      </div>
    </div>
  );
}