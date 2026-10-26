"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VehicleStep from "../../components/v2/VehicleStep";
import PurchaseStep from "@/components/v2/PurchaseStep";
import ResultsStep from "@/components/v2/ResultsStep";
import ProgressBar from "@/components/v2/ProgressBar";
import Link from "next/link";
import { useOwnershipCost } from "@/hooks/useOwnershipCost";
import { resetCalculatorAttempt, trackCalculatorStepReached } from "@/lib/gtag";
import {
  getVehicleEstimate,
  type FuelType,
  type VehicleClass,
} from "@/lib/vehicleEstimates";

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

  fuelType: FuelType | "";
  carType: VehicleClass;
  efficiency: number | "";
  fuelPrice: number | "";

  deposit: number | "";
  monthlyPayment: number | "";
  financeTermMonths: number | "";
  finalPayment: number | "";

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
carType: "standard",
efficiency: "",
fuelPrice: "",

  deposit: "",
  monthlyPayment: "",
  financeTermMonths: 36,
  finalPayment: "",

  insurance: "",
  tax: "",

  servicing: "",
  tyres: "",
  repairs: "",
  miscCosts: "",
};

function n(value: number | "") {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 0;
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
  carType: data.carType,
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
  const financeTerm = n(data.financeTermMonths);
  financeTotal =
    n(data.deposit) +
    n(data.monthlyPayment) *
      Math.min(financeTerm, months || 0) +
    (financeTerm > 0 && financeTerm <= months ? n(data.finalPayment) : 0);

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

const next = () => {
  if (step === 2) {
    const [make = "", model = ""] = data.makeModel.split(" | ");
    const estimate = getVehicleEstimate(make, model, data.fuelType);

    setData((current) => ({
      ...current,
      fuelType: current.fuelType || estimate.fuelType,
      carType: estimate.carType,
      efficiency: current.efficiency === "" ? estimate.efficiency : current.efficiency,
      fuelPrice: current.fuelPrice === "" ? estimate.fuelPrice : current.fuelPrice,
      carValue:
        current.carValue === "" && estimate.carValue !== undefined
          ? estimate.carValue
          : current.carValue,
      currentMileage:
        current.currentMileage === "" ? estimate.currentMileage : current.currentMileage,
      insurance: current.insurance === "" ? estimate.insurance : current.insurance,
      tax: current.tax === "" ? estimate.tax : current.tax,
      servicing: current.servicing === "" ? estimate.servicing : current.servicing,
      tyres: current.tyres === "" ? estimate.tyres : current.tyres,
      repairs: current.repairs === "" ? estimate.repairs : current.repairs,
    }));
    trackCalculatorStepReached(3);
    setStep(3);
    return;
  }

  if (step < 3) {
    trackCalculatorStepReached(step + 1);
    setStep(step + 1);
  }
};
const back = () => {
  setStep((prev) => {
    if (prev === 3) return 2;

    return Math.max(prev - 1, 1);
  });
};

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-4 py-4 text-slate-950 sm:py-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
  <div className="absolute left-1/2 top-[-200px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-slate-200/50 blur-3xl" />

  <div className="absolute bottom-[-150px] right-[-100px] h-[350px] w-[350px] rounded-full bg-slate-300/30 blur-3xl" />
</div>

<div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl flex-col">

  <header className="mx-auto flex w-full max-w-6xl items-center justify-end py-4">
<nav className="flex items-center gap-3 text-xs font-medium text-slate-500 sm:gap-4 sm:text-sm">
  <Link href="/compare" className="transition hover:text-slate-950">
    Compare
  </Link>

  <Link href="/cost-to-own" className="transition hover:text-slate-950">
    Ownership guides
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
<ResultsStep
  data={data}
  results={results}
  updateData={updateData}
  back={back}
  restart={() => {
    resetCalculatorAttempt();
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