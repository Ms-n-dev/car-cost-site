export type AnalyticsParameter = string | number | boolean | null | undefined;
export type AnalyticsParameters = Record<string, AnalyticsParameter>;
export type CalculatorType = "single" | "comparison";
export type LeadType =
  | "finance_inquiry"
  | "email_breakdown"
  | "insurance_enquiry"
  | "warranty_enquiry";
export type ResultsCtaType =
  | "finance_inquiry"
  | "email_breakdown"
  | "insurance_enquiry"
  | "warranty_enquiry"
  | "compare_another_car"
  | "ownership_guides"
  | "similar_vehicles";

type AttemptState = {
  id: string;
  calculatorType: CalculatorType;
  calculatorStep: number;
  started: boolean;
  completed: boolean;
  reachedSteps: Set<number>;
};

type EventSender = (eventName: string, parameters: AnalyticsParameters) => boolean;

export function createFunnelTracker(
  send: EventSender,
  createAttemptId: () => string
) {
  let attempt: AttemptState | null = null;

  function attemptParameters(): AnalyticsParameters {
    if (!attempt) return {};
    return {
      attempt_id: attempt.id,
      calculator_type: attempt.calculatorType,
    };
  }

  function start(calculatorType: CalculatorType, calculatorStep: number) {
    if (!attempt) {
      attempt = {
        id: createAttemptId(),
        calculatorType,
        calculatorStep,
        started: false,
        completed: false,
        reachedSteps: new Set([calculatorStep]),
      };
    }

    if (attempt.started) return false;

    const sent = send("calculator_started", {
      attempt_id: attempt.id,
      calculator_type: attempt.calculatorType,
      calculator_step: attempt.calculatorStep,
    });

    if (sent) attempt.started = true;
    return sent;
  }

  function complete(parameters: {
    calculatorStep?: number;
    purchaseMethod?: "cash" | "finance";
    ownershipYears?: number;
  } = {}) {
    if (!attempt) return false;
    if (attempt.completed) return false;
    if (!attempt.started && !start(attempt.calculatorType, attempt.calculatorStep)) {
      return false;
    }

    const sent = send("calculator_completed", {
      ...attemptParameters(),
      calculator_step: parameters.calculatorStep ?? attempt.calculatorStep,
      ...(parameters.purchaseMethod
        ? { purchase_method: parameters.purchaseMethod }
        : {}),
      ...(parameters.ownershipYears !== undefined
        ? { ownership_years: parameters.ownershipYears }
        : {}),
    });

    if (sent) attempt.completed = true;
    return sent;
  }

  function reachStep(calculatorStep: number) {
    if (!attempt?.started || attempt.reachedSteps.has(calculatorStep)) return false;

    const sent = send("calculator_step_reached", {
      ...attemptParameters(),
      calculator_step: calculatorStep,
    });

    if (sent) attempt.reachedSteps.add(calculatorStep);
    return sent;
  }

  function recalculate(parameters: {
    calculatorStep?: number;
    purchaseMethod?: "cash" | "finance";
    ownershipYears?: number;
  } = {}) {
    if (!attempt?.started) return false;

    return send("calculator_recalculated", {
      ...attemptParameters(),
      calculator_step: parameters.calculatorStep ?? attempt.calculatorStep,
      ...(parameters.purchaseMethod
        ? { purchase_method: parameters.purchaseMethod }
        : {}),
      ...(parameters.ownershipYears !== undefined
        ? { ownership_years: parameters.ownershipYears }
        : {}),
    });
  }

  function resultsCtaClicked(ctaType: ResultsCtaType) {
    return send("results_cta_clicked", {
      ...attemptParameters(),
      cta_type: ctaType,
    });
  }

  function leadSubmitted(
    success: boolean,
    leadType: LeadType
  ) {
    if (!success) return false;
    return send("lead_submitted", {
      ...attemptParameters(),
      lead_type: leadType,
    });
  }

  return {
    start,
    reachStep,
    complete,
    recalculate,
    resultsCtaClicked,
    leadSubmitted,
    flushPendingStart() {
      if (!attempt || attempt.started) return false;
      return start(attempt.calculatorType, attempt.calculatorStep);
    },
    reset() {
      attempt = null;
    },
    getAttemptId() {
      return attempt?.id;
    },
  };
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __carcalcAnalyticsAllowed?: boolean;
  }
}

