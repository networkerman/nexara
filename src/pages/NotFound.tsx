import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          The page <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code> does not exist.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link 
            to="/engage/campaigns" 
            className="rounded-2xl bg-primary px-5 py-2 text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Go to Campaigns
          </Link>
          <Link 
            to="/" 
            className="rounded-2xl border border-border px-4 py-2 text-foreground hover:bg-muted transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
