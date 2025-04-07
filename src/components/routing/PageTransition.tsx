
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
    // Show a short loading screen during page transitions
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Very short loading duration
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  if (isLoading) {
    return <LoadingScreen message="Loading page..." />;
  }
  
  return <>{children}</>;
};

export default PageTransition;
