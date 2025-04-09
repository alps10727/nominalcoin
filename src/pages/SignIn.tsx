import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import SignInForm from "@/components/auth/SignInForm";
import { useOfflineLogin } from "@/hooks/auth/useOfflineLogin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const SignIn = () => {
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
  
  const { currentUser, loading: authLoading, isOffline } = auth;
  const { offlineLoginAttempted, attemptOfflineLogin } = useOfflineLogin();
  
  // Eğer kullanıcı zaten giriş yapmışsa, kullanıcının admin olup olmadığını kontrol et
  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (currentUser && !authLoading) {
        try {
          // Kullanıcının admin olup olmadığını kontrol et
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists() && userDoc.data()?.isAdmin === true) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Admin durumu kontrol edilirken hata:", error);
          navigate("/");
        }
      }
    };
    
    checkUserAndRedirect();
  }, [currentUser, authLoading, navigate]);
  
  // Giriş işlemi uzun sürdüğünde kurtarma mekanizması
  useEffect(() => {
    console.log("SignIn component mounted");
    
    // Eğer giriş işlemi başlayıp 10 saniyeden fazla sürerse, otomatik olarak çevrimdışı modu dene
    const timeoutId = setTimeout(() => {
      if (loading && !offlineLoginAttempted) {
        console.log("Giriş zaman aşımına uğradı, çevrimdışı mod deneniyor");
        handleOfflineLogin();
      }
    }, 10000); // 10 saniye
    
    return () => {
      clearTimeout(timeoutId);
      console.log("SignIn component unmounted");
    };
  }, [loading, offlineLoginAttempted]);

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    
    try {
      console.log("Giriş işlemi başlatılıyor:", email);
      const success = await auth.login(email, password);
      
      if (!success) {
        // Eğer normal giriş başarısız olursa, çevrimdışı girişi dene
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
      
      // Network hatası durumunda çevrimdışı girişi dene
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
    } finally {
      setLoading(false);
    }
  };
  
  // Çevrimdışı giriş denemesi
  const handleOfflineLogin = async (email?: string): Promise<boolean> => {
    if (!email) return false;
    return attemptOfflineLogin(email);
  };
  
  // Ana sayfa yüklenirken ekranı göster
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Tekrar Hoşgeldiniz</CardTitle>
            <CardDescription>
              Devam etmek için hesabınıza giriş yapın
            </CardDescription>
            
            {isOffline && (
              <div className="mt-2 flex items-center justify-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full">
                <WifiOff className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs font-medium">Çevrimdışı mod aktif</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <SignInForm 
              onSubmit={handleSignIn}
              error={error}
              loading={loading}
              isOffline={isOffline}
            />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Hesabınız yok mu?{" "}
              <Link to="/sign-up" className="text-primary hover:underline">
                Kayıt ol
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
