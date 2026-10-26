"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import CarInputs from "@/components/CarInputs";
import { motion } from "framer-motion";
import { DEFAULT_FUEL_PRICES } from "@/lib/vehicleDefaults";
import { useOwnershipCost } from "@/hooks/useOwnershipCost";
import {
  trackCalculatorCompleted,
  trackCalculatorStarted,
  resetCalculatorAttempt,
  trackResultsCtaClicked,
  trackSuccessfulLeadSubmission,
  type ResultsCtaType,
} from "@/lib/gtag";

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
const [similarModalOpen, setSimilarModalOpen] = useState(false);
const [similarSubmitted, setSimilarSubmitted] = useState(false);

const [similarForm, setSimilarForm] = useState({
  postcode: "",
  budget: "",
  radius: "25",
});
      const [ownershipYears, setOwnershipYears] = useState(3);
  const [car, setCar] = useState({

    carValue: 18000,
    carYear: currentYear - 5,
    annualMiles: 10000,
    currentMileage: 50000,
    carType: "standard",
    fuelType: "petrol",
    efficiency: 38,
    fuelPrice: Number(DEFAULT_FUEL_PRICES.petrol),
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

  const [emailModalOpen, setEmailModalOpen] = useState(false);
const [breakdownEmail, setBreakdownEmail] = useState("");
const [emailSending, setEmailSending] = useState(false);
const [emailSent, setEmailSent] = useState(false);
const [emailError, setEmailError] = useState("");

  function handleFuelTypeChange(value: string) {
    setCar((prev) => ({
      ...prev,
      fuelType: value,
      fuelPrice:
        DEFAULT_FUEL_PRICES[value as keyof typeof DEFAULT_FUEL_PRICES] ??
        DEFAULT_FUEL_PRICES.petrol,
      efficiency: value === "electric" ? 3.5 : prev.efficiency < 8 ? 38 : prev.efficiency,
    }));
  }

  const results = useOwnershipCost({
    carValue: car.carValue,
    carAge,
    annualMiles: car.annualMiles,
    currentMileage: car.currentMileage,
    carType: car.carType,
    fuelType: car.fuelType,
    efficiency: car.efficiency,
    fuelPrice: car.fuelPrice,
    insurance: car.insurance,
    tax: car.tax,
    servicing: car.servicing,
    tyres: car.tyres,
    repairsBuffer: car.repairsBuffer,
    miscCosts: car.miscCosts,
    ownershipYears,
  });

useEffect(() => {
  trackCalculatorCompleted({ ownershipYears });
}, [ownershipYears, results.totalCost]);

function trackCtaClick(ctaType: ResultsCtaType) {
  trackResultsCtaClicked(ctaType);
}

function submitSimilarCars(e: React.FormEvent) {
  e.preventDefault();
  setSimilarSubmitted(true);
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
async function sendBreakdownEmail() {
  setEmailSending(true);
  setEmailError("");
  setEmailSent(false);

  try {
    const res = await fetch("/api/email-breakdown", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: breakdownEmail,
        ownershipYears,
        purchaseType: "cash",
        purchaseCost: results.totalDepreciation,
        totalCost: results.totalCost,
        monthlyCost: results.monthlyCost,
        costPerMile: results.costPerMile,
        totalFuelCost: results.totalFuelCost,
        totalInsurance: results.totalInsurance,
        totalTax: results.totalTax,
        totalDepreciation: results.totalDepreciation,
        totalMaintenance: results.totalMaintenance,
        totalMiscCosts: numberOrZero(car.miscCosts) * ownershipYears,
        annualMiles: car.annualMiles,
        carValue: car.carValue,
        carYear: car.carYear,
        fuelType: car.fuelType,
        carType: car.carType,
      }),
    });

    if (!res.ok) throw new Error("Failed");

    trackSuccessfulLeadSubmission(true, "email_breakdown");
    setEmailSent(true);
  } catch {
    setEmailError("Could not send email. Please try again.");
  } finally {
    setEmailSending(false);
  }
}
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
<section className={cardClass}>

  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h2 className={sectionTitleClass}>Results</h2>

    {/* 🔥 Ownership slider */}
    <div className="relative flex w-full rounded-2xl bg-slate-200 p-1">

  {[1, 2, 3, 4].map((year) => (
    <button
      key={year}
      onClick={() => {
        trackCalculatorStarted("single", 1);
        setOwnershipYears(year);
      }}
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
                <span>{currency(results.totalMaintenance)}</span>
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
      Try a different car or explore your options.
    </p>
  </div>

  {/* 🔥 PRIMARY CTA */}
  <button
    onClick={() => {
      trackCtaClick("compare_another_car");
      resetCalculatorAttempt();
      localStorage.setItem("car1", JSON.stringify(car));
      window.location.href = "/compare";
    }}
    className="w-full rounded-2xl bg-slate-900 px-4 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
  >
    Compare another car
  </button>

  {/* 🔹 SECONDARY CTAs */}
  <div className="mt-4 grid gap-3 sm:grid-cols-3">

<button
  onClick={() => {
    trackCtaClick("similar_vehicles");
    setSimilarModalOpen(true);
    setSimilarSubmitted(false);
  }}
  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
>
  Find similar cars
</button>

<button
  onClick={() => {
    console.log("EMAIL CTA CLICKED");

    trackCtaClick("email_breakdown");

    setTimeout(() => {
      setEmailModalOpen(true);
    }, 200);
  }}
  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
>
  Email me this breakdown
</button>

    <button
      onClick={() => trackCtaClick("finance_inquiry")}
      className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 active:scale-95"
    >
      Get finance quotes
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
    {similarModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Find similar cars
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Tell us what you’re looking for and we’ll use this to build better car search next.
          </p>
        </div>

        <button
          onClick={() => setSimilarModalOpen(false)}
          className="rounded-full px-3 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          ×
        </button>
      </div>

      {!similarSubmitted ? (
        <form onSubmit={submitSimilarCars} className="space-y-4">
          <div>
            <label className={labelClass}>Postcode</label>
            <input
              type="text"
              required
              value={similarForm.postcode}
              onChange={(e) =>
                setSimilarForm((prev) => ({
                  ...prev,
                  postcode: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="e.g. HD1"
            />
          </div>

          <div>
            <label className={labelClass}>Budget (£)</label>
            <input
              type="number"
              required
              value={similarForm.budget}
              onChange={(e) =>
                setSimilarForm((prev) => ({
                  ...prev,
                  budget: e.target.value,
                }))
              }
              className={inputClass}
              placeholder="e.g. 20000"
            />
          </div>

          <div>
            <label className={labelClass}>Search radius</label>
            <select
              value={similarForm.radius}
              onChange={(e) =>
                setSimilarForm((prev) => ({
                  ...prev,
                  radius: e.target.value,
                }))
              }
              className={inputClass}
            >
              <option value="10">10 miles</option>
              <option value="25">25 miles</option>
              <option value="50">50 miles</option>
              <option value="100">100 miles</option>
              <option value="national">Nationwide</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            Show me similar cars
          </button>
        </form>
      ) : (
        <div className="rounded-2xl bg-slate-100 p-5">
          <h3 className="text-lg font-bold text-slate-900">
            Nice — we’ve logged your interest.
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Similar car search is one of the next features we’re testing.
          </p>

          <button
            onClick={() => setSimilarModalOpen(false)}
            className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
)}

{emailModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-slate-900">
        Email me this breakdown
      </h3>

      <p className="mt-2 text-sm text-slate-600">
        Get your ownership cost estimate sent to your inbox.
      </p>

      <input
        type="email"
        value={breakdownEmail}
        onChange={(e) => setBreakdownEmail(e.target.value)}
        placeholder="you@example.com"
        className="mt-4 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
      />

      {emailError && (
        <p className="mt-3 text-sm text-red-600">{emailError}</p>
      )}

      {emailSent && (
        <p className="mt-3 text-sm text-green-600">
          Sent — check your inbox.
        </p>
      )}

      <div className="mt-5 flex gap-3">
        <button
          onClick={() => setEmailModalOpen(false)}
          className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700"
        >
          Cancel
        </button>

<button
  onClick={sendBreakdownEmail}
  disabled={emailSending || !breakdownEmail}
  className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
>
  {emailSending ? "Sending..." : "Send"}
</button>
      </div>
    </div>
  </div>
)}

  </main>
);
}