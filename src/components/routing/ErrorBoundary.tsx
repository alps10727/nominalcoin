
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";
import { errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

// Global error handler
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      errorLog("ErrorBoundary", "Critical error caught:", event.error);
      toast.error(t("errors.refreshRequired") || "An error occurred. Please refresh the page.");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [t]);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000); // Faster reload
      return () => clearTimeout(timer);
    }
  }, [hasError, navigate]);

  if (hasError) {
    return <LoadingScreen message={t("errors.reloading") || "An error occurred, reloading page..."} />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
