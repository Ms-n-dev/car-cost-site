import assert from "node:assert/strict";
import test from "node:test";
import {
  escapeHtml,
  isValidEmail,
  nonnegativeNumber,
  readJsonBody,
  textField,
} from "./requestValidation.ts";

test("escapes markup characters before values are included in email HTML", () => {
  assert.equal(
    escapeHtml(`<img src="x" onerror='x'>&`),
    "&lt;img src=&quot;x&quot; onerror=&#39;x&#39;&gt;&amp;"
  );
});

test("validates bounded text and email fields", () => {
  assert.equal(textField("  Alex  ", 10), "Alex");
  assert.equal(textField("too long", 3), null);
  assert.equal(textField({ value: "x" }, 20), null);
  assert.equal(isValidEmail("driver@example.co.uk"), true);
  assert.equal(isValidEmail("invalid@"), false);
});

test("accepts only finite nonnegative bounded numbers", () => {
  assert.equal(nonnegativeNumber("125.50"), 125.5);
  assert.equal(nonnegativeNumber(0), 0);
  assert.equal(nonnegativeNumber(-1), null);
  assert.equal(nonnegativeNumber(Number.NaN), null);
  assert.equal(nonnegativeNumber(""), null);
  assert.equal(nonnegativeNumber(101, 100), null);
});

test("reads valid JSON bodies and rejects malformed or oversized bodies", async () => {
  const validRequest = new Request("https://carcalc.app/api", {
    method: "POST",
    body: JSON.stringify({ email: "driver@example.co.uk" }),
  });
  const validResult = await readJsonBody(validRequest, 100);
  assert.deepEqual(validResult, {
    ok: true,
    value: { email: "driver@example.co.uk" },
  });

  const malformedRequest = new Request("https://carcalc.app/api", {
    method: "POST",
    body: "{bad json",
  });
  assert.deepEqual(await readJsonBody(malformedRequest), {
    ok: false,
    status: 400,
  });

  const oversizedRequest = new Request("https://carcalc.app/api", {
    method: "POST",
    body: "x".repeat(101),
  });
  assert.deepEqual(await readJsonBody(oversizedRequest, 100), {
    ok: false,
    status: 413,
  });
});