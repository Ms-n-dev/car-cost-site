"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCarCost } from "../../hooks/useCarCost";
import Navbar from "../../components/Navbar";
import CarInputs from "../../components/CarInputs";

function currency(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function currency2(value: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function ComparePage() {

  const currentYear = new Date().getFullYear();

  // CAR 1
  const [car1, setCar1] = useState({
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
    carTypeOpen: false,
fuelTypeOpen: false,
carYearOpen: false,
  });

  // CAR 2
  const [car2, setCar2] = useState({
    ...car1,
  });
useEffect(() => {
  const savedCar = localStorage.getItem("car1");

  if (savedCar) {
    const parsed = JSON.parse(savedCar);

    setCar1(parsed);

    // 👇 This is important
    // Prefill car2 with SAME base but slightly tweaked
    setCar2({
      ...parsed,
      carValue: parsed.carValue * 1.1, // +10% price so user sees a difference
    });
  }
}, []);
  // DERIVED AGE
  const car1Age = useMemo(() => currentYear - car1.carYear, [car1.carYear, currentYear]);
  const car2Age = useMemo(() => currentYear - car2.carYear, [car2.carYear, currentYear]);

  const fuelDefaults = {
    petrol: 158.5,
    diesel: 191.5,
    premium_petrol: 171.0,
    electric: 7.5,
  } as const;

  function handleFuelTypeChange(setter: any) {
    return (value: string) => {
      setter((prev: any) => ({
        ...prev,
        fuelType: value,
        fuelPrice:
          value === "electric"
            ? fuelDefaults.electric
            : fuelDefaults[value as keyof typeof fuelDefaults],
        efficiency: value === "electric" ? 3.5 : prev.efficiency < 8 ? 38 : prev.efficiency,
      }));
    };
  }

  const results1 = useCarCost({ ...car1, carAge: car1Age });
  const results2 = useCarCost({ ...car2, carAge: car2Age });
  const costDifference = results2.annualTotal - results1.annualTotal;
const isCar2Cheaper = costDifference < 0;

  const cardClass =
    "rounded-3xl border border-slate-300 bg-white p-6 shadow-md shadow-slate-200/70";

  const inputClass =
    "w-full rounded-2xl border border-slate-400 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200";

  const labelClass =
    "mb-2 block text-sm font-medium text-slate-700";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">

        <Navbar />

        <div className="mb-8">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Compare Two Cars
          </h1>

          <p className="max-w-3xl text-base leading-7 text-slate-700">
            Compare the real cost of ownership side-by-side including fuel,
            insurance, tax, maintenance, and depreciation.
          </p>
        </div>

        {/* INPUTS */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Car 1 */}
          <section className={cardClass}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Car 1
            </h2>

            <CarInputs
              data={car1}
              setData={setCar1}
              inputClass={inputClass}
              labelClass={labelClass}
              handleFuelTypeChange={handleFuelTypeChange(setCar1)}
            />


          </section>

          {/* Car 2 */}
          <section className={cardClass}>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Car 2
            </h2>

            <CarInputs
              data={car2}
              setData={setCar2}
              inputClass={inputClass}
              labelClass={labelClass}
              handleFuelTypeChange={handleFuelTypeChange(setCar2)}
            />

          </section>

        </div>

        {/* SUMMARY */}
        <section className={`mt-8 ${cardClass}`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Summary
          </h2>
          <div className="mb-4 text-sm text-slate-700">
  {costDifference === 0 ? (
    "Both cars cost roughly the same per year."
  ) : costDifference > 0 ? (
    <>Car 2 costs <span className="font-semibold">{currency(Math.abs(costDifference))}</span> more per year than Car 1.</>
  ) : (
    <>Car 2 is <span className="font-semibold">{currency(Math.abs(costDifference))}</span> cheaper per year than Car 1.</>
  )}
</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-700">
              <thead>
                <tr className="border-b border-slate-300 text-left">
                  <th className="py-2">Metric</th>
<th>Car 1</th>
<th>Car 2</th>
                </tr>
              </thead>

              <tbody>

  {/* Annual Cost */}
  <tr className="border-b border-slate-200">
    <td className="py-3 font-medium">Annual Cost</td>

    {(() => {
      const diff = results2.annualTotal - results1.annualTotal;
      const equal = Math.abs(diff) < 50;

      const car1Class = equal
        ? ""
        : diff > 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      const car2Class = equal
        ? ""
        : diff < 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      return (
        <>
          <td>
            <span className={car1Class}>
              {currency(results1.annualTotal)}
            </span>
          </td>

          <td>
            <span className={car2Class}>
              {currency(results2.annualTotal)}
            </span>
          </td>
        </>
      );
    })()}
  </tr>

  {/* Monthly Cost */}
  <tr className="border-b border-slate-200">
    <td className="py-3 font-medium">Monthly Cost</td>

    {(() => {
      const diff = results2.monthlyTotal - results1.monthlyTotal;
      const equal = Math.abs(diff) < 5;

      const car1Class = equal
        ? ""
        : diff > 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      const car2Class = equal
        ? ""
        : diff < 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      return (
        <>
          <td>
            <span className={car1Class}>
              {currency(results1.monthlyTotal)}
            </span>
          </td>

          <td>
            <span className={car2Class}>
              {currency(results2.monthlyTotal)}
            </span>
          </td>
        </>
      );
    })()}
  </tr>

  {/* Cost per mile */}
  <tr>
    <td className="py-3 font-medium">Cost per mile</td>

    {(() => {
      const diff = results2.costPerMile - results1.costPerMile;
      const equal = Math.abs(diff) < 0.01;

      const car1Class = equal
        ? ""
        : diff > 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      const car2Class = equal
        ? ""
        : diff < 0
        ? "bg-green-100 text-green-800 px-2 py-1 rounded font-semibold"
        : "bg-red-100 text-red-800 px-2 py-1 rounded font-semibold";

      return (
        <>
          <td>
            <span className={car1Class}>
              {currency2(results1.costPerMile)}
            </span>
          </td>

          <td>
            <span className={car2Class}>
              {currency2(results2.costPerMile)}
            </span>
          </td>
        </>
      );
    })()}
  </tr>

</tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}