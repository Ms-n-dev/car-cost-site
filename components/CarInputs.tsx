"use client";

export default function CarInputs({
  data,
  setData,
  inputClass,
  labelClass,
  handleFuelTypeChange,
}: any) {

  const numericFields = [
  "carValue",
  "currentMileage",
  "annualMiles",
  "efficiency",
  "fuelPrice",
  "insurance",
  "tax",
  "servicing",
  "tyres",
  "repairsBuffer",
];

function update(key: string, value: any) {
  setData((prev: any) => ({
    ...prev,
    [key]: numericFields.includes(key)
      ? value === ""
        ? ""
        : Number(value)
      : value,
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
          value={data.carValue === "" ? "" : data.carValue}
          onChange={(e) => update("carValue", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
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
          value={data.currentMileage === "" ? "" : data.currentMileage}
          onChange={(e) => update("currentMileage", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
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
            value={data.annualMiles === "" ? "" : data.annualMiles}
          onChange={(e) => update("annualMiles", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
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
            value={data.efficiency === "" ? "" : data.efficiency}
          onChange={(e) => update("efficiency", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
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
            value={data.fuelPrice === "" ? "" : data.fuelPrice}
          onChange={(e) => update("fuelPrice", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      {/* COSTS */}
      <div>
        <label className={labelClass}>Insurance (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
            value={data.insurance === "" ? "" : data.insurance}
          onChange={(e) => update("insurance", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Tax (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
            value={data.tax === "" ? "" : data.tax}
          onChange={(e) => update("tax", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Servicing (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
            value={data.servicing === "" ? "" : data.servicing}
          onChange={(e) => update("servicing", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div>
        <label className={labelClass}>Tyres (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
            value={data.tyres === "" ? "" : data.tyres}
          onChange={(e) => update("tyres", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Repairs buffer (£/year)</label>
        <input
          className={enhancedInputClass}
          type="number"
            value={data.repairsBuffer === "" ? "" : data.repairsBuffer}
          onChange={(e) => update("repairsBuffer", e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
        />
      </div>

    </div>
  );
}