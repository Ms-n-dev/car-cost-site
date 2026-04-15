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

  const depreciationRate = useMemo(() => {
    if (carAge <= 2) return 0.18;
    if (carAge <= 5) return 0.12;
    if (carAge <= 8) return 0.08;
    return 0.05;
  }, [carAge]);

  const mileageFactor = useMemo(() => {
    if (currentMileage <= 30000) return 1.25;
    if (currentMileage <= 80000) return 1.0;
    if (currentMileage <= 120000) return 0.75;
    return 0.6;
  }, [currentMileage]);

  const carTypeFactor = useMemo(() => {
    if (carType === "luxury") return 1.15;
    if (carType === "performance") return 1.2;
    return 1.0;
  }, [carType]);

  const usageFactor = useMemo(() => {
    if (annualMiles <= 6000) return 0.9;
    if (annualMiles <= 12000) return 1.0;
    if (annualMiles <= 20000) return 1.15;
    if (annualMiles <= 30000) return 1.3;
    return 1.5;
  }, [annualMiles]);

  const annualMaintenance =
    servicing + tyres + repairsBuffer;

  const litresPerGallon = 4.54609;

  let annualFuelCost = 0;

  if (fuelType === "electric") {
    const milesPerKwh = Math.max(efficiency, 0.1);
    const annualKwhUsed = annualMiles / milesPerKwh;
    annualFuelCost = annualKwhUsed * (fuelPrice / 100);
  } else {
    const mpg = Math.max(efficiency, 1);
    const gallonsUsed = annualMiles / mpg;
    const litresUsed = gallonsUsed * litresPerGallon;
    annualFuelCost = litresUsed * (fuelPrice / 100);
  }

  const annualDepreciation =
    carValue *
    depreciationRate *
    mileageFactor *
    carTypeFactor *
    usageFactor;

  const annualTotal =
    annualFuelCost +
    insurance +
    tax +
    annualMaintenance +
    annualDepreciation;

  const monthlyTotal = annualTotal / 12;
  const costPerMile = annualTotal / Math.max(annualMiles, 1);

  return {
    annualFuelCost,
    annualDepreciation,
    annualTotal,
    monthlyTotal,
    costPerMile,
  };
}