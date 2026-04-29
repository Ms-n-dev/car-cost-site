"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import CarInputs from "@/components/CarInputs";
import { motion } from "framer-motion";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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
  const currentYear = new Date().getFullYear();

      const [ownershipYears, setOwnershipYears] = useState(3);
const resultsRef = useRef<HTMLElement | null>(null);
const hasViewedResults = useRef(false);
  const [car, setCar] = useState({

    carValue: 18000,
    carYear: currentYear - 5,
    annualMiles: 10000,
    currentMileage: 50000,
    carType: "standard",
    fuelType: "petrol",
    efficiency: 38,
    fuelPrice: 158.5,
    insurance: 900,
    tax: 190,
    servicing: 350,
    tyres: 300,
    repairsBuffer: 400,
    miscCosts: 0,

  // 🔥 ADD THESE (for dropdowns to work)
  carTypeOpen: false,
  fuelTypeOpen: false,
  carYearOpen: false,
  });

  const carAge = useMemo(() => {
    return Math.max(currentYear - car.carYear, 0);
  }, [car.carYear, currentYear]);

  const fuelDefaults = {
    petrol: 158.5,
    diesel: 191.5,
    premium_petrol: 171.0,
    electric: 7.5,
  } as const;

  function handleFuelTypeChange(value: string) {
    setCar((prev) => ({
      ...prev,
      fuelType: value,
      fuelPrice:
        value === "electric"
          ? fuelDefaults.electric
          : fuelDefaults[value as keyof typeof fuelDefaults],
      efficiency: value === "electric" ? 3.5 : prev.efficiency < 8 ? 38 : prev.efficiency,
    }));
  }

  const depreciationRate = useMemo(() => {
    if (carAge <= 2) return 0.18;
    if (carAge <= 5) return 0.12;
    if (carAge <= 8) return 0.08;
    return 0.05;
  }, [carAge]);

  const mileageFactor = useMemo(() => {
    if (car.currentMileage <= 30000) return 1.25;
    if (car.currentMileage <= 80000) return 1.0;
    if (car.currentMileage <= 120000) return 0.75;
    return 0.6;
  }, [car.currentMileage]);

  const carTypeFactor = useMemo(() => {
    if (car.carType === "luxury") return 1.15;
    if (car.carType === "performance") return 1.2;
    return 1.0;
  }, [car.carType]);

  const usageFactor = useMemo(() => {
    if (car.annualMiles <= 6000) return 0.9;
    if (car.annualMiles <= 12000) return 1.0;
    if (car.annualMiles <= 20000) return 1.15;
    if (car.annualMiles <= 30000) return 1.3;
    return 1.5;
  }, [car.annualMiles]);

  const annualMaintenance = useMemo(() => {
    return numberOrZero(car.servicing) + numberOrZero(car.tyres) + numberOrZero(car.repairsBuffer);
  }, [car.servicing, car.tyres, car.repairsBuffer]);

  const results = useMemo(() => {
const carValue = +car.carValue || 0;
const annualMiles = +car.annualMiles || 0;
const currentMileage = +car.currentMileage || 0;
const efficiency = +car.efficiency || 0;
const fuelPrice = +car.fuelPrice || 0;
const insurance = +car.insurance || 0;
const tax = +car.tax || 0;
const servicing = +car.servicing || 0;
const tyres = +car.tyres || 0;
const repairsBuffer = +car.repairsBuffer || 0;
    const years = Number(ownershipYears) || 1;
    const litresPerGallon = 4.54609;

const miscCosts = numberOrZero(car.miscCosts) * years;

let annualFuelCost = 0;

if (car.fuelType === "electric") {
  const milesPerKwh = Math.max(efficiency, 0.1);
  const annualKwhUsed = annualMiles / milesPerKwh;
  annualFuelCost = annualKwhUsed * (fuelPrice / 100);
} else {
  const mpg = Math.max(efficiency, 1);
  const gallonsUsed = annualMiles / mpg;
  const litresUsed = gallonsUsed * 4.54609;
  annualFuelCost = litresUsed * (fuelPrice / 100);
}

let totalDepreciation = 0;
let currentValue = carValue;
let mileage = currentMileage;

for (let i = 0; i < years; i++) {

  const ageThisYear = carAge + i;

  let rate = 0.05;
  if (ageThisYear <= 2) rate = 0.18;
  else if (ageThisYear <= 5) rate = 0.12;
  else if (ageThisYear <= 8) rate = 0.08;

  let mileageFactorYear = 1;
  if (mileage <= 30000) mileageFactorYear = 1.25;
  else if (mileage <= 80000) mileageFactorYear = 1.0;
  else if (mileage <= 120000) mileageFactorYear = 0.75;
  else mileageFactorYear = 0.6;

  const depreciationThisYear =
    currentValue *
    rate *
    mileageFactorYear *
    carTypeFactor *
    usageFactor;

  totalDepreciation += depreciationThisYear;

  currentValue -= depreciationThisYear;
  mileage += annualMiles;
}

const totalFuelCost = annualFuelCost * years;


const totalMaintenance = annualMaintenance * years;
const totalCost =
  totalFuelCost +
  (numberOrZero(car.insurance) * years) +
  (numberOrZero(car.tax) * years) +
  totalMaintenance +
  totalDepreciation +
  miscCosts;

const monthlyCost = totalCost / (years * 12);
const costPerMile =
  totalCost / Math.max(annualMiles * years, 1);

return {
  totalCost,
  monthlyCost,
  costPerMile,
  totalDepreciation,
  totalFuelCost,
  totalInsurance: insurance * years,
  totalTax: tax * years,
};
}, [car, depreciationRate, mileageFactor, carTypeFactor, usageFactor, annualMaintenance, ownershipYears]);

