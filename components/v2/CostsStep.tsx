import { useState } from "react";
import StepLayout from "./StepLayout";
import type { V2FormData } from "@/app/v2/page";

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
          className="w-full bg-transparent px-2 py-4 outline-none transition-all duration-200"
        />

        {suffix && <span className="text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

export default function CostsStep({ data, updateData, next, back }: Props) {
  const [showExtra, setShowExtra] = useState(false);

  return (
    <StepLayout
      eyebrow="Running costs"
      title="What will it cost to run?"
      subtitle="Add the main costs first. You can add extra costs if you want a sharper estimate."
    >
      <div className="space-y-5">
        <div className="grid gap-4">
          <NumberInput
            label="Insurance"
            value={data.insurance}
            onChange={(v) => updateData({ insurance: v })}
            prefix="£"
            suffix="/year"
            placeholder="1200"
          />

<div>
  <label className="mb-2 block text-sm font-medium text-slate-600">
    Fuel type
  </label>

  <div className="relative">

<select
  value={data.fuelType}
  onChange={(e) => {
    const fuelType = e.target.value as V2FormData["fuelType"];

updateData({
  fuelType,
  efficiency: fuelType === "electric" ? 3.5 : "",
  fuelPrice:
    fuelType === "petrol"
      ? 158.5
      : fuelType === "diesel"
      ? 191.5
      : fuelType === "premium_petrol"
      ? 171
      : fuelType === "electric"
      ? 7.5
      : "",
});
  }}
className={`w-full appearance-none rounded-2xl border border-slate-200 bg-transparent px-4 py-4 outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10 ${
  data.fuelType ? "text-slate-950" : "text-slate-400"
}`}
>
  <option value="">Select fuel type</option>

  <option value="petrol">Petrol</option>
  <option value="diesel">Diesel</option>
  <option value="premium_petrol">Premium petrol</option>
  <option value="electric">Electric</option>
</select>

<div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
<svg
  className="h-4 w-4"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M19 9l-7 7-7-7"
  />
</svg>
</div>
</div>
</div>

<NumberInput
  label={data.fuelType === "electric" ? "Efficiency" : "MPG"}
  value={data.efficiency}
  onChange={(v) => updateData({ efficiency: v })}
  suffix={data.fuelType === "electric" ? "mi/kWh" : "mpg"}
  placeholder={data.fuelType === "electric" ? "3.5" : "38"}
/>

<NumberInput
  label={data.fuelType === "electric" ? "Electricity price" : "Fuel price"}
  value={data.fuelPrice}
  onChange={(v) => updateData({ fuelPrice: v })}
  suffix={data.fuelType === "electric" ? "p/kWh" : "p/litre"}
  placeholder={data.fuelType === "electric" ? "7.5" : "158.5"}
/>

          <NumberInput
            label="Road tax"
            value={data.tax}
            onChange={(v) => updateData({ tax: v })}
            prefix="£"
            suffix="/year"
            placeholder="190"
          />
        </div>

        <button
          onClick={() => setShowExtra((prev) => !prev)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
        >
          {showExtra ? "Hide extra costs" : "+ Add extra costs"}
        </button>

        {showExtra && (
          <div className="grid gap-4">
            <NumberInput
              label="Servicing"
              value={data.servicing}
              onChange={(v) => updateData({ servicing: v })}
              prefix="£"
              suffix="/year"
              placeholder="350"
            />

            <NumberInput
              label="Tyres"
              value={data.tyres}
              onChange={(v) => updateData({ tyres: v })}
              prefix="£"
              suffix="/year"
              placeholder="250"
            />

            <NumberInput
              label="Repairs buffer"
              value={data.repairs}
              onChange={(v) => updateData({ repairs: v })}
              prefix="£"
              suffix="/year"
              placeholder="500"
            />

            <NumberInput
              label="Other costs"
              value={data.miscCosts}
              onChange={(v) => updateData({ miscCosts: v })}
              prefix="£"
              suffix="/year"
              placeholder="200"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={back}
            className="w-1/3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-700"
          >
            Back
          </button>

          <button
            onClick={next}
            className="w-2/3 rounded-2xl bg-slate-950 px-5 py-4 font-semibold text-white shadow-lg shadow-slate-300"
          >
            See results
          </button>
        </div>
      </div>
    </StepLayout>
  );
}