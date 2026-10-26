import { useMemo } from "react";
import { calculateCarCosts } from "@/lib/CalculateCarCosts";

type CarCostInput = {
  carValue: number | string;
  carAge: number | string;
  annualMiles: number | string;
  currentMileage: number | string;
  carType: string;
  fuelType: string;
  efficiency: number | string;
  fuelPrice: number | string;
  insurance: number | string;
  tax: number | string;
  servicing: number | string;
  tyres: number | string;
  repairsBuffer: number | string;
};

export function useCarCost(input: CarCostInput) {
  return useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result = calculateCarCosts({
      carValue: Number(input.carValue),
      carYear: currentYear - Number(input.carAge),
      annualMiles: Number(input.annualMiles),
      currentMileage: Number(input.currentMileage),
      carType: input.carType,
      fuelType: input.fuelType,
      efficiency: Number(input.efficiency),
      fuelPrice: Number(input.fuelPrice),
      insurance: Number(input.insurance),
      tax: Number(input.tax),
      servicing: Number(input.servicing),
      tyres: Number(input.tyres),
      repairsBuffer: Number(input.repairsBuffer),
      ownershipYears: 1,
    });

    return {
      annualFuelCost: result.annualFuelCost,
      annualDepreciation: result.annualDepreciation,
      annualTotal: result.annualCost,
      monthlyTotal: result.monthlyCost,
      costPerMile: result.costPerMile,
    };
  }, [input]);
}