useEffect(() => {
  window.gtag?.("event", "recalculated_result");
}, [results]);
useEffect(() => {
  if (!resultsRef.current) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !hasViewedResults.current) {
        hasViewedResults.current = true;

        window.gtag?.("event", "viewed_result", {
          ownership_years: ownershipYears,
          total_cost: Math.round(results.totalCost),
          monthly_cost: Math.round(results.monthlyCost),
          fuel_type: car.fuelType,
          car_type: car.carType,
        });

        observer.disconnect();
      }
    },
    {
      threshold: 0.5,
    }
  );

  observer.observe(resultsRef.current);

  return () => observer.disconnect();
}, [ownershipYears, results.totalCost, results.monthlyCost, car.fuelType, car.carType]);

function trackCtaClick(eventName: string) {
  window.gtag?.("event", eventName, {
    ownership_years: ownershipYears,
    total_cost: Math.round(results.totalCost),
    monthly_cost: Math.round(results.monthlyCost),
    fuel_type: car.fuelType,
    car_type: car.carType,
  });
}

const mileageWarning = useMemo(() => {
  const currentMileage = Number(car.currentMileage) || 0;
  const annualMiles = Number(car.annualMiles) || 0;
  const age = Number(carAge) || 0;

  const lowerNow = age * 6000;
  const upperNow = age * 14000;

  const projectedMileage = currentMileage + annualMiles;
  const nextYearAge = age + 1;

  const lowerNext = nextYearAge * 6000;
  const upperNext = nextYearAge * 14000;

  if (currentMileage > 120000) {
    return "High mileage car — depreciation slows, but repair risk increases.";
  }

  if (currentMileage > upperNow || projectedMileage > upperNext) {
    return "High mileage for its age — your driving may accelerate depreciation.";
  }

  if (
    currentMileage < lowerNow &&
    projectedMileage < lowerNext &&
    age > 2
  ) {
    return "Low mileage for its age — this may positively impact resale value.";
  }

  return null;
}, [car, carAge]);

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

      <div className="mb-6 flex items-center justify-between">
        <Navbar />
      </div>

<div className="mb-8 max-w-4xl">

  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
    What will your next car cost you?
  </h1>

  <p className="mt-3 text-base text-slate-700 max-w-2xl">
    Estimate the true cost of ownership over time — including depreciation, fuel, insurance and maintenance.
  </p>

  <p className="mt-2 text-sm text-slate-400">
    Built using UK cost assumptions and real-world averages
  </p>

</div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">

        {/* LEFT */}
        <section className={cardClass}>
          <h2 className={`${sectionTitleClass} mb-4`}>Inputs</h2>

          <CarInputs
            data={car}
            setData={setCar}
            inputClass={inputClass}
            labelClass={labelClass}
            handleFuelTypeChange={handleFuelTypeChange}
          />
        </section>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* RESULTS */}
