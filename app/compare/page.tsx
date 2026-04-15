"use client";

import React, { useState } from "react";
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

  // CAR 1
  const [car1, setCar1] = useState({
    carValue: 18000,
    carAge: 5,
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

  // CAR 2
  const [car2, setCar2] = useState({
    ...car1,
  });

  const results1 = useCarCost(car1);
  const results2 = useCarCost(car2);

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

        {/* CAR INPUTS */}
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
            />
          </section>

        </div>

        {/* SUMMARY */}
        <section className={`mt-8 ${cardClass}`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Summary
          </h2>

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

                <tr className="border-b border-slate-200">
                  <td className="py-3 font-medium">Annual Cost</td>
                  <td>{currency(results1.annualTotal)}</td>
                  <td>{currency(results2.annualTotal)}</td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="py-3 font-medium">Monthly Cost</td>
                  <td>{currency(results1.monthlyTotal)}</td>
                  <td>{currency(results2.monthlyTotal)}</td>
                </tr>

                <tr>
                  <td className="py-3 font-medium">Cost per mile</td>
                  <td>{currency2(results1.costPerMile)}</td>
                  <td>{currency2(results2.costPerMile)}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}