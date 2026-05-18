"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VehicleStep from "../../components/v2/VehicleStep";
import PurchaseStep from "@/components/v2/PurchaseStep";
import CostsStep from "@/components/v2/CostsStep";
import ResultsStep from "@/components/v2/ResultsStep";
import ProgressBar from "@/components/v2/ProgressBar";
import Link from "next/link";
import { useOwnershipCost } from "@/hooks/useOwnershipCost";

export type PurchaseType = "cash" | "finance";

export type V2FormData = {
  reg: string;
  makeModel: string;

  purchaseType: PurchaseType | "";

  carValue: number | "";
  carYear: number | "";
  currentMileage: number | "";
  annualMiles: number | "";
ownershipYears: number | "";

fuelType: "" | "petrol" | "diesel" | "premium_petrol" | "electric";
  efficiency: number | "";
  fuelPrice: number | "";

  deposit: number | "";
  monthlyPayment: number | "";
  financeTermMonths: number | "";

  insurance: number | "";
  tax: number | "";
  servicing: number | "";
  tyres: number | "";
  repairs: number | "";
  miscCosts: number | "";
};

const initialData: V2FormData = {
  reg: "",
  makeModel: "",
  purchaseType: "",

  carValue: "",
  carYear: new Date().getFullYear() - 5,
  currentMileage: "",
  annualMiles: 8000,
  ownershipYears: 3,

fuelType: "",
efficiency: "",
fuelPrice: "",

  deposit: "",
  monthlyPayment: "",
  financeTermMonths: 36,

  insurance: "",
  tax: "",

  servicing: "",
  tyres: "",
  repairs: "",
  miscCosts: "",
};

function n(value: number | "") {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}



export default function V2Page() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<V2FormData>(initialData);
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, [step]);
  const currentYear = new Date().getFullYear();

const carAge =
  data.carYear === ""
    ? 5
    : Math.max(currentYear - Number(data.carYear), 0);

const ownership = useOwnershipCost({
  carValue: data.carValue,
  carAge,
  annualMiles: data.annualMiles,
  currentMileage: data.currentMileage,
  carType: "standard",
  fuelType: data.fuelType,
  efficiency: data.efficiency,
  fuelPrice: data.fuelPrice,
  insurance: data.insurance,
  tax: data.tax,
  servicing: data.servicing,
  tyres: data.tyres,
  repairsBuffer: data.repairs,
  miscCosts: data.miscCosts,
  ownershipYears: data.ownershipYears,
});

const years = Number(data.ownershipYears) || 3;
const months = years * 12;



let purchaseCost = 0;
let financeTotal = 0;

if (data.purchaseType === "cash") {
  purchaseCost = ownership.totalDepreciation;
}

if (data.purchaseType === "finance") {
  financeTotal =
    n(data.deposit) +
    n(data.monthlyPayment) *
      Math.min(n(data.financeTermMonths), months || 0);

  purchaseCost = financeTotal;
}

const runningCosts =
  ownership.totalInsurance +
  ownership.totalTax +
ownership.totalFuelCost +
  ownership.totalMaintenance +
  ownership.totalMiscCosts;

const totalCost = purchaseCost + runningCosts;
const monthlyCost = months > 0 ? totalCost / months : 0;

const results = {
  totalCost,
  monthlyCost,
  purchaseCost,
  financeTotal,
  runningCosts,
  totalDepreciation: ownership.totalDepreciation,
  estimatedResaleValue: ownership.estimatedFutureValue,
  insuranceTotal: ownership.totalInsurance,
  taxTotal: ownership.totalTax,
  fuelTotal: ownership.totalFuelCost,
  servicingTotal: n(data.servicing) * years,
  tyresTotal: n(data.tyres) * years,
  repairsTotal: n(data.repairs) * years,
  miscTotal: n(data.miscCosts) * years,
};

  const updateData = (patch: Partial<V2FormData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const next = () => setStep((prev) => Math.min(prev + 1, 4));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-4 text-slate-950 sm:py-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
  <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />

  <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-slate-300/30 blur-3xl" />
</div>

<div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">

  <header className="mx-auto flex w-full max-w-6xl items-center justify-between py-4">
    <div className="text-xl font-semibold tracking-tight text-slate-950">
      CarCalc
    </div>

<nav className="flex items-center gap-3 text-xs font-medium text-slate-500 sm:gap-4 sm:text-sm">
  <Link href="/compare" className="transition hover:text-slate-950">
    Compare
  </Link>

  <Link href="/how-it-works" className="transition hover:text-slate-950">
    How it works
  </Link>
</nav>
  </header>


        <ProgressBar step={step} />

        <div className="flex flex-1 items-center justify-center py-6 sm:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.98 }}
              transition={{
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
}}
              className="w-full"
            >
              {step === 1 && (
                <VehicleStep data={data} updateData={updateData} next={next} />
              )}

              {step === 2 && (
                <PurchaseStep
                  data={data}
                  updateData={updateData}
                  next={next}
                  back={back}
                />
              )}

              {step === 3 && (
                <CostsStep
                  data={data}
                  updateData={updateData}
                  next={next}
                  back={back}
                />
              )}

              {step === 4 && (
<ResultsStep
  data={data}
  results={results}
  updateData={updateData}
  back={back}
  restart={() => {
    setData(initialData);
    setStep(1);
  }}
/>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>


<footer className="mt-10 border-t border-slate-200 py-6">
  <div className="mx-auto flex max-w-5xl items-center justify-center gap-6 text-sm text-slate-500">
    <Link href="/privacy" className="hover:text-slate-900">
      Privacy
    </Link>

    <Link href="/terms" className="hover:text-slate-900">
      Terms
    </Link>
  </div>
</footer>



    </main>
  );
}