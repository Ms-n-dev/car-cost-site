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
  const [currentMileage, setCurrentMileage] = useState(50000);
  const [annualMiles, setAnnualMiles] = useState(10000);
  const [carType, setCarType] = useState("saloon");

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

  // ===============================
  // NEW DEPRECIATION MODEL
  // ===============================
  const depreciationRate = useMemo(() => {
    let maxDep = 0.28;
    let minDep = 0.04;
    let decay = 0.25;

    if (carType === "suv") decay = 0.2;
    if (carType === "luxury") decay = 0.3;
    if (carType === "ev") decay = 0.35;

    const baseRate = minDep + (maxDep - minDep) * Math.exp(-decay * carAge);

    const expectedMileage = Math.max(carAge * 10000, 5000);
    const mileageRatio = currentMileage / expectedMileage;

    let mileageMultiplier = 1;

    if (mileageRatio <= 0.7) mileageMultiplier = 0.9;
    else if (mileageRatio <= 1.0) mileageMultiplier = 0.95;
    else if (mileageRatio <= 1.3) mileageMultiplier = 1.05;
    else if (mileageRatio <= 1.6) mileageMultiplier = 1.15;
    else mileageMultiplier = 1.25;

    const futureMileage = currentMileage + annualMiles;
    const futureExpected = (carAge + 1) * 10000;
    const futureRatio = futureMileage / futureExpected;

    let futureImpact = 1;
    if (futureRatio > mileageRatio) futureImpact = 1.1;
    else if (futureRatio < mileageRatio) futureImpact = 0.95;

    return baseRate * mileageMultiplier * futureImpact;
  }, [carAge, currentMileage, annualMiles, carType]);

  const annualMaintenance = useMemo(() => {
    return numberOrZero(servicing) + numberOrZero(tyres) + numberOrZero(repairsBuffer);
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

    const annualDepreciation = numberOrZero(carValue) * depreciationRate;

    const annualTotal =
      annualFuelCost +
      numberOrZero(insurance) +
      numberOrZero(tax) +
      annualMaintenance +
      annualDepreciation;

    return {
      annualFuelCost,
      annualDepreciation,
      annualTotal,
      monthlyTotal: annualTotal / 12,
      costPerMile: annualTotal / Math.max(numberOrZero(annualMiles), 1),
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
  ]);

  const interpretation = useMemo(() => {
    if (results.annualTotal < 3500) {
      return `Low ownership cost at ${currency(results.monthlyTotal)} per month.`;
    }
    if (results.annualTotal > 7000) {
      return `High ownership cost at ${currency(results.monthlyTotal)} per month.`;
    }
    return `Moderate ownership cost at ${currency(results.monthlyTotal)} per month.`;
  }, [results]);

  const mileageInsight = useMemo(() => {
    const expected = Math.max(carAge * 10000, 5000);
    const percent = ((currentMileage - expected) / expected) * 100;

    if (percent > 30)
      return `High mileage: ${percent.toFixed(0)}% above expected.`;

    if (percent > 10)
      return `Above average mileage: ${percent.toFixed(0)}%.`;

    if (percent < -20)
      return `Low mileage: ${Math.abs(percent).toFixed(0)}% below expected.`;

    return `Mileage is normal for its age.`;
  }, [carAge, currentMileage]);

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
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-4xl font-bold">Total Cost of Ownership</h1>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>Inputs</h2>

            <div className="grid gap-5 md:grid-cols-2 mt-4">

              <input className={inputClass} type="number" value={carValue} onChange={(e)=>setCarValue(Number(e.target.value))}/>
              <input className={inputClass} type="number" value={carAge} onChange={(e)=>setCarAge(Number(e.target.value))}/>
              <input className={inputClass} type="number" value={currentMileage} onChange={(e)=>setCurrentMileage(Number(e.target.value))}/>
              <input className={inputClass} type="number" value={annualMiles} onChange={(e)=>setAnnualMiles(Number(e.target.value))}/>

              <select className={inputClass} value={carType} onChange={(e)=>setCarType(e.target.value)}>
                <option value="saloon">Saloon</option>
                <option value="suv">SUV</option>
                <option value="luxury">Luxury</option>
                <option value="ev">EV</option>
              </select>

            </div>
          </section>

          <div className="space-y-6">

            <section className={cardClass}>
              <h2 className={sectionTitleClass}>Results</h2>

              <div className="grid gap-4 md:grid-cols-3 mt-4">
                <div className={metricCardClass}>{currency(results.annualTotal)}</div>
                <div className={metricCardClass}>{currency(results.monthlyTotal)}</div>
                <div className={metricCardClass}>{currency2(results.costPerMile)}</div>
              </div>

              <div className="mt-4">{interpretation}</div>

              <div className="mt-4 text-sm text-slate-700">
                <strong>Mileage insight:</strong> {mileageInsight}
              </div>

            </section>

          </div>
        </div>
      </div>
    </main>
  );
}