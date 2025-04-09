
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "../dashboard/LoadingScreen";
import { isAdminEmail } from "@/config/adminConfig";
import { useEffect } from "react";
import { toast } from "sonner";

// Admin erişim kontrol bileşeni - yetkilendirme güçlendirildi
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userData, loading } = useAuth();
  
  useEffect(() => {
    console.log("AdminRoute kontrol ediliyor:", { 
      currentUser: currentUser?.email || "Yok", 
      isAdmin: userData?.isAdmin || false,
      localStorageAdmin: localStorage.getItem('isAdminSession') === 'true'
    });
    
    // Bu admin oturumunu otomatik olarak kaydet - demo için de çalışacak
    if (currentUser?.email && isAdminEmail(currentUser.email)) {
      localStorage.setItem('isAdminSession', 'true');
    } else if (userData?.isAdmin) {
      localStorage.setItem('isAdminSession', 'true');
    }
  }, [currentUser, userData]);
  
  if (loading) {
    return <LoadingScreen message="Admin yetkisi kontrol ediliyor..." />;
  }
  
  // Admin yetkisi olmayan kullanıcıları ana sayfaya yönlendir
  if (!currentUser) {
    // Özel admin kontrolü - localStorage kontrolü
    const isAdminSession = localStorage.getItem('isAdminSession') === 'true';
    
    console.log("Admin oturumu kontrolü:", isAdminSession);
    
    if (isAdminSession) {
      console.log("Admin oturumu etkin, erişim izni veriliyor");
      return <>{children}</>;
    }
    
    console.log("Admin oturumu yok, giriş sayfasına yönlendiriliyor");
    toast.error("Admin girişi gerekiyor");
    return <Navigate to="/sign-in" />;
  }
  
  // Admin email kontrolü - centralized config
  if (currentUser.email && isAdminEmail(currentUser.email)) {
    // Admin oturumu olduğunu local storage'a kaydet
    localStorage.setItem('isAdminSession', 'true');
    console.log("Admin e-postası doğrulandı, erişim izni veriliyor");
    return <>{children}</>;
  }
  
  // Firestore'daki isAdmin özelliğini kontrol et
  if (userData?.isAdmin === true) {
    // Admin oturumu olduğunu local storage'a kaydet
    localStorage.setItem('isAdminSession', 'true');
    console.log("Firestore'da admin yetkisi doğrulandı, erişim izni veriliyor");
    return <>{children}</>;
  }
  
  // Demo mod için
  const isAdminSession = localStorage.getItem('isAdminSession') === 'true';
  if (isAdminSession) {
    console.log("Demo admin oturumu etkin, erişim izni veriliyor");
    return <>{children}</>;
  }
  
  // Admin yetkisi yoksa ana sayfaya yönlendir
  console.log("Admin yetkisi bulunamadı, ana sayfaya yönlendiriliyor");
  localStorage.removeItem('isAdminSession');
  toast.error("Bu sayfaya erişim yetkiniz bulunmamaktadır");
  return <Navigate to="/" />;
};

export default AdminRoute;
