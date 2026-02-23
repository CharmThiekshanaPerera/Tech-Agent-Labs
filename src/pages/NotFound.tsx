import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found | Tech Agent Labs"
        description="The page you're looking for doesn't exist. Return to the Tech Agent Labs homepage."
        noIndex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline underline-offset-4 hover:decoration-primary">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
