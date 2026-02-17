import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Records a page visit to the site_visits table on each route change.
 * Debounces to avoid duplicate entries on rapid navigation.
 */
export const useSiteVisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        await supabase.from("site_visits").insert({
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
        });
      } catch (err) {
        // Silently fail – analytics should never break the app
        console.warn("Failed to record visit:", err);
      }
    };

    recordVisit();
  }, [location.pathname]);
};
