
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Only start timer when loading - reduced duration
  useEffect(() => {
    if (!loading) return;
    
    const timer = setTimeout(() => {
      setWaitingTooLong(true);
    }, 800); // Reduced from 1500ms to 800ms
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Auto-redirect when loading changes - reduced duration
  useEffect(() => {
    if (!loading || !waitingTooLong) return;
    
    const redirectTimer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 2000); // Reduced from 4000ms to 2000ms
    
    return () => clearTimeout(redirectTimer);
  }, [loading, waitingTooLong]);
  
  if (loading) {
    return <LoadingScreen message={waitingTooLong ? "Unable to load user data. Please check your internet connection..." : "Loading user data..."} />;
  }
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
