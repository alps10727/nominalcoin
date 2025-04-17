
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useSupabaseAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Sadece yükleme durumunda zamanlayıcıyı başlat
  useEffect(() => {
    if (!isLoading) return;
    
    const timer = setTimeout(() => {
      setWaitingTooLong(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // Yükleme durumu değiştiğinde otomatik yönlendirme
  useEffect(() => {
    if (!isLoading || !waitingTooLong) return;
    
    const redirectTimer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 2000);
    
    return () => clearTimeout(redirectTimer);
  }, [isLoading, waitingTooLong]);
  
  if (isLoading) {
    return <LoadingScreen message={waitingTooLong ? "Kullanıcı bilgileri yüklenemiyor. Lütfen internet bağlantınızı kontrol edin..." : "Kullanıcı bilgileri yükleniyor..."} />;
  }
  
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
