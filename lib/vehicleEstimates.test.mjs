import assert from "node:assert/strict";
import test from "node:test";
import { getVehicleEstimate, mapDvlaFuelType } from "./vehicleEstimates.ts";

test("uses model-level guide estimates for known models", () => {
  const estimate = getVehicleEstimate("BMW", "M140i");

  assert.equal(estimate.estimateSource, "model");
  assert.equal(estimate.fuelType, "petrol");
  assert.equal(estimate.efficiency, 34);
  assert.equal(estimate.carValue, 18000);
  assert.equal(estimate.carType, "performance");
});

test("recognizes a Tesla Model 3 as electric without a fuel-type prompt", () => {
  const estimate = getVehicleEstimate("Tesla", "Model 3");

  assert.equal(estimate.fuelType, "electric");
  assert.equal(estimate.efficiency, 3.5);
  assert.equal(estimate.fuelPrice, 8);
});

test("prefers a clear DVLA fuel result over the model fallback", () => {
  const estimate = getVehicleEstimate("BMW", "320d", "ELECTRICITY");

  assert.equal(estimate.fuelType, "electric");
  assert.equal(mapDvlaFuelType("DIESEL"), "diesel");
});

test("does not treat hybrid-electric DVLA values as pure EVs", () => {
  assert.equal(mapDvlaFuelType("HYBRID ELECTRIC"), "petrol");
  assert.equal(
    getVehicleEstimate("Toyota", "Prius", "HYBRID ELECTRIC").efficiency,
    50
  );
});

test("provides a fuel-aware class estimate for models without curated data", () => {
  const diesel = getVehicleEstimate("Ford", "Mondeo", "DIESEL");
  const electric = getVehicleEstimate("Nissan", "Leaf");

  assert.equal(diesel.estimateSource, "vehicle_class");
  assert.equal(diesel.fuelType, "diesel");
  assert.equal(diesel.efficiency, 52);
  assert.equal(electric.fuelType, "electric");
  assert.equal(electric.efficiency, 3.5);
});
