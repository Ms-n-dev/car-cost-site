import assert from "node:assert/strict";
import test from "node:test";
import { calculateCarCosts } from "./CalculateCarCosts.ts";

const baseInput = {
  carValue: 20000,
  carYear: 2020,
  annualMiles: 8000,
  currentMileage: 40000,
  carType: "standard",
  fuelType: "petrol",
  efficiency: 40,
  fuelPrice: 150,
  insurance: 900,
  tax: 190,
  servicing: 400,
  tyres: 250,
  repairsBuffer: 300,
  miscCosts: 100,
  ownershipYears: 3,
};

test("calculates petrol costs using UK mpg and pence-per-litre inputs", () => {
  const result = calculateCarCosts(baseInput);
  const expectedFuel = (8000 / 40) * 4.54609 * 1.5;

  assert.ok(Math.abs(result.annualFuelCost - expectedFuel) < 0.001);
});

test("does not estimate EV energy cost when efficiency is missing", () => {
  const result = calculateCarCosts({
    ...baseInput,
    fuelType: "electric",
    efficiency: 0,
    fuelPrice: 8,
  });

  assert.equal(result.annualFuelCost, 0);
});

test("calculates EV costs from miles per kWh and pence per kWh", () => {
  const result = calculateCarCosts({
    ...baseInput,
    fuelType: "electric",
    efficiency: 3.5,
    fuelPrice: 8,
  });

  assert.ok(Math.abs(result.annualFuelCost - (8000 / 3.5) * 0.08) < 0.001);
});

test("clamps invalid and negative monetary inputs to zero", () => {
  const result = calculateCarCosts({
    ...baseInput,
    carValue: -20000,
    insurance: Number.NaN,
    tax: -100,
  });

  assert.equal(result.totalDepreciation, 0);
  assert.equal(result.totalInsurance, 0);
  assert.equal(result.totalTax, 0);
  assert.ok(result.totalCost >= 0);
});

test("total cost equals the sum of its ownership cost components", () => {
  const result = calculateCarCosts(baseInput);
  const components =
    result.totalFuelCost +
    result.totalInsurance +
    result.totalTax +
    result.totalMaintenance +
    result.totalDepreciation +
    result.totalMiscCosts;

  assert.ok(Math.abs(result.totalCost - components) < 0.001);
  assert.ok(Math.abs(result.monthlyCost - result.totalCost / 36) < 0.001);
});