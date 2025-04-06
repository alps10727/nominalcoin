
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "../dashboard/LoadingScreen";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Sayfa geçişlerinde kısa bir yükleme göster
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Çok kısa bir yükleme süresi
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (isLoading) {
    return <LoadingScreen message="Sayfa hazırlanıyor..." />;
  }
  
  return <>{children}</>;
};

export default PageTransition;
