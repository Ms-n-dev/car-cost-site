"use client";

export default function CarInputs({
  data,
  setData,
  inputClass,
  labelClass,
}: any) {

  function update(key: string, value: any) {
    setData({ ...data, [key]: value });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">

      <div>
        <label className={labelClass}>Car value (£)</label>
        <input className={inputClass} type="number"
          value={data.carValue}
          onChange={(e) => update("carValue", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Car age (years)</label>
        <input className={inputClass} type="number"
          value={data.carAge}
          onChange={(e) => update("carAge", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Current mileage</label>
        <input className={inputClass} type="number"
          value={data.currentMileage}
          onChange={(e) => update("currentMileage", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Car type</label>
        <select className={inputClass}
          value={data.carType}
          onChange={(e) => update("carType", e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="luxury">Luxury</option>
          <option value="performance">Performance</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Annual mileage</label>
        <input className={inputClass} type="number"
          value={data.annualMiles}
          onChange={(e) => update("annualMiles", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Fuel type</label>
        <select className={inputClass}
          value={data.fuelType}
          onChange={(e) => update("fuelType", e.target.value)}
        >
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="premium_petrol">Premium petrol</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <div>
<label className={labelClass}>
  {data.fuelType === "electric" ? "Efficiency (mi/kWh)" : "MPG"}
</label>
        <input className={inputClass} type="number"
          value={data.efficiency}
          onChange={(e) => update("efficiency", Number(e.target.value))}
        />
      </div>

      <div>
<label className={labelClass}>
  {data.fuelType === "electric" ? "Electricity price (p/kWh)" : "Fuel price (p/litre)"}
</label>
        <input className={inputClass} type="number"
          value={data.fuelPrice}
          onChange={(e) => update("fuelPrice", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Insurance (£/year)</label>
        <input className={inputClass} type="number"
          value={data.insurance}
          onChange={(e) => update("insurance", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Tax (£/year)</label>
        <input className={inputClass} type="number"
          value={data.tax}
          onChange={(e) => update("tax", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Servicing (£/year)</label>
        <input className={inputClass} type="number"
          value={data.servicing}
          onChange={(e) => update("servicing", Number(e.target.value))}
        />
      </div>

      <div>
        <label className={labelClass}>Tyres (£/year)</label>
        <input className={inputClass} type="number"
          value={data.tyres}
          onChange={(e) => update("tyres", Number(e.target.value))}
        />
      </div>

      <div className="md:col-span-2">
        <label className={labelClass}>Repairs buffer (£/year)</label>
        <input className={inputClass} type="number"
          value={data.repairsBuffer}
          onChange={(e) => update("repairsBuffer", Number(e.target.value))}
        />
      </div>

    </div>
  );
}