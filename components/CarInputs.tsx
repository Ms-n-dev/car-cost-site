"use client";

export default function CarInputs({
  data,
  setData,
  inputClass,
  labelClass,
  handleFuelTypeChange,
}: any) {

function update(key: string, value: any) {
  setData((prev: any) => ({
    ...prev,
    [key]: value,
  }));
}

  const enhancedInputClass = `${inputClass} hover:border-slate-500 transition`;

  const currentYear = new Date().getFullYear();

  return (
    <div className="grid gap-5 md:grid-cols-2">

      {/* VALUE */}
      <div>
        <label className={labelClass}>Car value (£)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.carValue ?? ""}
          onChange={(e) => update("carValue", Number(e.target.value))}
        />
      </div>


      {/* CAR YEAR (CUSTOM DROPDOWN) */}
<div className="relative">
  <label className={labelClass}>Car year</label>

  <button
    onClick={() => update("carYearOpen", !data.carYearOpen)}
    className={`${enhancedInputClass} flex justify-between items-center`}
  >
    <span>{data.carYear}</span>
    <span className="text-slate-400">⌄</span>
  </button>

  {data.carYearOpen && (
    <div className="absolute z-10 mt-2 w-full max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg">

      {Array.from({ length: 30 }, (_, i) => currentYear - i).map((year) => (
        <div
          key={year}
          onClick={() => {
            update("carYear", year);
            update("carYearOpen", false);
          }}
          className={`px-4 py-3 text-sm cursor-pointer hover:bg-slate-100 ${
            data.carYear === year ? "bg-slate-100 font-medium" : ""
          }`}
        >
          {year}
        </div>
      ))}

    </div>
  )}

  <div className="mt-2 text-sm text-slate-600">
    Car age: {currentYear - data.carYear} years
  </div>
</div>

      {/* MILEAGE */}
      <div>
        <label className={labelClass}>Current mileage</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.currentMileage ?? ""}
          onChange={(e) => update("currentMileage", Number(e.target.value))}
        />
      </div>

      {/* CAR TYPE */}
      <div className="relative">
        <label className={labelClass}>Car type</label>

        <button
          onClick={() => update("carTypeOpen", !data.carTypeOpen)}
          className={`${enhancedInputClass} flex justify-between items-center`}
        >
          <span className="capitalize">{data.carType}</span>
          <span className="text-slate-400">⌄</span>
        </button>

        {data.carTypeOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">

            {["standard", "luxury", "performance"].map((option) => (
              <div
                key={option}
                onClick={() => {
                  update("carType", option);
                  update("carTypeOpen", false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer hover:bg-slate-100 ${
                  data.carType === option ? "bg-slate-100 font-medium" : ""
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ANNUAL */}
      <div>
        <label className={labelClass}>Annual mileage</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.annualMiles ?? ""}
          onChange={(e) => update("annualMiles", Number(e.target.value))}
        />
      </div>

      {/* FUEL TYPE */}
      <div className="relative">
        <label className={labelClass}>Fuel type</label>

        <button
          onClick={() => update("fuelTypeOpen", !data.fuelTypeOpen)}
          className={`${enhancedInputClass} flex justify-between items-center`}
        >
          <span className="capitalize">{data.fuelType.replace("_", " ")}</span>
          <span className="text-slate-400">⌄</span>
        </button>

        {data.fuelTypeOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">

            {["petrol", "diesel", "premium_petrol", "electric"].map((option) => (
              <div
                key={option}
                onClick={() => {
                  handleFuelTypeChange(option);
                  update("fuelTypeOpen", false);
                }}
                className={`px-4 py-3 text-sm cursor-pointer hover:bg-slate-100 ${
                  data.fuelType === option ? "bg-slate-100 font-medium" : ""
                }`}
              >
                {option.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* MPG */}
      <div>
        <label className={labelClass}>
          {data.fuelType === "electric" ? "Efficiency (mi/kWh)" : "MPG"}
        </label>

        <input
          className={enhancedInputClass}
          type="number"
          value={data.efficiency ?? ""}
          onChange={(e) => update("efficiency", Number(e.target.value))}
        />
      </div>

      {/* PRICE */}
      <div>
        <label className={labelClass}>
          {data.fuelType === "electric"
            ? "Electricity price (p/kWh)"
            : "Fuel price (p/litre)"}
        </label>

        <input
          className={enhancedInputClass}
          type="number"
          value={data.fuelPrice ?? ""}
          onChange={(e) => update("fuelPrice", Number(e.target.value))}
        />
      </div>

      {/* COSTS */}
      <div>
        <label className={labelClass}>Insurance (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.insurance ?? ""}
          onChange={(e) => update("insurance", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Tax (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.tax ?? ""}
          onChange={(e) => update("tax", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Servicing (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.servicing ?? ""}
          onChange={(e) => update("servicing", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Tyres (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.tyres ?? ""}
          onChange={(e) => update("tyres", Number(e.target.value))}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Repairs buffer (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
          value={data.repairsBuffer ?? ""}
          onChange={(e) => update("repairsBuffer", Number(e.target.value))}
        />
      </div>

    </div>
  );
}