import { useState } from "react";
import Link from "next/link";
import type { V2FormData } from "@/app/v2/page";
import { trackSuccessfulLeadSubmission } from "@/lib/gtag";

type Service = "insurance" | "warranty";

type Props = {
  open: boolean;
  service: Service;
  data: V2FormData;
  onClose: () => void;
};

export default function AffiliateLeadModal({
  open,
  service,
  data,
  onClose,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    mileage: String(Number(data.currentMileage) || ""),
  });
  const [consented, setConsented] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const serviceLabel = service === "insurance" ? "insurance" : "warranty";
  const vehicleName = data.makeModel.replace(" | ", " ") || data.reg || "your car";
  const canSubmit =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.phone.trim() !== "" &&
    (service !== "insurance" || form.postcode.trim() !== "") &&
    consented &&
    !sending;

  async function submitLead() {
    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/affiliate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name: form.name,
          email: form.email,
          phone: form.phone,
          postcode: form.postcode,
          reg: data.reg,
          makeModel: data.makeModel,
          carYear: data.carYear,
          annualMiles: data.annualMiles,
          currentMileage: form.mileage,
          consent: consented,
        }),
      });

      if (!response.ok) {
        setError("We could not send your enquiry. Please try again.");
        return;
      }

      trackSuccessfulLeadSubmission(
        true,
        service === "insurance" ? "insurance_enquiry" : "warranty_enquiry"
      );
      onClose();
      setForm({ name: "", email: "", phone: "", postcode: "", mileage: "" });
      setConsented(false);
    } catch {
      setError("We could not send your enquiry. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 px-4 py-6 backdrop-blur-sm sm:flex sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="affiliate-lead-title"
        className="relative mx-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              {serviceLabel} enquiry
            </p>
            <h2 id="affiliate-lead-title" className="mt-2 text-2xl font-semibold text-slate-950">
              Ask about {serviceLabel} for {vehicleName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enquiry"
            className="border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Close
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          This sends an enquiry to the CarCalc team. No insurer or warranty provider is connected yet, so this form does not generate a quote.
        </p>

        <div className="mt-5 grid gap-3">
          <input
            aria-label="Name"
            autoComplete="name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            aria-label="Email address"
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email address"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            aria-label="Phone number"
            autoComplete="tel"
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Phone number"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          {service === "insurance" && (
            <input
              aria-label="Postcode"
              autoComplete="postal-code"
              value={form.postcode}
              onChange={(event) => setForm((current) => ({ ...current, postcode: event.target.value }))}
              placeholder="UK postcode"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          )}
          {service === "warranty" && (
            <input
              aria-label="Current mileage"
              type="number"
              min="0"
              value={form.mileage}
              onChange={(event) => setForm((current) => ({ ...current, mileage: event.target.value }))}
              placeholder="Current mileage"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          )}
        </div>

        <label className="mt-4 flex items-start gap-3 text-xs leading-5 text-slate-600">
          <input
            type="checkbox"
            checked={consented}
            onChange={(event) => setConsented(event.target.checked)}
            className="mt-1"
          />
          <span>
            I agree that CarCalc may use these details to respond to this enquiry. See our{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </span>
        </label>

        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

        <button
          type="button"
          disabled={!canSubmit}
          onClick={submitLead}
          className="mt-5 w-full rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? "Sending..." : `Send ${serviceLabel} enquiry`}
        </button>
      </section>
    </div>
  );
}
