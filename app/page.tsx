"use client";

import React, { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import CarInputs from "@/components/CarInputs";

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
    const litresPerGallon = 4.54609;

    let annualFuelCost = 0;

    if (car.fuelType === "electric") {
      const milesPerKwh = Math.max(numberOrZero(car.efficiency), 0.1);
      const annualKwhUsed = numberOrZero(car.annualMiles) / milesPerKwh;
      annualFuelCost = annualKwhUsed * (numberOrZero(car.fuelPrice) / 100);
    } else {
      const mpg = Math.max(numberOrZero(car.efficiency), 1);
      const gallonsUsed = numberOrZero(car.annualMiles) / mpg;
      const litresUsed = gallonsUsed * litresPerGallon;
      annualFuelCost = litresUsed * (numberOrZero(car.fuelPrice) / 100);
    }

    const annualDepreciation =
      numberOrZero(car.carValue) *
      depreciationRate *
      mileageFactor *
      carTypeFactor *
      usageFactor;

    const annualTotal =
      annualFuelCost +
      numberOrZero(car.insurance) +
      numberOrZero(car.tax) +
      annualMaintenance +
      annualDepreciation;

    return {
      annualFuelCost,
      annualDepreciation,
      annualTotal,
      monthlyTotal: annualTotal / 12,
      costPerMile: annualTotal / Math.max(numberOrZero(car.annualMiles), 1),
    };
  }, [car, depreciationRate, mileageFactor, carTypeFactor, usageFactor, annualMaintenance]);

  const mileageWarning = useMemo(() => {
    const lowerNow = carAge * 6000;
    const upperNow = carAge * 14000;

    const projectedMileage = car.currentMileage + car.annualMiles;
    const nextYearAge = carAge + 1;

    const lowerNext = nextYearAge * 6000;
    const upperNext = nextYearAge * 14000;

    if (car.currentMileage > 120000) {
      return "High mileage car — depreciation slows, but repair risk increases.";
    }

    if (car.currentMileage > upperNow || projectedMileage > upperNext) {
      return "High mileage for its age — your driving may accelerate depreciation.";
    }

    if (
      car.currentMileage < lowerNow &&
      projectedMileage < lowerNext &&
      carAge > 2
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

        <div className="mb-8">
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
            <h2 className={`${sectionTitleClass} mb-4`}>Inputs</h2>

            <CarInputs
              data={car}
              setData={setCar}
              inputClass={inputClass}
              labelClass={labelClass}
              handleFuelTypeChange={handleFuelTypeChange}
            />


          </section>

          <div className="space-y-6">

            <section className={cardClass}>
              <h2 className={`${sectionTitleClass} mb-4`}>Results</h2>

              <div className="grid gap-4 md:grid-cols-3">
                <div className={metricCardClass}>
                  <div>Annual cost</div>
                  <div className="text-3xl font-bold">{currency(results.annualTotal)}</div>
                </div>

                <div className={metricCardClass}>
                  <div>Monthly cost</div>
                  <div className="text-3xl font-bold">{currency(results.monthlyTotal)}</div>
                </div>

                <div className={metricCardClass}>
                  <div>Cost per mile</div>
                  <div className="text-3xl font-bold">{currency2(results.costPerMile)}</div>
                </div>
              </div>

              {mileageWarning && (
                <div className="mt-4 text-sm text-amber-700">
                  {mileageWarning}
                </div>
              )}
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
      <span className="font-semibold text-slate-900">
        {currency(car.insurance)}
      </span>
    </div>

    <div className="flex items-center justify-between">
      <span className="text-slate-700">Tax / VED</span>
      <span className="font-semibold text-slate-900">
        {currency(car.tax)}
      </span>
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