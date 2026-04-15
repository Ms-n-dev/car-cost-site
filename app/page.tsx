"use client";

import { useState } from "react";

export default function Home() {
  const [carValue, setCarValue] = useState(20000);
  const [age, setAge] = useState(3);
  const [mileage, setMileage] = useState(30000);
  const [annualMileage, setAnnualMileage] = useState(10000);
  const [carType, setCarType] = useState("saloon");

  // ===============================
  // 1. AGE CURVE (WITH CAR TYPE)
  // ===============================
  function getBaseDepreciationRate(age: number, carType: string): number {
    let maxDep = 0.28;
    let minDep = 0.04;
    let decay = 0.25;

    // Adjust by car type
    if (carType === "suv") decay = 0.2;        // holds value better
    if (carType === "luxury") decay = 0.3;     // drops faster
    if (carType === "ev") decay = 0.35;        // fastest depreciation

    return minDep + (maxDep - minDep) * Math.exp(-decay * age);
  }

  // ===============================
  // 2. MILEAGE MULTIPLIER
  // ===============================
  function getMileageMultiplier(age: number, mileage: number): number {
    const expectedMileage = Math.max(age * 10000, 5000);
    const ratio = mileage / expectedMileage;

    if (ratio <= 0.7) return 0.9;
    if (ratio <= 1.0) return 0.95;
    if (ratio <= 1.3) return 1.05;
    if (ratio <= 1.6) return 1.15;
    return 1.25;
  }

  // ===============================
  // 3. FUTURE IMPACT
  // ===============================
  function getFutureImpact(
    age: number,
    mileage: number,
    annualMileage: number
  ): number {
    const currentExpected = Math.max(age * 10000, 5000);
    const futureExpected = (age + 1) * 10000;

    const currentRatio = mileage / currentExpected;
    const futureRatio = (mileage + annualMileage) / futureExpected;

    if (futureRatio > currentRatio) return 1.1;
    if (futureRatio < currentRatio) return 0.95;
    return 1.0;
  }

  // ===============================
  // 4. MILEAGE WARNING SYSTEM
  // ===============================
  function getMileageStatus(age: number, mileage: number) {
    const expected = Math.max(age * 10000, 5000);
    const diff = mileage - expected;
    const percent = (diff / expected) * 100;

    if (percent > 30)
      return {
        label: `+${percent.toFixed(0)}% above expected`,
        color: "text-red-400",
        message: "High mileage - will hurt resale value",
      };

    if (percent > 10)
      return {
        label: `+${percent.toFixed(0)}% above expected`,
        color: "text-yellow-400",
        message: "Slightly above average mileage",
      };

    if (percent < -20)
      return {
        label: `${percent.toFixed(0)}% below expected`,
        color: "text-green-400",
        message: "Low mileage - strong resale potential",
      };

    return {
      label: "Normal mileage",
      color: "text-gray-400",
      message: "Within expected range",
    };
  }

  // ===============================
  // FINAL CALC
  // ===============================
  const baseRate = getBaseDepreciationRate(age, carType);
  const mileageMultiplier = getMileageMultiplier(age, mileage);
  const futureImpact = getFutureImpact(age, mileage, annualMileage);

  const finalRate = baseRate * mileageMultiplier * futureImpact;
  const depreciationAmount = carValue * finalRate;

  const mileageStatus = getMileageStatus(age, mileage);

  // ===============================
  // UI
  // ===============================
  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-xl space-y-6">

        <h1 className="text-2xl font-bold">Car Depreciation Calculator</h1>

        {/* Inputs */}
        <div className="space-y-4">

          <div>
            <label className="text-sm text-gray-400">Car Value (£)</label>
            <input
              type="number"
              value={carValue}
              onChange={(e) => setCarValue(Number(e.target.value))}
              className="w-full p-2 rounded bg-zinc-800 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Car Age (years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2 rounded bg-zinc-800 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Car Type</label>
            <select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 mt-1"
            >
              <option value="saloon">Saloon</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
              <option value="ev">EV</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400">Current Mileage</label>
            <input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              className="w-full p-2 rounded bg-zinc-800 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Annual Mileage</label>
            <input
              type="number"
              value={annualMileage}
              onChange={(e) => setAnnualMileage(Number(e.target.value))}
              className="w-full p-2 rounded bg-zinc-800 mt-1"
            />
          </div>
        </div>

        {/* Mileage Warning */}
        <div className={`text-sm ${mileageStatus.color}`}>
          {mileageStatus.label} — {mileageStatus.message}
        </div>

        {/* Results */}
        <div className="bg-zinc-800 p-4 rounded-xl space-y-2">
          <p className="text-sm text-gray-400">Next Year Depreciation</p>

          <p className="text-3xl font-bold text-green-400">
            £{depreciationAmount.toFixed(0)}
          </p>

          <p className="text-sm text-gray-400">
            {(finalRate * 100).toFixed(1)}%
          </p>
        </div>

        {/* Breakdown */}
        <div className="text-sm text-gray-400 space-y-1">
          <p>Base (age + type): {(baseRate * 100).toFixed(1)}%</p>
          <p>Mileage impact: × {mileageMultiplier.toFixed(2)}</p>
          <p>Usage impact: × {futureImpact.toFixed(2)}</p>
        </div>

      </div>
    </main>
  );
}