import { DEFAULT_FUEL_PRICES } from "./vehicleDefaults.ts";

export type FuelType = "petrol" | "diesel" | "premium_petrol" | "electric";
export type VehicleClass = "standard" | "luxury" | "performance";

export type VehicleEstimate = {
  fuelType: FuelType;
  efficiency: number;
  fuelPrice: number;
  carValue: number;
  currentMileage: number;
  carType: VehicleClass;
  insurance: number;
  tax: number;
  servicing: number;
  tyres: number;
  repairs: number;
  estimateSource: "model" | "vehicle_class";
};

type ModelEstimate = Omit<VehicleEstimate, "fuelPrice" | "estimateSource"> & {
  make: string;
  model: string;
  carValue: number;
};

const modelEstimates: ModelEstimate[] = [
  { make: "BMW", model: "M140i", fuelType: "petrol", efficiency: 34, carValue: 18000, currentMileage: 50000, carType: "performance", insurance: 1400, tax: 345, servicing: 700, tyres: 500, repairs: 650 },
  { make: "Audi", model: "RS3", fuelType: "petrol", efficiency: 29, carValue: 32000, currentMileage: 50000, carType: "performance", insurance: 1600, tax: 190, servicing: 800, tyres: 700, repairs: 700 },
  { make: "BMW", model: "M340i", fuelType: "petrol", efficiency: 33, carValue: 35000, currentMileage: 45000, carType: "performance", insurance: 1500, tax: 190, servicing: 750, tyres: 650, repairs: 700 },
  { make: "BMW", model: "330d", fuelType: "diesel", efficiency: 48, carValue: 24000, currentMileage: 55000, carType: "standard", insurance: 1100, tax: 190, servicing: 650, tyres: 450, repairs: 500 },
  { make: "Volkswagen", model: "Golf R", fuelType: "petrol", efficiency: 32, carValue: 25000, currentMileage: 50000, carType: "performance", insurance: 1300, tax: 190, servicing: 650, tyres: 550, repairs: 500 },
  { make: "Lamborghini", model: "Aventador", fuelType: "petrol", efficiency: 15, carValue: 220000, currentMileage: 15000, carType: "performance", insurance: 6000, tax: 735, servicing: 3000, tyres: 2500, repairs: 5000 },
  { make: "Audi", model: "A4 2.0 TDI", fuelType: "diesel", efficiency: 55, carValue: 17000, currentMileage: 60000, carType: "standard", insurance: 850, tax: 190, servicing: 500, tyres: 350, repairs: 350 },
  { make: "BMW", model: "320d", fuelType: "diesel", efficiency: 55, carValue: 18000, currentMileage: 65000, carType: "standard", insurance: 900, tax: 190, servicing: 550, tyres: 400, repairs: 400 },
  { make: "BMW", model: "340i", fuelType: "petrol", efficiency: 34, carValue: 22000, currentMileage: 60000, carType: "performance", insurance: 1300, tax: 190, servicing: 650, tyres: 500, repairs: 600 },
  { make: "BMW", model: "335d", fuelType: "diesel", efficiency: 45, carValue: 18000, currentMileage: 70000, carType: "performance", insurance: 1100, tax: 190, servicing: 650, tyres: 500, repairs: 550 },
  { make: "Audi", model: "S3", fuelType: "petrol", efficiency: 34, carValue: 24000, currentMileage: 50000, carType: "performance", insurance: 1300, tax: 190, servicing: 650, tyres: 500, repairs: 500 },
  { make: "Mercedes-Benz", model: "E220d", fuelType: "diesel", efficiency: 58, carValue: 22000, currentMileage: 65000, carType: "standard", insurance: 900, tax: 190, servicing: 600, tyres: 400, repairs: 450 },
  { make: "Mercedes-Benz", model: "C220d", fuelType: "diesel", efficiency: 58, carValue: 19000, currentMileage: 65000, carType: "standard", insurance: 850, tax: 190, servicing: 550, tyres: 400, repairs: 400 },
  { make: "BMW", model: "530d", fuelType: "diesel", efficiency: 50, carValue: 24000, currentMileage: 70000, carType: "standard", insurance: 1000, tax: 190, servicing: 700, tyres: 500, repairs: 500 },
  { make: "Audi", model: "A6 3.0 TDI", fuelType: "diesel", efficiency: 48, carValue: 23000, currentMileage: 70000, carType: "standard", insurance: 950, tax: 190, servicing: 700, tyres: 500, repairs: 500 },
  { make: "Volkswagen", model: "Golf GTI", fuelType: "petrol", efficiency: 38, carValue: 21000, currentMileage: 55000, carType: "performance", insurance: 1000, tax: 190, servicing: 550, tyres: 450, repairs: 400 },
  { make: "Tesla", model: "Model 3", fuelType: "electric", efficiency: 3.5, carValue: 22000, currentMileage: 50000, carType: "standard", insurance: 1200, tax: 195, servicing: 200, tyres: 500, repairs: 400 },
  { make: "Skoda", model: "Octavia vRS", fuelType: "petrol", efficiency: 38, carValue: 22000, currentMileage: 50000, carType: "performance", insurance: 950, tax: 190, servicing: 500, tyres: 450, repairs: 350 },
  { make: "Toyota", model: "GR Yaris", fuelType: "petrol", efficiency: 35, carValue: 28000, currentMileage: 35000, carType: "performance", insurance: 1200, tax: 190, servicing: 450, tyres: 500, repairs: 350 },
  { make: "Toyota", model: "GR86", fuelType: "petrol", efficiency: 34, carValue: 28000, currentMileage: 20000, carType: "performance", insurance: 1000, tax: 190, servicing: 400, tyres: 450, repairs: 300 },
  { make: "BMW", model: "M3", fuelType: "petrol", efficiency: 28, carValue: 32000, currentMileage: 55000, carType: "performance", insurance: 1800, tax: 190, servicing: 800, tyres: 800, repairs: 800 },
  { make: "BMW", model: "M4", fuelType: "petrol", efficiency: 28, carValue: 33000, currentMileage: 50000, carType: "performance", insurance: 1900, tax: 190, servicing: 850, tyres: 850, repairs: 800 },
  { make: "BMW", model: "M5", fuelType: "petrol", efficiency: 24, carValue: 25000, currentMileage: 70000, carType: "performance", insurance: 2200, tax: 735, servicing: 1000, tyres: 1000, repairs: 1200 },
  { make: "Audi", model: "RS4", fuelType: "petrol", efficiency: 27, carValue: 42000, currentMileage: 45000, carType: "performance", insurance: 1800, tax: 190, servicing: 850, tyres: 900, repairs: 700 },
  { make: "Audi", model: "RS5", fuelType: "petrol", efficiency: 28, carValue: 40000, currentMileage: 45000, carType: "performance", insurance: 1800, tax: 190, servicing: 850, tyres: 850, repairs: 700 },
  { make: "Audi", model: "TT RS", fuelType: "petrol", efficiency: 29, carValue: 38000, currentMileage: 40000, carType: "performance", insurance: 1700, tax: 190, servicing: 750, tyres: 800, repairs: 600 },
  { make: "Porsche", model: "718 Cayman", fuelType: "petrol", efficiency: 32, carValue: 35000, currentMileage: 40000, carType: "performance", insurance: 1600, tax: 190, servicing: 700, tyres: 800, repairs: 600 },
  { make: "Porsche", model: "718 Boxster", fuelType: "petrol", efficiency: 32, carValue: 36000, currentMileage: 40000, carType: "performance", insurance: 1700, tax: 190, servicing: 700, tyres: 800, repairs: 600 },
  { make: "Porsche", model: "911", fuelType: "petrol", efficiency: 29, carValue: 85000, currentMileage: 30000, carType: "performance", insurance: 2200, tax: 600, servicing: 900, tyres: 1200, repairs: 800 },
];