<section ref={resultsRef} className={cardClass}>

  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 className={sectionTitleClass}>Results</h2>

    {/* 🔥 Ownership slider */}
    <div className="relative flex w-full rounded-2xl bg-slate-200 p-1">

  {[1, 2, 3, 4].map((year) => (
    <button
      key={year}
      onClick={() => setOwnershipYears(year)}
      className={`relative z-10 flex-1 whitespace-nowrap px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition active:scale-95 ${
        ownershipYears === year
          ? "text-slate-900 font-semibold"
          : "text-slate-500"
      }`}
    >
      {year} year{year > 1 ? "s" : ""}
    </button>
  ))}

  <motion.div
    layout
    className="absolute top-1 bottom-1 rounded-xl bg-white shadow-sm"
    style={{
      width: "25%",
      left: `${(ownershipYears - 1) * 25}%`,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  />

</div>
  </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className={metricCardClass}>
                <div>Total cost ({ownershipYears} yr)</div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {currency(results.totalCost)}
                </div>
              </div>

              <div className={metricCardClass}>
                <div>Monthly cost</div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {currency(results.monthlyCost)}
                </div>
              </div>

              <div className={metricCardClass}>
                <div>Cost per mile</div>
                <div className="text-2xl sm:text-3xl font-bold">
                  {currency2(results.costPerMile)}
                </div>
              </div>
            </div>

            {mileageWarning && (
              <div className="mt-4 text-sm text-amber-700">
                {mileageWarning}
              </div>
            )}

          </section>

          {/* BREAKDOWN */}
          <section className={cardClass}>
            <h2 className={sectionTitleClass}>
              Breakdown ({ownershipYears} yr)
            </h2>

            <div className="space-y-4 mt-4 text-sm sm:text-base">

              <div className="flex justify-between">
                <span>Fuel</span>
                <span>{currency(results.totalFuelCost)}</span>
              </div>

              <div className="flex justify-between">
                <span>Insurance</span>
                <span>{currency(results.totalInsurance)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>{currency(results.totalTax)}</span>
              </div>

              <div className="flex justify-between">
                <span>Maintenance</span>
                <span>{currency(annualMaintenance * ownershipYears)}</span>
              </div>

              <div className="flex justify-between">
                <span>Depreciation</span>
                <span>{currency(results.totalDepreciation)}</span>
              </div>

              {numberOrZero(car.miscCosts) > 0 && (
  <div className="flex justify-between">
    <span>Additional costs</span>
    <span>{currency(numberOrZero(car.miscCosts) * ownershipYears)}</span>
  </div>
)}

              <div className="border-t border-slate-300 pt-4 mt-4">
  <div className="flex items-center justify-between text-base font-bold text-slate-900">
    <span>Total ownership cost ({ownershipYears} yr)</span>
    <span>{currency(results.totalCost)}</span>
  </div>
</div>


            </div>
          </section>
{/* NEXT STEP CTA */}
<section className={cardClass}>
  <div className="mb-5">
    <h2 className={sectionTitleClass}>What next?</h2>
    <p className="mt-2 text-sm text-slate-600">
      Get real quotes, save your breakdown, or compare similar cars.
    </p>
  </div>

  <div className="grid gap-3 sm:grid-cols-3">
    <button
      onClick={() => trackCtaClick("clicked_finance_cta")}
      className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
    >
      Get finance quotes
    </button>

    <button
      onClick={() => trackCtaClick("clicked_email_cta")}
      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
    >
      Email me this breakdown
    </button>

    <button
      onClick={() => trackCtaClick("clicked_similar_cta")}
      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
    >
      Find similar cars
    </button>
  </div>

  <p className="mt-4 text-xs text-slate-400">
    We’re testing which next step people care about most.
  </p>
</section>
          {/* ASSUMPTIONS */}
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
      Mileage is projected over the selected ownership period, so higher
      annual mileage will increase both running costs and depreciation.
    </p>

    <p>
      Fuel costs are based on your entered efficiency and fuel price,
      and scale with your annual mileage.
    </p>

    <p>
      Maintenance includes servicing, tyres, and a repair buffer, and is
      assumed to remain consistent each year.
    </p>

    <p>
      All values are estimates and do not account for unexpected repairs,
      market changes, or resale timing.
    </p>
    <div className="pt-3 text-xs text-slate-500">
  For feedback or enquiries, please contact{" "}
  <a
    href="mailto:admincarcalc@gmail.com"
    className="font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
  >
    admincarcalc@gmail.com
  </a>
</div>
  </div>
</section>

        </div>

      </div>

    </div>
  </main>
);
}