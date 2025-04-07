
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";
import { errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

const ErrorBoundary = ({ children }: ErrorBoundaryProps) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      errorLog("ErrorBoundary", "Critical error caught:", event.error);
      toast.error("An error occurred. Please reload the page.");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000); // Faster reload
      return () => clearTimeout(timer);
    }
  }, [hasError, navigate]);

  if (hasError) {
    return <LoadingScreen message="An error occurred, reloading page..." />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
