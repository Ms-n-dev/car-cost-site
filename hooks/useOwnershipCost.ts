import { useMemo } from "react";
import { calculateCarCosts } from "@/lib/CalculateCarCosts";

type OwnershipCostInput = {
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
  miscCosts?: number | string;
  ownershipYears?: number | string;
};

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
}: OwnershipCostInput) {
  return useMemo(() => {
    const currentYear = new Date().getFullYear();

    return calculateCarCosts({
      carValue: Number(carValue),
      carYear: currentYear - Number(carAge),
      annualMiles: Number(annualMiles),
      currentMileage: Number(currentMileage),
      carType,
      fuelType,
      efficiency: Number(efficiency),
      fuelPrice: Number(fuelPrice),
      insurance: Number(insurance),
      tax: Number(tax),
      servicing: Number(servicing),
      tyres: Number(tyres),
      repairsBuffer: Number(repairsBuffer),
      miscCosts: Number(miscCosts),
      ownershipYears: Number(ownershipYears),
    });
  }, [
    annualMiles,
    carAge,
    carType,
    carValue,
    currentMileage,
    efficiency,
    fuelPrice,
    fuelType,
    insurance,
    miscCosts,
    ownershipYears,
    repairsBuffer,
    servicing,
    tax,
    tyres,
  ]);
}
