/**
 * Analytics Hook for Google Analytics & Microsoft Clarity Event Tracking
 * Only fires events if user has consented to analytics cookies
 */

import { useEffect, useRef, useCallback } from "react";

type EventCategory = 
  | "cta_click"
  | "form_submission"
  | "demo_booking"
  | "download"
  | "navigation"
  | "engagement"
  | "scroll"
  | "agent_view"
  | "agent_click";

interface TrackEventParams {
  action: string;
  category: EventCategory;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export const useAnalytics = () => {
  const hasConsent = () => localStorage.getItem("cookie-consent") === "accepted";

  const trackEvent = ({ action, category, label, value }: TrackEventParams) => {
    if (!hasConsent()) return;

    // Google Analytics 4 Event
    if (typeof window.gtag === "function") {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }

    // Microsoft Clarity Custom Event
    if (typeof window.clarity === "function") {
      window.clarity("event", action);
    }

    // Debug logging in development
    if (import.meta.env.DEV) {
      console.log("📊 Analytics Event:", { action, category, label, value });
    }
  };

  // Pre-defined tracking functions for common events
  const trackCTAClick = (ctaName: string, location?: string) => {
    trackEvent({
      action: "cta_click",
      category: "cta_click",
      label: `${ctaName}${location ? ` - ${location}` : ""}`,
    });
  };

  const trackFormSubmission = (formName: string, success: boolean = true) => {
    trackEvent({
      action: success ? "form_submit_success" : "form_submit_error",
      category: "form_submission",
      label: formName,
    });
  };

  const trackDemoBooking = (date?: string, time?: string) => {
    trackEvent({
      action: "demo_booked",
      category: "demo_booking",
      label: date && time ? `${date} at ${time}` : "Demo scheduled",
    });
  };

  const trackDownload = (fileName: string) => {
    trackEvent({
      action: "file_download",
      category: "download",
      label: fileName,
    });
  };

  const trackNavigation = (destination: string) => {
    trackEvent({
      action: "navigation",
      category: "navigation",
      label: destination,
    });
  };

  const trackEngagement = (action: string, details?: string) => {
    trackEvent({
      action,
      category: "engagement",
      label: details,
    });
  };

  const trackAgentView = (agentName: string) => {
    trackEvent({
      action: "agent_view",
      category: "agent_view",
      label: agentName,
    });
  };

  const trackAgentClick = (agentName: string) => {
    trackEvent({
      action: "agent_click",
      category: "agent_click",
      label: agentName,
    });
  };

  return {
    trackEvent,
    trackCTAClick,
    trackFormSubmission,
    trackDemoBooking,
    trackDownload,
    trackNavigation,
    trackEngagement,
    trackAgentView,
    trackAgentClick,
  };
};

/**
 * Hook for tracking scroll depth
 * Tracks when users scroll to 25%, 50%, 75%, and 100% of the page
 */
export const useScrollDepthTracking = () => {
  const milestones = useRef<Set<number>>(new Set());
  const { trackEvent } = useAnalytics();

  const hasConsent = () => localStorage.getItem("cookie-consent") === "accepted";

  useEffect(() => {
    const handleScroll = () => {
      if (!hasConsent()) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      const thresholds = [25, 50, 75, 100];
      
      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !milestones.current.has(threshold)) {
          milestones.current.add(threshold);
          trackEvent({
            action: `scroll_depth_${threshold}`,
            category: "scroll",
            label: `Scrolled ${threshold}%`,
            value: threshold,
          });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackEvent]);

  // Reset milestones on page change
  const resetMilestones = useCallback(() => {
    milestones.current.clear();
  }, []);

  return { resetMilestones };
};

/**
 * Hook for tracking element visibility (agent cards, sections, etc.)
 */
export const useViewTracking = (
  elementRef: React.RefObject<HTMLElement>,
  itemName: string,
  onView: (name: string) => void
) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTracked.current) {
            hasTracked.current = true;
            onView(itemName);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, itemName, onView]);
};

export default useAnalytics;

