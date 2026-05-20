import StepLayout from "./StepLayout";
import type { V2FormData, PurchaseType } from "@/app/v2/page";

type Props = {
  data: V2FormData;
  updateData: (patch: Partial<V2FormData>) => void;
  next: () => void;
  back: () => void;
};

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
}: {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </label>

      <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-4 focus-within:border-slate-950 focus-within:ring-4 focus-within:ring-slate-950/10">
        {prefix && <span className="text-slate-400">{prefix}</span>}

        <input
          type="number"
          value={value}
          onChange={(e) =>
            onChange(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={placeholder}
          className="w-full bg-transparent px-2 py-3 outline-none transition-all duration-200 sm:py-4"
        />

        {suffix && <span className="text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

export default function PurchaseStep({
  data,
  updateData,
  next,
  back,
}: Props) {
  const selectType = (purchaseType: PurchaseType) => {
    updateData({ purchaseType });
  };

  const canContinue =
    data.purchaseType === "cash"
      ? data.carValue !== "" && data.annualMiles !== ""
      : data.purchaseType === "finance"
      ? data.deposit !== "" &&
        data.monthlyPayment !== "" &&
        data.financeTermMonths !== ""
      : false;

  return (
    <StepLayout
      eyebrow="Buying method"
      title="How are you buying it?"
      subtitle="This changes how the total cost is calculated."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => selectType("cash")}
            className={`rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
              data.purchaseType === "cash"
                ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-400"
            }`}
          >
            <div className="text-lg font-semibold">Cash</div>
            <div
              className={`mt-1 text-sm ${
                data.purchaseType === "cash"
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              You own the car outright
            </div>
          </button>

          <button
            type="button"
            onClick={() => selectType("finance")}
            className={`rounded-3xl border p-5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
              data.purchaseType === "finance"
                ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                : "border-slate-200 bg-white hover:border-slate-400"
            }`}
          >
            <div className="text-lg font-semibold">Finance</div>
            <div
              className={`mt-1 text-sm ${
                data.purchaseType === "finance"
                  ? "text-slate-300"
                  : "text-slate-500"
              }`}
            >
              PCP, HP or monthly payments
            </div>
          </button>
        </div>

        {data.purchaseType === "cash" && (
          <div className="grid gap-4">
            <NumberInput
              label="Purchase price"
              value={data.carValue}
              onChange={(value) => updateData({ carValue: value })}
              prefix="£"
              placeholder="20000"
            />

            <NumberInput
              label="Current mileage"
              value={data.currentMileage}
              onChange={(value) => updateData({ currentMileage: value })}
              suffix="miles"
              placeholder="45000"
            />

            <NumberInput
              label="Annual mileage"
              value={data.annualMiles}
              onChange={(value) => updateData({ annualMiles: value })}
              suffix="miles"
              placeholder="8000"
            />

            <NumberInput
  label="Ownership years"
  value={data.ownershipYears}
  onChange={(value) =>
    updateData({
      ownershipYears:
        value === "" ? "" : Math.min(Math.max(Number(value), 1), 5),
    })
  }
  suffix="years"
  placeholder="3"
/>
          </div>
        )}

        {data.purchaseType === "finance" && (
          <div className="grid gap-4">
            <NumberInput
              label="Deposit"
              value={data.deposit}
              onChange={(value) => updateData({ deposit: value })}
              prefix="£"
              placeholder="2000"
            />

            <NumberInput
              label="Monthly payment"
              value={data.monthlyPayment}
              onChange={(value) => updateData({ monthlyPayment: value })}
              prefix="£"
              placeholder="350"
            />

            <NumberInput
              label="Finance term"
              value={data.financeTermMonths}
              onChange={(value) => updateData({ financeTermMonths: value })}
              suffix="months"
              placeholder="36"
            />

            <NumberInput
              label="Annual mileage"
              value={data.annualMiles}
              onChange={(value) => updateData({ annualMiles: value })}
              suffix="miles"
              placeholder="8000"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={back}
            className="w-1/3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700"
          >
            Back
          </button>

          <button
            type="button"
            disabled={!canContinue}
            onClick={next}
            className="w-2/3 rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-lg shadow-slate-300 transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            See results
          </button>
        </div>
      </div>
    </StepLayout>
  );
}