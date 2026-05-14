import { useMemo } from "react";

export function useOwnershipCost({
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
  miscCosts = 0,
  ownershipYears = 1,
}: any) {
  return useMemo(() => {
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
    const numMiscCosts = Number(miscCosts) || 0;
    const years = Math.max(Number(ownershipYears) || 1, 1);

    const getAgeDepreciationRate = (age: number) => {
      if (age <= 2) return 0.18;
      if (age <= 5) return 0.12;
      if (age <= 8) return 0.08;
      return 0.05;
    };

    const getMileageMultiplier = (mileage: number) => {
      if (mileage <= 30000) return 1.25;
      if (mileage <= 80000) return 1.0;
      if (mileage <= 120000) return 0.75;
      return 0.6;
    };

    const getCarTypeMultiplier = (type: string) => {
      if (type === "luxury") return 1.15;
      if (type === "performance") return 1.2;
      return 1.0;
    };

    const getUsageMultiplier = (miles: number) => {
      if (miles <= 6000) return 0.9;
      if (miles <= 12000) return 1.0;
      if (miles <= 20000) return 1.15;
      if (miles <= 30000) return 1.3;
      return 1.5;
    };

    const annualMaintenance =
      numServicing + numTyres + numRepairsBuffer;

    let annualFuelCost = 0;

    if (fuelType === "electric") {
      const milesPerKwh = Math.max(numEfficiency, 0.1);
      const annualKwhUsed = numAnnualMiles / milesPerKwh;
      annualFuelCost = annualKwhUsed * (numFuelPrice / 100);
    } else {
      const litresPerGallon = 4.54609;
      const mpg = Math.max(numEfficiency, 1);
      const gallonsUsed = numAnnualMiles / mpg;
      const litresUsed = gallonsUsed * litresPerGallon;
      annualFuelCost = litresUsed * (numFuelPrice / 100);
    }

    let totalDepreciation = 0;
    let currentValue = numCarValue;
    let mileage = numCurrentMileage;

    for (let i = 0; i < years; i++) {
      const ageThisYear = numCarAge + i;

      const depreciationThisYear =
        currentValue *
        getAgeDepreciationRate(ageThisYear) *
        getMileageMultiplier(mileage) *
        getCarTypeMultiplier(carType) *
        getUsageMultiplier(numAnnualMiles);

      totalDepreciation += depreciationThisYear;

      currentValue -= depreciationThisYear;
      mileage += numAnnualMiles;
    }

    const totalFuelCost = annualFuelCost * years;
    const totalInsurance = numInsurance * years;
    const totalTax = numTax * years;
    const totalMaintenance = annualMaintenance * years;
    const totalMiscCosts = numMiscCosts * years;

    const totalCost =
      totalFuelCost +
      totalInsurance +
      totalTax +
      totalMaintenance +
      totalDepreciation +
      totalMiscCosts;

    const monthlyCost = totalCost / (years * 12);

    const costPerMile =
      totalCost / Math.max(numAnnualMiles * years, 1);

    return {
      totalCost,
      monthlyCost,
      costPerMile,
      totalDepreciation,
      totalFuelCost,
      totalInsurance,
      totalTax,
      totalMaintenance,
      totalMiscCosts,
      estimatedFutureValue: currentValue,
      annualFuelCost,
      annualMaintenance,
    };
  }, [
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
    miscCosts,
    ownershipYears,
  ]);
}