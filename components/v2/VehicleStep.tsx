import { useRef, useState } from "react";
import StepLayout from "./StepLayout";
import type { V2FormData } from "@/app/v2/page";
import { carMakes } from "@/data/carData";
import { trackCalculatorStarted, trackEvent } from "@/lib/gtag";
import { getVehicleEstimate } from "@/lib/vehicleEstimates";

type Props = {
  data: V2FormData;
  updateData: (patch: Partial<V2FormData>) => void;
  next: () => void;
};

export default function VehicleStep({ data, updateData, next }: Props) {
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSuccess, setLookupSuccess] = useState("");
  const lookupInFlight = useRef(false);
  const lastSuccessfulRegistration = useRef<string | null>(null);
  const selectedMake = data.makeModel.split(" | ")[0] || "";
  const selectedModel = data.makeModel.split(" | ")[1] || "";

  const hasManualVehicle = selectedMake !== "" && selectedModel !== "";
  const hasResolvedRegistration =
    data.reg.trim() !== "" && lookupSuccess !== "" && data.fuelType !== "";
  const canContinue = hasManualVehicle || hasResolvedRegistration;

  function setVehicleEstimate(
    make: string,
    model: string,
    dvlaFuelType?: string,
    carValue?: number
  ) {
    const estimate = getVehicleEstimate(make, model, dvlaFuelType);

    updateData({
      fuelType: estimate.fuelType,
      carType: estimate.carType,
      efficiency: estimate.efficiency,
      fuelPrice: estimate.fuelPrice,
      carValue: carValue ?? estimate.carValue,
      currentMileage: estimate.currentMileage,
      insurance: estimate.insurance,
      tax: estimate.tax,
      servicing: estimate.servicing,
      tyres: estimate.tyres,
      repairs: estimate.repairs,
    });
  }

  async function lookupReg() {
    const registration = data.reg.replace(/\s/g, "").toUpperCase();
    if (!registration || lookupInFlight.current) return;
    if (lastSuccessfulRegistration.current === registration && lookupSuccess) return;

    lookupInFlight.current = true;
    trackCalculatorStarted("single", 1);

    setLookupLoading(true);
    setLookupError("");

    try {
      const res = await fetch("/api/dvla", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationNumber: data.reg,
        }),
      });

      const vehicle = await res.json();

      if (!res.ok) {
        throw new Error(vehicle?.error || "Could not find this vehicle");
      }

      const year =
        vehicle.yearOfManufacture ||
        (vehicle.monthOfFirstRegistration
          ? Number(String(vehicle.monthOfFirstRegistration).slice(0, 4))
          : "");

const dvlaMake = String(vehicle.make || "").toLowerCase();

const makeAliases: Record<string, string> = {
  "mercedes-benz": "Mercedes",
  "land rover": "Land Rover",
  "alfa romeo": "Alfa Romeo",
};

const matchedMake =
  Object.keys(carMakes).find(
    (make) => make.toLowerCase() === dvlaMake
  ) ||
  makeAliases[dvlaMake] ||
  "";

      const estimateMake = matchedMake || String(vehicle.make || selectedMake);
      const estimateModel = selectedModel;
      setVehicleEstimate(estimateMake, estimateModel, vehicle.fuelType);

updateData({
  reg: registration,
  makeModel: estimateMake ? `${estimateMake} | ${estimateModel}` : data.makeModel,
  carYear: year || data.carYear,
});

setLookupSuccess(
  `Found ${matchedMake || vehicle.make || "vehicle"}${
    year ? `, ${year}` : ""
  }`
);
lastSuccessfulRegistration.current = registration;

trackEvent("reg_lookup_success", {
  fuel_type: vehicle.fuelType || "",
  make: vehicle.make || "",
});

    } catch (err) {
      console.error("DVLA lookup failed:", err);
      setLookupSuccess("");
      setLookupError("Could not find that reg. You can still enter the car manually.");
    } finally {
      lookupInFlight.current = false;
      setLookupLoading(false);
    }
  }

  return (
    <StepLayout
      eyebrow="CarCalc"
      title="What car are you looking at?"
      subtitle="Start with a reg plate or enter the car manually."
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Registration
          </label>

    <input
  value={data.reg}
onChange={(e) => {
  trackCalculatorStarted("single", 1);
  const value = e.target.value.toUpperCase();
  const changedRegistration =
    value.replace(/\s/g, "") !== data.reg.replace(/\s/g, "");
  if (changedRegistration) {
    setLookupSuccess("");
    setLookupError("");
  }
  updateData({
    reg: value,
    ...(changedRegistration ? { makeModel: "", fuelType: "" } : {}),
  });
}}
  onBlur={lookupReg}
  placeholder="AB12 CDE"
  className="w-full rounded-2xl border border-slate-200 bg-yellow-300 px-5 py-4 text-center text-3xl font-black uppercase tracking-widest text-slate-950 outline-none transition-all duration-200 focus:scale-[1.01] sm:py-5"
/>

          <button
            type="button"
            onClick={lookupReg}
            disabled={!data.reg.trim() || lookupLoading}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            {lookupLoading ? "Looking up..." : "Look up reg"}
          </button>

          {lookupError && (
            <p className="mt-2 text-sm text-red-600">{lookupError}</p>
          )}
          {lookupSuccess && (
  <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
    <div className="flex items-center gap-2">
      <span>✓</span>
      <span>{lookupSuccess}</span>
    </div>
  </div>
)}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          or
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Make
            </label>

            <select
              value={selectedMake}
              onChange={(e) => {
                trackCalculatorStarted("single", 1);
                const make = e.target.value;
                const model = "";
                setVehicleEstimate(make, model);
                updateData({
                  makeModel: make ? `${make} | ` : "",
                });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
            >
              <option value="">Select make</option>

              {Object.keys(carMakes).map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Model
            </label>

            <select
              value={selectedModel}
              disabled={!selectedMake}
              onChange={(e) => {
                trackCalculatorStarted("single", 1);
                const make = selectedMake;
                const model = e.target.value;
                const estimate = getVehicleEstimate(make, model);
                setVehicleEstimate(make, model, undefined, estimate.carValue);

                updateData({
                  makeModel: `${make} | ${model}`,
                });
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">Select model</option>

              {(carMakes[selectedMake] || []).map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>

<div>
  <label className="mb-2 block text-sm font-medium text-slate-600">
    Car year
  </label>

  <input
    type="number"
    value={data.carYear}
    onChange={(e) =>
      {
        trackCalculatorStarted("single", 1);
        updateData({
        carYear:
          e.target.value === "" ? "" : Number(e.target.value),
        });
      }
    }
    placeholder="2019"
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
  />
</div>


        <button
          disabled={!canContinue || lookupLoading}
          onClick={next}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </StepLayout>
  );
}