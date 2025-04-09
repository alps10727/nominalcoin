
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";
import { isAdminEmail } from "@/config/adminConfig";

// Admin erişim kontrol bileşeni
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen message="Admin yetkisi kontrol ediliyor..." />;
  }
  
  // Admin yetkisi olmayan kullanıcıları ana sayfaya yönlendir
  if (!currentUser) {
    // Özel admin kontrolü - localStorage kontrolü
    const isAdminSession = localStorage.getItem('isAdminSession') === 'true';
    
    if (isAdminSession) {
      return <>{children}</>;
    }
    
    return <Navigate to="/sign-in" />;
  }
  
  // Admin email kontrolü - centralized config
  if (currentUser.email && isAdminEmail(currentUser.email)) {
    // Admin oturumu olduğunu local storage'a kaydet
    localStorage.setItem('isAdminSession', 'true');
    return <>{children}</>;
  }
  
  // Firestore'daki isAdmin özelliğini kontrol et
  if (userData?.isAdmin === true) {
    // Admin oturumu olduğunu local storage'a kaydet
    localStorage.setItem('isAdminSession', 'true');
    return <>{children}</>;
  }
  
  // Admin yetkisi yoksa ana sayfaya yönlendir
  localStorage.removeItem('isAdminSession');
  return <Navigate to="/" />;
};

export default AdminRoute;
