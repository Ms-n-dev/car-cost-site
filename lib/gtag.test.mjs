import assert from "node:assert/strict";
import test from "node:test";
import {
  createFunnelTracker,
  createPageViewTracker,
  getSafePageLocation,
  sanitizeAnalyticsParameters,
} from "./gtag.ts";

function createHarness() {
  const events = [];
  let nextId = 0;
  const tracker = createFunnelTracker((name, parameters) => {
    events.push({ name, parameters });
    return true;
  }, () => `attempt-${++nextId}`);
  return { events, tracker };
}

test("one calculator attempt sends one start and one completion", () => {
  const { events, tracker } = createHarness();

  tracker.start("single", 1);
  tracker.start("single", 1);
  tracker.complete({ purchaseMethod: "finance", ownershipYears: 3 });
  tracker.complete({ purchaseMethod: "finance", ownershipYears: 3 });

  assert.deepEqual(events.map((event) => event.name), [
    "calculator_started",
    "calculator_completed",
  ]);
  assert.equal(events[0].parameters.attempt_id, events[1].parameters.attempt_id);
  assert.equal(events[1].parameters.purchase_method, "finance");
  assert.equal(events[1].parameters.ownership_years, 3);
});

test("a completed attempt only recalculates on explicit calls", () => {
  const { events, tracker } = createHarness();

  tracker.start("single", 1);
  tracker.complete();
  tracker.recalculate({ purchaseMethod: "cash", ownershipYears: 2 });

  assert.deepEqual(events.map((event) => event.name), [
    "calculator_started",
    "calculator_completed",
    "calculator_recalculated",
  ]);
  assert.equal(events[2].parameters.ownership_years, 2);
});

test("wizard steps are tracked once only when explicitly reached", () => {
  const { events, tracker } = createHarness();

  tracker.start("single", 1);
  tracker.reachStep(2);
  tracker.reachStep(2);
  tracker.reachStep(3);

  assert.deepEqual(events.map((event) => event.name), [
    "calculator_started",
    "calculator_step_reached",
    "calculator_step_reached",
  ]);
  assert.deepEqual(
    events.slice(1).map((event) => event.parameters.calculator_step),
    [2, 3]
  );
});

test("one CTA interaction produces one event with a safe CTA type", () => {
  const { events, tracker } = createHarness();

  tracker.start("single", 1);
  tracker.resultsCtaClicked("email_breakdown");

  assert.equal(events.filter((event) => event.name === "results_cta_clicked").length, 1);
  assert.equal(events[1].parameters.cta_type, "email_breakdown");
});

test("failed lead submissions do not emit conversions", () => {
  const { events, tracker } = createHarness();

  assert.equal(tracker.leadSubmitted(false, "finance_inquiry"), false);
  assert.equal(events.length, 0);

  tracker.leadSubmitted(true, "finance_inquiry");
  assert.deepEqual(events.map((event) => event.name), ["lead_submitted"]);
  assert.deepEqual(Object.keys(events[0].parameters), ["lead_type"]);
});

test("a pending start is emitted once when analytics becomes available", () => {
  const events = [];
  let analyticsAvailable = false;
  const tracker = createFunnelTracker((name, parameters) => {
    if (!analyticsAvailable) return false;
    events.push({ name, parameters });
    return true;
  }, () => "attempt-pending");

  tracker.start("comparison", 1);
  analyticsAvailable = true;
  tracker.flushPendingStart();
  tracker.flushPendingStart();
  tracker.complete();

  assert.deepEqual(events.map((event) => event.name), [
    "calculator_started",
    "calculator_completed",
  ]);
});

test("a new attempt requires an explicit reset after completion", () => {
  const { events, tracker } = createHarness();

  tracker.start("single", 1);
  tracker.complete();
  tracker.start("single", 1);
  tracker.reset();
  tracker.start("single", 1);

  assert.deepEqual(events.map((event) => event.name), [
    "calculator_started",
    "calculator_completed",
    "calculator_started",
  ]);
  assert.notEqual(events[0].parameters.attempt_id, events[2].parameters.attempt_id);
});

test("pathname tracking emits once per distinct SPA route", () => {
  const pages = [];
  const trackPage = createPageViewTracker((pathname, title) => {
    pages.push({ pathname, title });
    return true;
  });

  assert.equal(trackPage("/", "Home"), true);
  assert.equal(trackPage("/", "Home"), false);
  assert.equal(trackPage("/compare", "Compare"), true);
  assert.deepEqual(pages.map((page) => page.pathname), ["/", "/compare"]);
});

test("analytics parameters drop common personal and financial identifiers", () => {
  assert.deepEqual(
    sanitizeAnalyticsParameters({
      attempt_id: "opaque-attempt-id",
      calculator_type: "single",
      email: "driver@example.com",
      registration_number: "AB12CDE",
      postcode: "SW1A 1AA",
      budget: 20000,
      purchase_method: "finance",
    }),
    {
      attempt_id: "opaque-attempt-id",
      calculator_type: "single",
      purchase_method: "finance",
    }
  );
});

test("page URLs retain only safe UTM values and remove arbitrary or PII query values", () => {
  const location = getSafePageLocation(
    "/cost-to-own/bmw-m140i",
    "?utm_source=search&utm_medium=cpc&utm_campaign=summer&email=driver%40example.com&utm_content=07123456789",
    "https://carcalc.app"
  );

  assert.equal(
    location,
    "https://carcalc.app/cost-to-own/bmw-m140i?utm_source=search&utm_medium=cpc&utm_campaign=summer"
  );
});
