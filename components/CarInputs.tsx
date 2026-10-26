"use client";
import React, { useState } from "react";
import {
  trackCalculatorStarted,
  type CalculatorType,
} from "@/lib/gtag";

type FormValue = string | number | boolean | undefined;

type CarInputsProps<T extends Record<string, FormValue>> = {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  inputClass: string;
  labelClass: string;
  handleFuelTypeChange: (value: string) => void;
  calculatorType?: CalculatorType;
};

export default function CarInputs<T extends Record<string, FormValue>>({
  data,
  setData,
  inputClass,
  labelClass,
  handleFuelTypeChange,
  calculatorType = "single",
}: CarInputsProps<T>) {
  const [showExtras, setShowExtras] = useState(false);

  const numericFields = [
    "carValue",
    "currentMileage",
    "annualMiles",
    "efficiency",
    "fuelPrice",
    "insurance",
    "tax",
    "servicing",
    "tyres",
    "repairsBuffer",
  ];

  function getInputValue(value: FormValue): string | number | undefined {
    if (value === undefined || value === null || typeof value === "boolean") {
      return "";
    }

    return value === "" ? "" : value;
  }

  function update(key: string, value: string | number | boolean) {
    if (!key.endsWith("Open")) trackCalculatorStarted(calculatorType, 1);

    setData((prev) => ({
      ...prev,
      [key]: numericFields.includes(key as (typeof numericFields)[number])
        ? value === "" ? "" : Number(value)
        : value,
    }));
  }

  const enhancedInputClass = `${inputClass} hover:border-slate-500 transition`;
  const currentYear = new Date().getFullYear();

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <label className={labelClass}>Car value (£)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.carValue)}
          onChange={(e) => update("carValue", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="relative">
        <label className={labelClass}>Car year</label>

        <button
          onClick={() => update("carYearOpen", !data.carYearOpen)}
          className={`${enhancedInputClass} flex items-center justify-between`}
        >
          <span>{data.carYear}</span>
          <span className="text-slate-400">⌄</span>
        </button>

        {data.carYearOpen && (
          <div className="absolute z-10 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
            {Array.from({ length: 30 }, (_, i) => currentYear - i).map((year) => (
              <div
                key={year}
                onClick={() => {
                  update("carYear", year);
                  update("carYearOpen", false);
                }}
                className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-100 ${
                  data.carYear === year ? "bg-slate-100 font-medium" : ""
                }`}
              >
                {year}
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 text-sm text-slate-600">Car age: {Number(currentYear) - Number(data.carYear)} years</div>
      </div>

      <div>
        <label className={labelClass}>Current mileage</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.currentMileage)}
          onChange={(e) => update("currentMileage", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="relative">
        <label className={labelClass}>Car type</label>

        <button
          onClick={() => update("carTypeOpen", !data.carTypeOpen)}
          className={`${enhancedInputClass} flex items-center justify-between`}
        >
          <span className="capitalize">{data.carType}</span>
          <span className="text-slate-400">⌄</span>
        </button>

        {data.carTypeOpen && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {["standard", "luxury", "performance"].map((option) => (
              <div
                key={option}
                onClick={() => {
                  update("carType", option);
                  update("carTypeOpen", false);
                }}
                className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-100 ${
                  data.carType === option ? "bg-slate-100 font-medium" : ""
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Annual mileage</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.annualMiles)}
          onChange={(e) => update("annualMiles", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="relative">
        <label className={labelClass}>Fuel type</label>

        <button
          onClick={() => update("fuelTypeOpen", !data.fuelTypeOpen)}
          className={`${enhancedInputClass} flex items-center justify-between`}
        >
          <span className="capitalize">{String(data.fuelType ?? "petrol").replace("_", " ")}</span>
          <span className="text-slate-400">⌄</span>
        </button>

        {data.fuelTypeOpen && (
          <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
            {["petrol", "diesel", "premium_petrol", "electric"].map((option) => (
              <div
                key={option}
                onClick={() => {
                  trackCalculatorStarted(calculatorType, 1);
                  handleFuelTypeChange(option);
                  update("fuelTypeOpen", false);
                }}
                className={`cursor-pointer px-4 py-3 text-sm hover:bg-slate-100 ${
                  data.fuelType === option ? "bg-slate-100 font-medium" : ""
                }`}
              >
                {option.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>{data.fuelType === "electric" ? "Efficiency (mi/kWh)" : "MPG"}</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.efficiency)}
          onChange={(e) => update("efficiency", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>{data.fuelType === "electric" ? "Electricity price (p/kWh)" : "Fuel price (p/litre)"}</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.fuelPrice)}
          onChange={(e) => update("fuelPrice", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Insurance (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.insurance)}
          onChange={(e) => update("insurance", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Tax (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.tax)}
          onChange={(e) => update("tax", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Servicing (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.servicing)}
          onChange={(e) => update("servicing", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Tyres (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.tyres)}
          onChange={(e) => update("tyres", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Repairs buffer (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={getInputValue(data.repairsBuffer)}
          onChange={(e) => update("repairsBuffer", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowExtras(!showExtras)}
          className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
        >
          <span>{showExtras ? "Hide additional costs" : "Add additional costs"}</span>
          <svg
            className={`h-4 w-4 transition-transform duration-200 ${showExtras ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showExtras && (
          <div className="mt-3">
            <label className={labelClass}>Additional costs (£/year)</label>
            <input
              type="number"
              className={inputClass}
              value={getInputValue(data.miscCosts)}
              onChange={(e) =>
                {
                  trackCalculatorStarted(calculatorType, 1);
                  setData((prev) => ({
                    ...prev,
                    miscCosts: e.target.value === "" ? "" : Number(e.target.value),
                  }));
                }
              }
            />
            <div className="mt-1 text-xs text-slate-400">Breakdown cover, warranty, parking, ULEZ, etc.</div>
          </div>
        )}
      </div>
    </div>
  );
}
