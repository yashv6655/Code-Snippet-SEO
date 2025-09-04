"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

declare global {
  interface Window {
    __posthog_inited?: boolean;
  }
}

type Props = { children?: React.ReactNode };

function AnalyticsProviderInner({ children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

    if (!window.__posthog_inited) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        capture_pageleave: false,
      });
      window.__posthog_inited = true;

      posthog.register({
        environment: process.env.NODE_ENV,
      });
    }

    const handlePageLeave = () => {
      if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.capture("$pageleave");
      }
    };

    window.addEventListener("beforeunload", handlePageLeave);
    window.addEventListener("pagehide", handlePageLeave);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handlePageLeave();
      }
    });

    return () => {
      window.removeEventListener("beforeunload", handlePageLeave);
      window.removeEventListener("pagehide", handlePageLeave);
      document.removeEventListener("visibilitychange", handlePageLeave);
    };
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    
    posthog.capture("$pageview", { 
      $current_url: window.location.href,
      $pathname: pathname,
      $search: searchParams?.toString() || ""
    });
  }, [pathname, searchParams]);

  return children as React.ReactElement | null;
}

export default function AnalyticsProvider({ children }: Props) {
  return (
    <Suspense fallback={children as React.ReactElement | null}>
      <AnalyticsProviderInner>{children}</AnalyticsProviderInner>
    </Suspense>
  );
}