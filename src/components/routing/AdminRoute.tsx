
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";

// Admin e-posta ve şifre bilgisi
const ADMIN_EMAIL = "ncowner0001@gmail.com";

// Admin erişim kontrol bileşeni
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Admin yetkisi kontrol ediliyor..." />;
  }
  
  // Admin yetkisi olmayan kullanıcıları ana sayfaya yönlendir
  if (!currentUser) {
    return <Navigate to="/sign-in" />;
  }
  
  // Özel admin e-posta kontrolü
  if (currentUser.email === ADMIN_EMAIL) {
    return <>{children}</>;
  }
  
  // Firestore'daki isAdmin özelliğini kontrol et
  if (userData?.isAdmin === true) {
    return <>{children}</>;
  }
  
  // Admin yetkisi yoksa ana sayfaya yönlendir
  return <Navigate to="/" />;
};

export default AdminRoute;
