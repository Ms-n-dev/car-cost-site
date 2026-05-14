import { useRef, useState } from "react";
import StepLayout from "./StepLayout";
import type { V2FormData } from "@/app/v2/page";
import { carMakes } from "@/data/carData";
import { trackEvent } from "@/lib/gtag";

type Props = {
  data: V2FormData;
  updateData: (patch: Partial<V2FormData>) => void;
  next: () => void;
};

function mapDvlaFuelType(fuelType?: string): V2FormData["fuelType"] {
  const value = fuelType?.toLowerCase() || "";

  if (value.includes("diesel")) return "diesel";
  if (value.includes("electric")) return "electric";
  if (value.includes("petrol")) return "petrol";

  return "";
}

export default function VehicleStep({ data, updateData, next }: Props) {
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSuccess, setLookupSuccess] = useState("");
  const hasStartedInput = useRef(false);

  const selectedMake = data.makeModel.split(" | ")[0] || "";
  const selectedModel = data.makeModel.split(" | ")[1] || "";

  const canContinue =
    data.reg.trim() !== "" || (selectedMake !== "" && selectedModel !== "");

  async function lookupReg() {
    if (!data.reg.trim()) return;

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

updateData({
  reg: data.reg.replace(/\s/g, "").toUpperCase(),
  makeModel: matchedMake ? `${matchedMake} | ` : data.makeModel,
  carYear: year || data.carYear,
  fuelType: mapDvlaFuelType(vehicle.fuelType),
});

setLookupSuccess(
  `Found ${matchedMake || vehicle.make || "vehicle"}${
    year ? `, ${year}` : ""
  }`
);

trackEvent("reg_lookup_success", {
  fuel_type: vehicle.fuelType || "",
  make: vehicle.make || "",
});

    } catch (err) {
      console.error("DVLA lookup failed:", err);
      setLookupSuccess("");
      setLookupError("Could not find that reg. You can still enter the car manually.");
    } finally {
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
  if (!hasStartedInput.current) {
    hasStartedInput.current = true;
    trackEvent("started_input");
  }

  updateData({
    reg: e.target.value.toUpperCase(),
  });
}}
  onBlur={lookupReg}
  placeholder="AB12 CDE"
  className="w-full rounded-2xl border border-slate-200 bg-yellow-300 px-5 py-5 text-center text-3xl font-black uppercase tracking-widest text-slate-950 outline-none transition-all duration-200 focus:scale-[1.01]"
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
  <p className="mt-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
    {lookupSuccess}
  </p>
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
              onChange={(e) =>
                updateData({
                  makeModel: e.target.value ? `${e.target.value} | ` : "",
                })
              }
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
                const make = selectedMake;

                updateData({
                  makeModel: `${make} | ${e.target.value}`,
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
      updateData({
        carYear:
          e.target.value === "" ? "" : Number(e.target.value),
      })
    }
    placeholder="2019"
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base outline-none transition-all duration-200 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
  />
</div>


        <button
          disabled={!canContinue}
          onClick={next}
          className="w-full rounded-2xl bg-slate-950 px-5 py-4 text-base font-semibold text-white disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </StepLayout>
  );
}