
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";
import { errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// Global hata yakalayıcı
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      errorLog("ErrorBoundary", "Kritik hata yakalandı:", event.error);
      toast.error("Bir hata oluştu. Lütfen sayfayı yenileyin.");
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000); // Daha hızlı yenileme
      return () => clearTimeout(timer);
    }
  }, [hasError, navigate]);

  if (hasError) {
    return <LoadingScreen message="Bir hata oluştu, sayfa yeniden yükleniyor..." />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
