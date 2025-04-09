
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

// Admin erişim kontrol bileşeni
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Admin yetkisi kontrol ediliyor..." />;
  }
  
  // Admin yetkisi olmayan kullanıcıları ana sayfaya yönlendir
  if (!currentUser || !userData?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  // Admin kullanıcılar için içeriği göster
  return <>{children}</>;
};

export default AdminRoute;
