import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Seo from "./components/Seo"; // <-- new SEO component

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Seo
                    title="Tech Agent Labs — AI Agents Marketplace"
                    description="Buy production-ready AI agents or get custom-built automation for your business. Fast deployment — enterprise ready."
                    pathname="/"
                  />
                  <Index />
                </>
              }
            />

            {/* Catch-all / 404 */}
            <Route
              path="*"
              element={
                <>
                  <Seo
                    title="Page Not Found | Tech Agent Labs"
                    description="This page could not be found."
                    pathname="/404"
                  />
                  <NotFound />
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
