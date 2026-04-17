import { useMemo } from "react";

export function useCarCost({
  carValue,
  carAge,
  annualMiles,
  currentMileage,
  carType,
  fuelType,
  efficiency,
  fuelPrice,
  insurance,
  tax,
  servicing,
  tyres,
  repairsBuffer,
}: any) {

  // ✅ CONVERT STRINGS → NUMBERS (FIX)
  const numCarValue = Number(carValue) || 0;
  const numCarAge = Number(carAge) || 0;
  const numAnnualMiles = Number(annualMiles) || 0;
  const numCurrentMileage = Number(currentMileage) || 0;
  const numEfficiency = Number(efficiency) || 0;
  const numFuelPrice = Number(fuelPrice) || 0;
  const numInsurance = Number(insurance) || 0;
  const numTax = Number(tax) || 0;
  const numServicing = Number(servicing) || 0;
  const numTyres = Number(tyres) || 0;
  const numRepairsBuffer = Number(repairsBuffer) || 0;

  // 🔥 NEW: ADVANCED DEPRECIATION MODEL

  const getAgeDepreciationRate = (age: number) => {
    if (age <= 3) return 0.18;
    if (age <= 7) return 0.10;
    if (age <= 12) return 0.06;
    return 0.03;
  };

  const getMileageMultiplier = (mileage: number) => {
    if (mileage < 30000) return 1.15;
    if (mileage < 80000) return 1.0;
    if (mileage < 120000) return 0.85;
    return 0.7;
  };

  const getCarTypeMultiplier = (type: string) => {
    if (type === "luxury") return 1.2;
    if (type === "performance") return 1.1;
    if (type === "economy") return 0.9;
    return 1.0;
  };

  const usageFactor = useMemo(() => {
    if (numAnnualMiles <= 6000) return 0.9;
    if (numAnnualMiles <= 12000) return 1.0;
    if (numAnnualMiles <= 20000) return 1.15;
    if (numAnnualMiles <= 30000) return 1.3;
    return 1.5;
  }, [numAnnualMiles]);

  // 🔥 YEAR-BY-YEAR SIMULATION (key upgrade)
  const MIN_VALUE = 1000;

  const simulatedDepreciation = useMemo(() => {
    let value = numCarValue;
    let age = numCarAge;
    let mileage = numCurrentMileage;

    // simulate 1 year forward (keeps your annual output consistent)
    const rate =
      getAgeDepreciationRate(age) *
      getMileageMultiplier(mileage) *
      getCarTypeMultiplier(carType) *
      usageFactor;

    const newValue = Math.max(value * (1 - rate), MIN_VALUE);

    return value - newValue; // depreciation amount for the year
  }, [
    numCarValue,
    numCarAge,
    numCurrentMileage,
    numAnnualMiles,
    carType,
    usageFactor,
  ]);

  // ✅ KEEP YOUR ORIGINAL STRUCTURE
const annualMaintenance = useMemo(() => {
  return numServicing + numTyres + numRepairsBuffer;
}, [numServicing, numTyres, numRepairsBuffer]);

  const litresPerGallon = 4.54609;

const annualFuelCost = useMemo(() => {
  const litresPerGallon = 4.54609;

  if (fuelType === "electric") {
    const milesPerKwh = Math.max(numEfficiency, 0.1);
    const annualKwhUsed = numAnnualMiles / milesPerKwh;
    return annualKwhUsed * (numFuelPrice / 100);
  } else {
    const mpg = Math.max(numEfficiency, 1);
    const gallonsUsed = numAnnualMiles / mpg;
    const litresUsed = gallonsUsed * litresPerGallon;
    return litresUsed * (numFuelPrice / 100);
  }
}, [fuelType, numEfficiency, numAnnualMiles, numFuelPrice]);

  // 🔥 REPLACED WITH NEW MODEL
  const annualDepreciation = simulatedDepreciation;

const annualTotal = useMemo(() => {
  return (
    annualFuelCost +
    numInsurance +
    numTax +
    annualMaintenance +
    annualDepreciation
  );
}, [
  annualFuelCost,
  numInsurance,
  numTax,
  annualMaintenance,
  annualDepreciation,
]);

const monthlyTotal = useMemo(() => {
  return annualTotal / 12;
}, [annualTotal]);

const costPerMile = useMemo(() => {
  return annualTotal / Math.max(numAnnualMiles, 1);
}, [annualTotal, numAnnualMiles]);

  return {
    annualFuelCost,
    annualDepreciation,
    annualTotal,
    monthlyTotal,
    costPerMile,
  };
}