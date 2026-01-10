/**
 * Analytics Hook for Google Analytics & Microsoft Clarity Event Tracking
 * Only fires events if user has consented to analytics cookies
 */

type EventCategory = 
  | "cta_click"
  | "form_submission"
  | "demo_booking"
  | "download"
  | "navigation"
  | "engagement";

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

  return {
    trackEvent,
    trackCTAClick,
    trackFormSubmission,
    trackDemoBooking,
    trackDownload,
    trackNavigation,
    trackEngagement,
  };
};

export default useAnalytics;
