import type { V2FormData } from "@/app/v2/page";
import { useEffect, useRef, useState } from "react";
import FinanceLeadModal from "./FinanceLeadModal";
import EmailBreakdownModal from "./EmailBreakdownModal";
import { trackEvent } from "@/lib/gtag";
type Props = {
  data: V2FormData;
  updateData: (patch: Partial<V2FormData>) => void;
  results: {
    totalCost: number;
    monthlyCost: number;
    purchaseCost: number;
    financeTotal: number;
    runningCosts: number;
    totalDepreciation: number;
    estimatedResaleValue: number;
    insuranceTotal: number;
    taxTotal: number;
    fuelTotal: number;
    servicingTotal: number;
    tyresTotal: number;
    repairsTotal: number;
    miscTotal: number;
  };
  back: () => void;
  restart: () => void;
};

function money(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="font-semibold text-slate-950">{money(value)}</span>
    </div>
  );
}

export default function ResultsStep({
  data,
  results,
  updateData,
  back,
  restart,
}: Props) {
  const carName = data.reg || data.makeModel || "This car";
  const [financeModalOpen, setFinanceModalOpen] = useState(false);
const [emailModalOpen, setEmailModalOpen] = useState(false);
const hasTrackedResults = useRef(false);

useEffect(() => {
  if (hasTrackedResults.current) return;

  hasTrackedResults.current = true;

  trackEvent("viewed_results", {
    ownership_years: data.ownershipYears,
    purchase_type: data.purchaseType,
    total_cost: Math.round(results.totalCost),
    monthly_cost: Math.round(results.monthlyCost),
  });
}, []);
  return (
    <section className="mx-auto w-full max-w-4xl">
      <div className="rounded-[2.5rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-300 sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">
          True cost
        </p>

<h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-6xl">
  {carName} will cost around{" "}
  <span className="whitespace-nowrap">
    {money(results.monthlyCost)}/month
  </span>
</h1>

        <p className="mt-5 max-w-xl text-slate-300">
          Over {data.ownershipYears} years, the estimated total cost is{" "}
          <span className="font-semibold text-white">
            {money(results.totalCost)}
          </span>
          .
        </p>


<div className="mt-8 rounded-3xl bg-white/10 p-5">
  <div className="flex items-center justify-between gap-4">
    <div>
      <div className="text-sm text-slate-400">Ownership period</div>
      <div className="mt-1 text-2xl font-semibold">
        {data.ownershipYears} {data.ownershipYears === 1 ? "year" : "years"}
      </div>
    </div>

    <div className="text-right text-sm text-slate-400">
      Slide to compare
    </div>
  </div>

  <input
    type="range"
    min="1"
    max="5"
    step="1"
    value={data.ownershipYears}
    onChange={(e) =>
      updateData({
        ownershipYears: Number(e.target.value),
      })
    }
    className="mt-5 w-full accent-white"
  />

  <div className="mt-2 flex justify-between text-xs text-slate-400">
    <span>1 yr</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
    <span>5 yrs</span>
  </div>
</div>


        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:p-5">
            <div className="text-sm text-slate-400">Total cost</div>
            <div className="mt-2 text-3xl font-semibold">
              {money(results.totalCost)}
            </div>
          </div>

<div className="rounded-3xl bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:p-5">
  <div className="text-sm text-slate-400">Monthly cost</div>

  <div className="mt-2 text-3xl font-semibold">
    {money(results.monthlyCost)}
  </div>
</div>

          <div className="rounded-3xl bg-white/10 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:p-5">
            <div className="text-sm text-slate-400">Buying method</div>
            <div className="mt-2 text-3xl font-semibold capitalize">
              {data.purchaseType}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <h2 className="text-xl font-semibold text-slate-950">Breakdown</h2>

          <div className="mt-6 space-y-5">
  {[
    {
      label:
        data.purchaseType === "cash"
          ? "Depreciation"
          : "Finance payments + deposit",
      value:
        data.purchaseType === "cash"
          ? results.totalDepreciation
          : results.financeTotal,
    },
    {
      label: "Fuel",
      value: results.fuelTotal,
    },
    {
      label: "Insurance",
      value: results.insuranceTotal,
    },
    {
      label: "Tax",
      value: results.taxTotal,
    },
    {
      label: "Maintenance",
      value:
        results.servicingTotal +
        results.tyresTotal +
        results.repairsTotal,
    },
    {
      label: "Other costs",
      value: results.miscTotal,
    },
  ]
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((item) => (
      <div
        key={item.label}
        className="flex items-center justify-between text-[15px]"
      >
        <span className="text-slate-700">{item.label}</span>

        <span className="font-medium text-slate-950">
          {money(item.value)}
        </span>
      </div>
    ))}

  <div className="border-t border-slate-200 pt-5">
    <div className="flex items-center justify-between">
      <span className="text-base font-semibold text-slate-950">
        Total ownership cost
      </span>

      <span className="text-xl font-bold text-slate-950">
        {money(results.totalCost)}
      </span>
    </div>
  </div>
</div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
          <h2 className="text-xl font-semibold text-slate-950">What next?</h2>

          <div className="mt-5 grid gap-3">
<button
  type="button"
onClick={() => {
  trackEvent("clicked_finance_cta");
  setFinanceModalOpen(true);
}}
  className="rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white"
>
  Get finance quotes
</button>

<button
  type="button"
onClick={() => {
  trackEvent("clicked_email_cta");
  setEmailModalOpen(true);
}}
  className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800"
>
  Email me this breakdown
</button>

            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800"
            >
              Compare another car
            </button>

            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-800"
            >
              Find cheaper alternatives
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={back}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700"
        >
          Back
        </button>

        <button
          type="button"
          onClick={restart}
          className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white"
        >
          Start again
        </button>   
      </div>
      <FinanceLeadModal
  open={financeModalOpen}
  onClose={() => setFinanceModalOpen(false)}
  data={data}
  results={results}
/>

<EmailBreakdownModal
  open={emailModalOpen}
  onClose={() => setEmailModalOpen(false)}
  data={data}
  results={results}
/>

    </section>
  );
}