const brandCosts: Record<string, Pick<VehicleEstimate, "insurance" | "servicing" | "tyres" | "repairs">> = {
  BMW: { insurance: 1200, servicing: 650, tyres: 400, repairs: 500 },
  AUDI: { insurance: 1150, servicing: 600, tyres: 380, repairs: 450 },
  MERCEDES: { insurance: 1200, servicing: 650, tyres: 400, repairs: 500 },
  VOLKSWAGEN: { insurance: 900, servicing: 450, tyres: 300, repairs: 350 },
  FORD: { insurance: 800, servicing: 400, tyres: 280, repairs: 300 },
  VAUXHALL: { insurance: 750, servicing: 380, tyres: 260, repairs: 300 },
  TOYOTA: { insurance: 750, servicing: 350, tyres: 250, repairs: 250 },
  HONDA: { insurance: 800, servicing: 380, tyres: 260, repairs: 280 },
  HYUNDAI: { insurance: 700, servicing: 350, tyres: 240, repairs: 250 },
  KIA: { insurance: 700, servicing: 350, tyres: 240, repairs: 250 },
  NISSAN: { insurance: 750, servicing: 380, tyres: 260, repairs: 300 },
  PEUGEOT: { insurance: 750, servicing: 380, tyres: 260, repairs: 300 },
  RENAULT: { insurance: 750, servicing: 380, tyres: 260, repairs: 300 },
  LANDROVER: { insurance: 1500, servicing: 900, tyres: 600, repairs: 900 },
  PORSCHE: { insurance: 1800, servicing: 1200, tyres: 800, repairs: 1000 },
  DEFAULT: { insurance: 900, servicing: 450, tyres: 300, repairs: 350 },
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizeMake(value: string) {
  const key = normalize(value);
  return key === "mercedesbenz" ? "mercedes" : key;
}

export function mapDvlaFuelType(value?: string): FuelType | undefined {
  const normalized = value?.toLowerCase() ?? "";
  if (!normalized) return undefined;
  if (normalized.includes("diesel")) return "diesel";
  if (normalized.includes("hybrid")) return "petrol";
  if (normalized.includes("petrol")) return "petrol";
  if (normalized === "electricity" || normalized === "electric" || normalized.includes("pure electric")) {
    return "electric";
  }
  return undefined;
}

function inferElectric(make: string, model: string) {
  const makeKey = normalizeMake(make);
  const modelKey = normalize(model);
  return makeKey === "tesla" || [
    "born",
    "e",
    "e208",
    "etron",
    "etronGT",
    "ev6",
    "ev9",
    "id3",
    "id4",
    "id5",
    "id7",
    "ioniq5",
    "ioniq6",
    "leaf",
    "macanelectric",
    "model3",
    "models",
    "modelx",
    "modely",
    "tavascan",
    "taycan",
    "zoe",
  ].includes(modelKey) || /^(i4|i5|i7|ix|ix1|ix3|ipace|q4etron|etron|etrongt)$/.test(modelKey);
}

function isPerformanceModel(model: string) {
  const key = normalize(model);
  return /^(m\d|rs\d|s\d|amg|gti|gtr|gr|supra|911|aventador|4c|typer)/.test(key) ||
    key.includes("performance");
}

export function getVehicleEstimate(
  make: string,
  model: string,
  dvlaFuel?: string
): VehicleEstimate {
  const makeKey = normalizeMake(make);
  const modelKey = normalize(model);
  const exact = modelEstimates.find(
    (item) => normalizeMake(item.make) === makeKey && normalize(item.model) === modelKey
  );
  const fuelType =
    mapDvlaFuelType(dvlaFuel) ??
    exact?.fuelType ??
    (inferElectric(make, model) ? "electric" : "petrol");
  const performance = exact?.carType === "performance" || isPerformanceModel(model);
  const isHybrid = /hybrid|plug.?in|petrol\/electric|diesel\/electric/i.test(
    `${dvlaFuel ?? ""} ${model}`
  );
  const carClass: VehicleClass = performance ? "performance" : "standard";
  const costs = exact ?? {
    make,
    model,
    fuelType,
    efficiency: 0,
    carValue: carClass === "performance" ? 25000 : 18000,
    currentMileage: 50000,
    carType: carClass,
    insurance: 0,
    tax: 195,
    servicing: 0,
    tyres: 0,
    repairs: 0,
  };
  const brand = brandCosts[makeKey.toUpperCase()] ?? brandCosts.DEFAULT;
  const efficiency = exact?.efficiency ?? (
    fuelType === "electric"
      ? performance ? 3.0 : 3.5
      : isHybrid
        ? 50
        : fuelType === "diesel"
        ? performance ? 42 : 52
        : performance ? 32 : 42
  );

  return {
    fuelType,
    efficiency,
    fuelPrice: DEFAULT_FUEL_PRICES[fuelType],
    carValue: costs.carValue,
    currentMileage: costs.currentMileage,
    carType: performance ? "performance" : costs.carType,
    insurance: costs.insurance || brand.insurance,
    tax: costs.tax,
    servicing: costs.servicing || brand.servicing,
    tyres: costs.tyres || brand.tyres,
    repairs: costs.repairs || brand.repairs,
    estimateSource: exact ? "model" : "vehicle_class",
  };
}
