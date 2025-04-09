
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineLogin } from "@/hooks/auth/useOfflineLogin";
import { useAdminRedirect } from "@/hooks/auth/useAdminRedirect";
import { useSignInTimeout } from "@/hooks/auth/useSignInTimeout";
import SignInCard from "./SignInCard";
import { isAdminCredentials } from "@/config/adminConfig";
import { toast } from "sonner";

const SignInContainer = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // AuthContext'i try-catch ile kullan, eğer henüz yüklenmemişse basitleştirilmiş UI göster
  const auth = (() => {
    try {
      return useAuth();
    } catch (err) {
      console.error("Auth context henüz hazır değil:", err);
      return {
        currentUser: null,
        loading: true,
        login: async () => false,
        isOffline: false,
        dataSource: null
      };
    }
  })();
  
  const { isOffline } = auth;
  const { offlineLoginAttempted, attemptOfflineLogin } = useOfflineLogin();
  
  // Admin yönlendirmesi için hook kullan
  useAdminRedirect();
  
  // Çevrimdışı giriş denemesi
  const handleOfflineLogin = async (email?: string): Promise<boolean> => {
    if (!email) return false;
    return attemptOfflineLogin(email);
  };
  
  // Zaman aşımı hook'u kullan
  useSignInTimeout(loading, offlineLoginAttempted, () => handleOfflineLogin(""));

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    
    try {
      console.log("Giriş işlemi başlatılıyor:", email);
      
      // Admin credentials check - direct login without Firebase
      if (isAdminCredentials(email, password)) {
        console.log("Admin girişi başarılı - Firebase atlanıyor");
        
        // Set admin session and redirect
        localStorage.setItem('isAdminSession', 'true');
        toast.success("Admin girişi başarılı!");
        setLoading(false);
        
        // Kısa bir gecikme ekleyerek yönlendirme sorununu çözüyoruz
        setTimeout(() => {
          console.log("Admin paneline yönlendiriliyor...");
          navigate("/admin", { replace: true });
        }, 100);
        
        return true;
      }
      
      // Normal login with Firebase
      const success = await auth.login(email, password);
      setLoading(false);
      
      if (!success) {
        // Try offline login if regular login fails
        const offlineSuccess = await handleOfflineLogin(email);
        if (!offlineSuccess) {
          setError("Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.");
        }
        return offlineSuccess;
      }
      
      return success;
    } catch (error) {
      console.error("Giriş hatası:", error);
      const errorMessage = (error as Error).message;
      setLoading(false);
      
      // Network error handling
      if (errorMessage.includes("timeout") || errorMessage.includes("network") || 
          errorMessage.includes("auth/network-request-failed")) {
        const offlineSuccess = await handleOfflineLogin(email);
        if (!offlineSuccess) {
          setError("Bağlantı sorunu. İnternet bağlantınızı kontrol edin ve yeniden deneyin.");
        }
        return offlineSuccess;
      } else {
        setError("Giriş yapılamadı: " + errorMessage);
        return false;
      }
    }
  };

  return (
    <SignInCard 
      onSubmit={handleSignIn}
      error={error}
      loading={loading}
      isOffline={isOffline}
    />
  );
};

export default SignInContainer;
