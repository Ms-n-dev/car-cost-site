type FuelType = "petrol" | "diesel" | "premium_petrol" | "electric" | string;
type CarType = "standard" | "luxury" | "performance" | string;

export type CalculateCarCostsInput = {
  carValue: number;
  carYear: number;
  annualMiles: number;
  currentMileage: number;
  carType: CarType;
  fuelType: FuelType;
  efficiency: number;
  fuelPrice: number;
  insurance: number;
  tax: number;
  servicing: number;
  tyres: number;
  repairsBuffer: number;
  miscCosts?: number;
  ownershipYears: number;
};

function numberOrZero(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function calculateCarCosts(input: CalculateCarCostsInput) {
  const currentYear = new Date().getFullYear();

  const carValue = numberOrZero(+input.carValue);
  const annualMiles = numberOrZero(+input.annualMiles);
  const currentMileage = numberOrZero(+input.currentMileage);
  const efficiency = numberOrZero(+input.efficiency);
  const fuelPrice = numberOrZero(+input.fuelPrice);
  const insurance = numberOrZero(+input.insurance);
  const tax = numberOrZero(+input.tax);
  const servicing = numberOrZero(+input.servicing);
  const tyres = numberOrZero(+input.tyres);
  const repairsBuffer = numberOrZero(+input.repairsBuffer);
  const miscCosts = numberOrZero(input.miscCosts ?? 0);
  const years = Math.min(Math.max(Math.floor(Number(input.ownershipYears) || 1), 1), 10);

  const carAge = Math.max(currentYear - numberOrZero(input.carYear), 0);

  const carTypeFactor =
    input.carType === "luxury"
      ? 1.15
      : input.carType === "performance"
        ? 1.2
        : 1.0;

  const usageFactor =
    annualMiles <= 6000
      ? 0.9
      : annualMiles <= 12000
        ? 1.0
        : annualMiles <= 20000
          ? 1.15
          : annualMiles <= 30000
            ? 1.3
            : 1.5;

  const annualMaintenance = servicing + tyres + repairsBuffer;

  let annualFuelCost = 0;

  if (input.fuelType === "electric") {
    if (efficiency > 0) {
      const annualKwhUsed = annualMiles / efficiency;
      annualFuelCost = annualKwhUsed * (fuelPrice / 100);
    }
  } else if (["petrol", "diesel", "premium_petrol"].includes(input.fuelType)) {
    if (efficiency > 0) {
      const mpg = efficiency;
    const gallonsUsed = annualMiles / mpg;
    const litresUsed = gallonsUsed * 4.54609;
    annualFuelCost = litresUsed * (fuelPrice / 100);
    }
  }

  let totalDepreciation = 0;
  let currentValue = carValue;
  let mileage = currentMileage;

  for (let i = 0; i < years; i++) {
    const ageThisYear = carAge + i;

    let rate = 0.05;
    if (ageThisYear <= 2) rate = 0.18;
    else if (ageThisYear <= 5) rate = 0.12;
    else if (ageThisYear <= 8) rate = 0.08;

    let mileageFactorYear = 1;
    if (mileage <= 30000) mileageFactorYear = 1.25;
    else if (mileage <= 80000) mileageFactorYear = 1.0;
    else if (mileage <= 120000) mileageFactorYear = 0.75;
    else mileageFactorYear = 0.6;

    const totalRate = Math.min(
      rate * mileageFactorYear * carTypeFactor * usageFactor,
      0.95
    );
    const depreciationThisYear = currentValue * totalRate;

    totalDepreciation += depreciationThisYear;
    currentValue -= depreciationThisYear;
    mileage += annualMiles;
  }

  const totalFuelCost = annualFuelCost * years;
  const totalInsurance = insurance * years;
  const totalTax = tax * years;
  const totalMaintenance = annualMaintenance * years;
  const totalMiscCosts = miscCosts * years;

  const totalCost =
    totalFuelCost +
    totalInsurance +
    totalTax +
    totalMaintenance +
    totalDepreciation +
    totalMiscCosts;

  const monthlyCost = totalCost / (years * 12);
  const annualCost = totalCost / years;
  const totalMiles = annualMiles * years;
  const costPerMile = totalMiles > 0 ? totalCost / totalMiles : 0;

  return {
    annualFuelCost,
    annualMaintenance,
    annualDepreciation: totalDepreciation / years,
    annualCost,

    totalCost,
    monthlyCost,
    costPerMile,
    totalDepreciation,
    estimatedFutureValue: currentValue,
    totalFuelCost,
    totalInsurance,
    totalTax,
    totalMaintenance,
    totalMiscCosts,
  };
}