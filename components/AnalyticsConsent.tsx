"use client";

import { useState, useSyncExternalStore } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const consentKey = "carcalc-analytics-consent";
const consentEvent = "carcalc:analytics-consent";
let memoryConsent: Consent = null;

function getConsent(): Consent {
  try {
    const value = window.localStorage.getItem(consentKey);
    if (value === "accepted" || value === "rejected") return value;
  } catch {
    return memoryConsent;
  }

  return memoryConsent;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(consentEvent, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(consentEvent, onChange);
  };
}

function saveConsent(value: Exclude<Consent, null>) {
  memoryConsent = value;
  try {
    window.localStorage.setItem(consentKey, value);
  } catch {
    memoryConsent = value;
  }
  const analyticsConsent = value === "accepted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: analyticsConsent,
    ad_storage: "denied",
  });
  window.clarity?.("consentv2", {
    analytics_Storage: analyticsConsent,
    ad_Storage: "denied",
  });
  window.dispatchEvent(new Event(consentEvent));
}

export default function AnalyticsConsent() {
  const consent = useSyncExternalStore(subscribe, getConsent, () => null);
  const [editing, setEditing] = useState(false);

  if (consent === null || editing) {
    return (
      <>
        <aside
          aria-label="Optional analytics preferences"
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl border border-slate-300 bg-white p-4 shadow-xl sm:inset-x-6 sm:bottom-6 sm:flex sm:items-center sm:justify-between sm:gap-6"
        >
          <p className="text-sm leading-6 text-slate-700">
            Optional analytics help us understand site usage. They load only if
            you accept; declining does not affect the calculator.
          </p>
          <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
            <button
              type="button"
              onClick={() => {
                saveConsent("rejected");
                setEditing(false);
              }}
              className="border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={() => {
                saveConsent("accepted");
                setEditing(false);
              }}
              className="bg-slate-950 px-3 py-2 text-sm font-medium text-white"
            >
              Accept optional
            </button>
          </div>
        </aside>
        {consent === "accepted" && <AnalyticsScripts />}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="fixed bottom-3 left-3 z-40 border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow sm:bottom-6 sm:left-6"
      >
        Privacy settings
      </button>
      {consent === "accepted" && <AnalyticsScripts />}
    </>
  );
}

function AnalyticsScripts() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0ZDCRFPDN5"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = function(){window.dataLayer.push(arguments);};
          window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied'});
          window.gtag('js', new Date());
          window.gtag('config', 'G-0ZDCRFPDN5');
        `}
      </Script>
      <Script id="clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            if (typeof c[a] !== "function") {
              c[a] = function(){(c[a].q = c[a].q || []).push(arguments)};
            }
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "webk7iqmo5");
        `}
      </Script>
      <Analytics />
    </>
  );
}
