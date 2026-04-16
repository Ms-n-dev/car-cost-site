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

  const depreciationRate = useMemo(() => {
    if (numCarAge <= 2) return 0.18;
    if (numCarAge <= 5) return 0.12;
    if (numCarAge <= 8) return 0.08;
    return 0.05;
  }, [numCarAge]);

  const mileageFactor = useMemo(() => {
    if (numCurrentMileage <= 30000) return 1.25;
    if (numCurrentMileage <= 80000) return 1.0;
    if (numCurrentMileage <= 120000) return 0.75;
    return 0.6;
  }, [numCurrentMileage]);

  const carTypeFactor = useMemo(() => {
    if (carType === "luxury") return 1.15;
    if (carType === "performance") return 1.2;
    return 1.0;
  }, [carType]);

  const usageFactor = useMemo(() => {
    if (numAnnualMiles <= 6000) return 0.9;
    if (numAnnualMiles <= 12000) return 1.0;
    if (numAnnualMiles <= 20000) return 1.15;
    if (numAnnualMiles <= 30000) return 1.3;
    return 1.5;
  }, [numAnnualMiles]);

  const annualMaintenance =
    numServicing + numTyres + numRepairsBuffer;

  const litresPerGallon = 4.54609;

  let annualFuelCost = 0;

  if (fuelType === "electric") {
    const milesPerKwh = Math.max(numEfficiency, 0.1);
    const annualKwhUsed = numAnnualMiles / milesPerKwh;
    annualFuelCost = annualKwhUsed * (numFuelPrice / 100);
  } else {
    const mpg = Math.max(numEfficiency, 1);
    const gallonsUsed = numAnnualMiles / mpg;
    const litresUsed = gallonsUsed * litresPerGallon;
    annualFuelCost = litresUsed * (numFuelPrice / 100);
  }

  const annualDepreciation =
    numCarValue *
    depreciationRate *
    mileageFactor *
    carTypeFactor *
    usageFactor;

  const annualTotal =
    annualFuelCost +
    numInsurance +
    numTax +
    annualMaintenance +
    annualDepreciation;

  const monthlyTotal = annualTotal / 12;
  const costPerMile = annualTotal / Math.max(numAnnualMiles, 1);

  return {
    annualFuelCost,
    annualDepreciation,
    annualTotal,
    monthlyTotal,
    costPerMile,
  };
}