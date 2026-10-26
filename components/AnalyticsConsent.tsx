"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import {
  clearPendingAnalyticsEvents,
  createPageViewTracker,
  flushPendingAnalyticsEvents,
  resetCalculatorAttempt,
  trackEvent,
  trackPageView,
} from "@/lib/gtag";

type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    __carcalcAnalyticsAllowed?: boolean;
    __carcalcGAInitialized?: boolean;
    __carcalcClarityInitialized?: boolean;
  }
}

const consentKey = "carcalc-analytics-consent";
const consentEvent = "carcalc:analytics-consent";
const gaReadyEvent = "carcalc:ga-ready";
const landingPageKey = "carcalc:landing-page-viewed";
const calculatorRoutes = new Set(["/", "/v1", "/v2", "/compare"]);
let memoryConsent: Consent = null;
const trackPageViewOnce = createPageViewTracker(trackPageView);
let landingPageTrackedInRuntime = false;

function trackLandingPageOnce(pathname: string) {
  if (landingPageTrackedInRuntime) return;

  try {
    if (window.sessionStorage.getItem(landingPageKey)) {
      landingPageTrackedInRuntime = true;
      return;
    }
  } catch {
    if (trackEvent("landing_page_viewed", { page_path: pathname })) {
      landingPageTrackedInRuntime = true;
    }
    return;
  }

  if (!trackEvent("landing_page_viewed", { page_path: pathname })) return;
  landingPageTrackedInRuntime = true;

  try {
    window.sessionStorage.setItem(landingPageKey, "1");
  } catch {
    landingPageTrackedInRuntime = true;
  }
}

function getConsent(): Consent {
  let consent = memoryConsent;
  try {
    const value = window.localStorage.getItem(consentKey);
    if (value === "accepted" || value === "rejected") consent = value;
  } catch {
    consent = memoryConsent;
  }

  window.__carcalcAnalyticsAllowed = consent === "accepted";
  return consent;
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
  window.__carcalcAnalyticsAllowed = value === "accepted";
  clearPendingAnalyticsEvents();
  try {
    window.localStorage.setItem(consentKey, value);
  } catch {
    memoryConsent = value;
  }
  const analyticsConsent = value === "accepted" ? "granted" : "denied";
  try {
    window.gtag?.("consent", "update", {
      analytics_storage: analyticsConsent,
      ad_storage: "denied",
    });
  } catch {
    window.__carcalcAnalyticsAllowed = value === "accepted";
  }
  try {
    window.clarity?.("consentv2", {
      analytics_Storage: analyticsConsent,
      ad_Storage: "denied",
    });
  } catch {
    window.__carcalcAnalyticsAllowed = value === "accepted";
  }
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
      <AnalyticsPageViews />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          if (!window.__carcalcGAInitialized) {
            window.__carcalcGAInitialized = true;
            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);};
            window.gtag('consent', 'default', {analytics_storage: 'granted', ad_storage: 'denied'});
            window.gtag('js', new Date());
            window.gtag('config', 'G-0ZDCRFPDN5', {send_page_view: false});
            window.dispatchEvent(new Event('carcalc:ga-ready'));
          }
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-0ZDCRFPDN5"
        strategy="afterInteractive"
      />
      <Script id="clarity" strategy="afterInteractive">
        {`
          if (!window.__carcalcClarityInitialized) {
            window.__carcalcClarityInitialized = true;
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
          }
        `}
      </Script>
      <Analytics />
    </>
  );
}

function AnalyticsPageViews() {
  const pathname = usePathname();

  useEffect(() => {
    const sendPageView = () => {
      if (pathname && trackPageViewOnce(pathname, document.title)) {
        if (calculatorRoutes.has(pathname)) resetCalculatorAttempt();
        trackLandingPageOnce(pathname);
      }

      flushPendingAnalyticsEvents();
    };

    window.addEventListener(gaReadyEvent, sendPageView);
    sendPageView();
    return () => window.removeEventListener(gaReadyEvent, sendPageView);
  }, [pathname]);

  return null;
}
