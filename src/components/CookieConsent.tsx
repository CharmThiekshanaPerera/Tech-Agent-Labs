import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X, Settings } from "lucide-react";

const GA_MEASUREMENT_ID = "G-J4VKZHZK2N";

type ConsentStatus = "pending" | "accepted" | "declined";

const CookieConsent = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>("pending");
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check stored consent on mount
    const storedConsent = localStorage.getItem("cookie-consent");
    if (storedConsent === "accepted") {
      setConsentStatus("accepted");
      loadGoogleAnalytics();
    } else if (storedConsent === "declined") {
      setConsentStatus("declined");
    } else {
      // No stored preference - show banner after short delay
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const loadGoogleAnalytics = () => {
    // Check if already loaded
    if (document.getElementById("ga-script")) return;

    // Load gtag.js
    const script = document.createElement("script");
    script.id = "ga-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      cookie_flags: "SameSite=None;Secure",
    });

    // Make gtag available globally
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
  };

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setConsentStatus("accepted");
    setShowBanner(false);
    setShowSettings(false);
    loadGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setConsentStatus("declined");
    setShowBanner(false);
    setShowSettings(false);
    
    // Remove GA cookies if they exist
    document.cookie.split(";").forEach((c) => {
      if (c.trim().startsWith("_ga")) {
        document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    });
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
    setShowBanner(true);
  };

  // Settings button (always visible in footer area when banner is hidden)
  const SettingsButton = () => (
    <button
      onClick={handleOpenSettings}
      className="fixed bottom-4 left-4 z-40 p-2 bg-secondary/80 backdrop-blur-sm border border-border/50 rounded-full hover:bg-secondary hover:border-primary/30 transition-all duration-300 group"
      aria-label="Cookie settings"
      title="Cookie settings"
    >
      <Cookie className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );

  if (!showBanner && consentStatus !== "pending") {
    return <SettingsButton />;
  }

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
        onClick={() => !showSettings && setShowBanner(false)}
      />
      
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-fade-up">
        <div className="max-w-4xl mx-auto bg-card border border-border/50 rounded-2xl shadow-2xl shadow-primary/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {showSettings ? "Cookie Settings" : "We value your privacy"}
              </h3>
            </div>
            <button
              onClick={() => {
                setShowBanner(false);
                setShowSettings(false);
              }}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {showSettings ? (
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Manage your cookie preferences. You can change these settings at any time.
                </p>
                
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Essential Cookies</p>
                    <p className="text-sm text-muted-foreground">Required for the website to function properly.</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    Always Active
                  </span>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/30">
                  <div>
                    <p className="font-medium text-foreground">Analytics Cookies</p>
                    <p className="text-sm text-muted-foreground">Help us understand how visitors interact with our website.</p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    consentStatus === "accepted" 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground bg-secondary"
                  }`}>
                    {consentStatus === "accepted" ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                We use cookies to analyze site traffic and optimize your experience. 
                By clicking "Accept", you consent to our use of cookies. 
                Read our{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>{" "}
                for more information.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 sm:p-6 pt-0">
            {!showSettings && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="order-3 sm:order-1 text-muted-foreground hover:text-foreground"
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
            )}
            <div className="flex-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="order-2"
            >
              Decline
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={handleAccept}
              className="order-1 sm:order-3"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;

// Extend window type for dataLayer
declare global {
  interface Window {
    dataLayer: unknown[];
  }
}