type QueuedEvent = { name: string; parameters: AnalyticsParameters };
const queuedEvents: QueuedEvent[] = [];
const identifyingParameterPattern = /email|phone|name|registration|number_plate|postcode|post_code|postal_code|address|budget|deposit|contact|first_name|last_name|(^|_)reg($|_)/i;
const allowedCampaignParameters = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_id",
  "utm_content",
];

export function sanitizeAnalyticsParameters(
  parameters: AnalyticsParameters
): AnalyticsParameters {
  return Object.fromEntries(
    Object.entries(parameters).filter(
      ([key, value]) => !identifyingParameterPattern.test(key) && value !== undefined
    )
  );
}

function sendEvent(eventName: string, parameters: AnalyticsParameters) {
  if (typeof window === "undefined" || !window.__carcalcAnalyticsAllowed) return false;

  const safeEvent = {
    name: eventName,
    parameters: sanitizeAnalyticsParameters(parameters),
  };
  if (typeof window.gtag !== "function") {
    queuedEvents.push(safeEvent);
    return true;
  }

  try {
    window.gtag("event", safeEvent.name, safeEvent.parameters);
    return true;
  } catch {
    return false;
  }
}

function generateAttemptId() {
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

const funnelTracker = createFunnelTracker(sendEvent, generateAttemptId);

export function trackEvent(
  eventName: string,
  parameters: AnalyticsParameters = {}
) {
  return sendEvent(eventName, parameters);
}

export function trackCalculatorStarted(
  calculatorType: CalculatorType,
  calculatorStep: number
) {
  return funnelTracker.start(calculatorType, calculatorStep);
}

export function trackCalculatorCompleted(parameters: {
  calculatorStep?: number;
  purchaseMethod?: "cash" | "finance";
  ownershipYears?: number;
} = {}) {
  return funnelTracker.complete(parameters);
}

export function trackCalculatorRecalculated(parameters: {
  calculatorStep?: number;
  purchaseMethod?: "cash" | "finance";
  ownershipYears?: number;
} = {}) {
  return funnelTracker.recalculate(parameters);
}

export function trackResultsCtaClicked(ctaType: ResultsCtaType) {
  return funnelTracker.resultsCtaClicked(ctaType);
}

export function trackSuccessfulLeadSubmission(
  success: boolean,
  leadType: LeadType
) {
  return funnelTracker.leadSubmitted(success, leadType);
}

export function flushPendingAnalyticsEvents() {
  if (
    typeof window === "undefined" ||
    !window.__carcalcAnalyticsAllowed ||
    typeof window.gtag !== "function"
  ) {
    return false;
  }

  while (queuedEvents.length > 0) {
    const event = queuedEvents.shift();
    if (!event) continue;
    try {
      window.gtag("event", event.name, event.parameters);
    } catch {
      queuedEvents.unshift(event);
      return false;
    }
  }

  return funnelTracker.flushPendingStart();
}

export function resetCalculatorAttempt() {
  funnelTracker.reset();
}

export function clearPendingAnalyticsEvents() {
  queuedEvents.length = 0;
  funnelTracker.reset();
}

export function trackPageView(pathname: string, title: string) {
  if (typeof window === "undefined") return false;

  return trackEvent("page_view", {
    page_location: getSafePageLocation(
      pathname,
      window.location.search,
      window.location.origin
    ),
    page_title: title,
  });
}

export function getSafePageLocation(
  pathname: string,
  search = "",
  origin = "https://carcalc.app"
) {
  const pageUrl = new URL(pathname, origin);
  const incomingParameters = new URLSearchParams(search);
  const safeParameters = new URLSearchParams();

  for (const key of allowedCampaignParameters) {
    const value = incomingParameters.get(key)?.trim();
    if (
      value &&
      value.length <= 100 &&
      !/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(value) &&
      !/\+?\d[\d\s().-]{7,}/.test(value)
    ) {
      safeParameters.set(key, value);
    }
  }

  pageUrl.search = safeParameters.toString();
  return pageUrl.toString();
}

export function createPageViewTracker(
  send: (pathname: string, title: string) => boolean
) {
  let lastPathname: string | null = null;

  return (pathname: string, title: string) => {
    if (pathname === lastPathname) return false;
    if (!send(pathname, title)) return false;
    lastPathname = pathname;
    return true;
  };
}

export function trackCalculatorStepReached(calculatorStep: number) {
  return funnelTracker.reachStep(calculatorStep);
}