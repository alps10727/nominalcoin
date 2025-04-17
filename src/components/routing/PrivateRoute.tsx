
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

// PrivateRoute - hızlandırıldı
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [waitingTooLong, setWaitingTooLong] = useState(false);
  
  // Sadece yükleme durumunda zamanlayıcıyı başlat - süre kısaltıldı
  useEffect(() => {
    if (!loading) return;
    
    const timer = setTimeout(() => {
      setWaitingTooLong(true);
    }, 800); // 1500ms'den 800ms'ye düşürüldü
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Yükleme durumu değiştiğinde otomatik yönlendirme - süre kısaltıldı
  useEffect(() => {
    if (!loading || !waitingTooLong) return;
    
    const redirectTimer = setTimeout(() => {
      window.location.href = "/sign-in";
    }, 2000); // 4000ms'den 2000ms'ye düşürüldü
    
    return () => clearTimeout(redirectTimer);
  }, [loading, waitingTooLong]);
  
  if (loading) {
    return <LoadingScreen message={waitingTooLong ? "Kullanıcı bilgileri yüklenemiyor. Lütfen internet bağlantınızı kontrol edin..." : "Kullanıcı bilgileri yükleniyor..."} />;
  }
  
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

export default PrivateRoute;
