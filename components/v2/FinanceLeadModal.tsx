import { useState } from "react";
import type { V2FormData } from "@/app/v2/page";
import { trackEvent } from "@/lib/gtag";

type Results = {
  totalCost: number;
  monthlyCost: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  data: V2FormData;
  results: Results;
};

export default function FinanceLeadModal({
  open,
  onClose,
  data,
  results,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    monthlyBudget: "",
    deposit: "",
  });

  if (!open) return null;

const [make, model] = (data.makeModel || "").split(" | ");

const carName =
  [make, model].filter(Boolean).join(" ") ||
  data.reg ||
  "this car";

  const canSubmit =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "";

const submitLead = async () => {
const leadPayload = {
  name: form.name,
  email: form.email,
  phone: form.phone,

  reg: data.reg || "",
  make: make || "",
  model: model || "",

  purchaseType: data.purchaseType,
  ownershipYears: data.ownershipYears,
  annualMiles: data.annualMiles,

  monthlyBudget: form.monthlyBudget,
  deposit: form.deposit,

  createdAt: new Date().toISOString(),
};

const res = await fetch("/api/finance-leads", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(leadPayload),
});

if (!res.ok) {
  alert("Something went wrong. Please try again.");
  return;
}


trackEvent("submitted_finance_lead", {
  purchase_type: data.purchaseType,
  ownership_years: data.ownershipYears,
});

alert("Nice — your finance quote request has been captured.");
onClose();
  };

  return (
<div className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:items-center">
<div className="relative max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Finance quotes
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              See finance options for {carName}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Leave your details and we’ll use your calculation to help find
              suitable finance options.
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

        <div className="mb-5 rounded-2xl bg-slate-50 p-4">
          <div className="text-sm text-slate-500">Estimated true monthly cost</div>
          <div className="mt-1 text-2xl font-semibold text-slate-950">
            £{Math.round(results.monthlyCost).toLocaleString("en-GB")}/month
          </div>
        </div>

        <div className="grid gap-4">
          <input
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="First name"
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
          />

          <input
            value={form.email}
            type="email"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email address"
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
          />

          <input
            value={form.phone}
            type="tel"
            onChange={(e) =>
              setForm((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone number"
            className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
          />

<div className="grid grid-cols-2 gap-3">
  <div className="flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/10">
    <span className="text-slate-400">£</span>

    <input
      value={form.monthlyBudget}
      type="number"
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          monthlyBudget: e.target.value,
        }))
      }
      placeholder="Monthly budget"
      className="w-full bg-transparent px-2 py-4 outline-none"
    />
  </div>

  <div className="flex items-center rounded-2xl border border-slate-200 px-4 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/10">
    <span className="text-slate-400">£</span>

    <input
      value={form.deposit}
      type="number"
      onChange={(e) =>
        setForm((prev) => ({
          ...prev,
          deposit: e.target.value,
        }))
      }
      placeholder="Deposit"
      className="w-full bg-transparent px-2 py-4 outline-none"
    />
  </div>
</div>
</div>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          By submitting, you agree to be contacted about finance options. This
          is not a finance application and won’t affect your credit score.
        </p>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submitLead}
          className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-lg shadow-slate-300 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Get finance quotes
        </button>
      </div>
    </div>
  );
}