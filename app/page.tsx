"use client";

import React, { useMemo, useState } from "react";

function currency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function currency2(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

function numberOrZero(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export default function Page() {
  const [carValue, setCarValue] = useState(18000);
  const [carAge, setCarAge] = useState(5);
  const [annualMiles, setAnnualMiles] = useState(10000);
  const [currentMileage, setCurrentMileage] = useState(50000); // NEW
  const [carType, setCarType] = useState("standard"); // NEW
  const [fuelType, setFuelType] = useState("petrol");
  const [efficiency, setEfficiency] = useState(38);
  const [fuelPrice, setFuelPrice] = useState(158.5);
  const [insurance, setInsurance] = useState(900);
  const [tax, setTax] = useState(190);
  const [servicing, setServicing] = useState(350);
  const [tyres, setTyres] = useState(300);
  const [repairsBuffer, setRepairsBuffer] = useState(400);

  const fuelDefaults = {
    petrol: 158.5,
    diesel: 191.5,
    premium_petrol: 171.0,
    electric: 7.5,
  } as const;

  const fuelTypeLabel =
    fuelType === "electric" ? "Electricity price (p/kWh)" : "Fuel price (p/litre)";

  const efficiencyLabel = fuelType === "electric" ? "Efficiency (mi/kWh)" : "MPG";

  // EXISTING AGE-BASED DEPRECIATION (UNCHANGED)
  const depreciationRate = useMemo(() => {
    if (carAge <= 2) return 0.18;
    if (carAge <= 5) return 0.12;
    if (carAge <= 8) return 0.08;
    return 0.05;
  }, [carAge]);

  // NEW: Mileage factor
  const mileageFactor = useMemo(() => {
    if (currentMileage <= 30000) return 1.25;
    if (currentMileage <= 80000) return 1.0;
    if (currentMileage <= 120000) return 0.75;
    return 0.6;
  }, [currentMileage]);

  // NEW: Car type factor (light touch for now)
  const carTypeFactor = useMemo(() => {
    if (carType === "luxury") return 1.15;
    if (carType === "performance") return 1.2;
    return 1.0;
  }, [carType]);

  const annualMaintenance = useMemo(() => {
    const total = numberOrZero(servicing) + numberOrZero(tyres) + numberOrZero(repairsBuffer);
    return total;
  }, [servicing, tyres, repairsBuffer]);

  const results = useMemo(() => {
    const litresPerGallon = 4.54609;

    let annualFuelCost = 0;

    if (fuelType === "electric") {
      const milesPerKwh = Math.max(numberOrZero(efficiency), 0.1);
      const annualKwhUsed = numberOrZero(annualMiles) / milesPerKwh;
      annualFuelCost = annualKwhUsed * (numberOrZero(fuelPrice) / 100);
    } else {
      const mpg = Math.max(numberOrZero(efficiency), 1);
      const gallonsUsed = numberOrZero(annualMiles) / mpg;
      const litresUsed = gallonsUsed * litresPerGallon;
      annualFuelCost = litresUsed * (numberOrZero(fuelPrice) / 100);
    }

    // UPDATED: depreciation now includes mileage + car type
    const annualDepreciation =
      numberOrZero(carValue) *
      depreciationRate *
      mileageFactor *
      carTypeFactor;

    const annualTotal =
      annualFuelCost +
      numberOrZero(insurance) +
      numberOrZero(tax) +
      annualMaintenance +
      annualDepreciation;

    const monthlyTotal = annualTotal / 12;
    const costPerMile = annualTotal / Math.max(numberOrZero(annualMiles), 1);

    return {
      annualFuelCost,
      annualDepreciation,
      annualTotal,
      monthlyTotal,
      costPerMile,
    };
  }, [
    annualMiles,
    efficiency,
    fuelPrice,
    fuelType,
    insurance,
    tax,
    annualMaintenance,
    carValue,
    depreciationRate,
    mileageFactor,
    carTypeFactor,
  ]);

  const interpretation = useMemo(() => {
    if (results.annualTotal < 3500) {
      return `This is a relatively low ownership cost. You are at about ${currency(
        results.monthlyTotal
      )} per month and ${currency2(results.costPerMile)} per mile.`;
    }

    if (results.annualTotal > 7000) {
      return `This is on the expensive side. The car is costing about ${currency(
        results.monthlyTotal
      )} per month and ${currency2(results.costPerMile)} per mile.`;
    }

    return `This sits in the middle. The car is costing about ${currency(
      results.monthlyTotal
    )} per month and ${currency2(results.costPerMile)} per mile.`;
  }, [results]);

  // NEW: Mileage warning
  const mileageWarning = useMemo(() => {
    if (currentMileage > 120000) {
      return "High mileage car — depreciation slows, but repair risk increases.";
    }
    if (currentMileage < 30000 && carAge > 5) {
      return "Very low mileage for its age — this may positively impact resale value.";
    }
    return null;
  }, [currentMileage, carAge]);

  function handleFuelTypeChange(value: string) {
    setFuelType(value);

    if (value === "electric") {
      setFuelPrice(fuelDefaults.electric);
      setEfficiency(3.5);
      return;
    }

    setFuelPrice(fuelDefaults[value as keyof typeof fuelDefaults]);

    if (efficiency < 8) {
      setEfficiency(38);
    }
  }

  const cardClass =
    "rounded-3xl border border-slate-300 bg-white p-6 shadow-md shadow-slate-200/70";
  const inputClass =
    "w-full rounded-2xl border border-slate-400 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";
  const labelClass = "mb-2 block text-sm font-medium text-slate-700";
  const metricCardClass = "rounded-2xl bg-slate-200 p-4";
  const sectionTitleClass = "text-2xl font-bold text-slate-900";
  const mutedTextClass = "text-slate-600";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <div className="mb-8">
          <div className="mb-4 inline-flex rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
            V1
          </div>

          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Total Cost of Ownership Calculator
          </h1>

          <p className="max-w-3xl text-base leading-7 text-slate-700">
            Estimate what your car really costs over a year using fuel, insurance, tax,
            maintenance, tyres, repairs, and depreciation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className={cardClass}>
            <div className="mb-6">
              <h2 className={sectionTitleClass}>Inputs</h2>
              <p className={`mt-2 text-sm ${mutedTextClass}`}>
                Enter your own figures or use the defaults as a starting point.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Car value (£)</label>
                <input className={inputClass} type="number" value={carValue} onChange={(e) => setCarValue(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Car age (years)</label>
                <input className={inputClass} type="number" value={carAge} onChange={(e) => setCarAge(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Current mileage</label>
                <input className={inputClass} type="number" value={currentMileage} onChange={(e) => setCurrentMileage(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Car type</label>
                <select className={inputClass} value={carType} onChange={(e) => setCarType(e.target.value)}>
                  <option value="standard">Standard</option>
                  <option value="luxury">Luxury</option>
                  <option value="performance">Performance</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Annual mileage</label>
                <input className={inputClass} type="number" value={annualMiles} onChange={(e) => setAnnualMiles(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Fuel type</label>
                <select className={inputClass} value={fuelType} onChange={(e) => handleFuelTypeChange(e.target.value)}>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="premium_petrol">Premium petrol</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>{efficiencyLabel}</label>
                <input className={inputClass} type="number" step="0.1" value={efficiency} onChange={(e) => setEfficiency(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>{fuelTypeLabel}</label>
                <input className={inputClass} type="number" step="0.1" value={fuelPrice} onChange={(e) => setFuelPrice(Number(e.target.value))} />
              </div>
            </div>

            <div className="my-8 border-t border-slate-300" />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>Insurance (£/year)</label>
                <input className={inputClass} type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Tax / VED (£/year)</label>
                <input className={inputClass} type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Servicing (£/year)</label>
                <input className={inputClass} type="number" value={servicing} onChange={(e) => setServicing(Number(e.target.value))} />
              </div>

              <div>
                <label className={labelClass}>Tyres (£/year)</label>
                <input className={inputClass} type="number" value={tyres} onChange={(e) => setTyres(Number(e.target.value))} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Repairs buffer (£/year)</label>
                <input className={inputClass} type="number" value={repairsBuffer} onChange={(e) => setRepairsBuffer(Number(e.target.value))} />
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className={cardClass}>
              <div className="mb-5">
                <h2 className={sectionTitleClass}>Results</h2>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  A simple estimate of what the car costs you across a full year.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className={metricCardClass}>
                  <div className="text-sm font-medium text-slate-700">Annual cost</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    {currency(results.annualTotal)}
                  </div>
                </div>

                <div className={metricCardClass}>
                  <div className="text-sm font-medium text-slate-700">Monthly cost</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    {currency(results.monthlyTotal)}
                  </div>
                </div>

                <div className={metricCardClass}>
                  <div className="text-sm font-medium text-slate-700">Cost per mile</div>
                  <div className="mt-2 text-3xl font-bold text-slate-900">
                    {currency2(results.costPerMile)}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-300 bg-slate-50 p-5">
                <div className="text-sm font-semibold text-slate-800">What this means</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{interpretation}</p>

                {mileageWarning && (
                  <div className="mt-3 rounded-xl bg-amber-100 border border-amber-300 p-3 text-sm text-amber-800">
                    {mileageWarning}
                  </div>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-5">
                <h2 className={sectionTitleClass}>Breakdown</h2>
                <p className={`mt-2 text-sm ${mutedTextClass}`}>
                  See where the biggest costs are coming from.
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Fuel / energy</span>
                  <span className="font-semibold text-slate-900">
                    {currency(results.annualFuelCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Insurance</span>
                  <span className="font-semibold text-slate-900">{currency(insurance)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Tax / VED</span>
                  <span className="font-semibold text-slate-900">{currency(tax)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Servicing, tyres, repairs</span>
                  <span className="font-semibold text-slate-900">
                    {currency(annualMaintenance)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-700">Depreciation</span>
                  <span className="font-semibold text-slate-900">
                    {currency(results.annualDepreciation)}
                  </span>
                </div>

                <div className="border-t border-slate-300 pt-4">
                  <div className="flex items-center justify-between text-base font-bold text-slate-900">
                    <span>Total annual ownership cost</span>
                    <span>{currency(results.annualTotal)}</span>
                  </div>
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <div className="mb-5">
                <h2 className={sectionTitleClass}>Assumptions</h2>
              </div>

              <div className="space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  Depreciation is estimated from car age, mileage, and car type,
                  with newer and lower mileage cars typically losing value faster.
                </p>
                <p>
                  Fuel defaults are editable, so users can plug in current local prices instead
                  of relying on a fixed assumption.
                </p>
                <p>
                  For electric cars, this version uses a simple energy model with editable
                  electricity price and efficiency.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}