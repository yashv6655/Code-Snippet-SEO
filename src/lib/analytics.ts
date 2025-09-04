import posthog from "posthog-js";

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  }
};