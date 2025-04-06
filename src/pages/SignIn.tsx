
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import FormHeader from "@/components/auth/FormHeader";
import FormFooter from "@/components/auth/FormFooter";
import SignInForm from "@/components/auth/SignInForm";
import { useOfflineLogin } from "@/hooks/useOfflineLogin";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Use AuthContext with try-catch in case it's not yet loaded
  const auth = (() => {
    try {
      return useAuth();
    } catch (err) {
      console.error("Auth context not ready yet:", err);
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
  
  // Create hook for offline login functionality
  const { attemptOfflineLogin, offlineLoginAttempted } = useOfflineLogin({ 
    email, 
    loading 
  });
  
  // If user is already logged in, redirect to home
  useEffect(() => {
    if (currentUser && !authLoading) {
      navigate("/");
    }
  }, [currentUser, authLoading, navigate]);

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    setEmail(email); // Store email for potential offline login
    setError(null);
    setLoading(true);
    
    try {
      console.log("Starting login process:", email);
      const success = await auth.login(email, password);
      if (success) {
        navigate("/");
      } else {
        // Try offline login if normal login fails
        const offlineSuccess = await attemptOfflineLogin();
        if (!offlineSuccess) {
          setError("Login failed, please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = (error as Error).message;
      
      // Try offline login for network errors
      if (errorMessage.includes("timeout") || errorMessage.includes("network") || 
          errorMessage.includes("auth/network-request-failed")) {
        const offlineSuccess = await attemptOfflineLogin();
        if (!offlineSuccess) {
          setError("Connection problem. Check your internet connection and try again.");
        }
      } else {
        setError("Login failed: " + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while auth is initializing
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg">
          <FormHeader 
            title="Tekrar Hoşgeldiniz" 
            description="Devam etmek için hesabınıza giriş yapın" 
          />
          
          {isOffline && (
            <div className="flex items-center justify-center text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full mx-auto w-fit my-2">
              <WifiOff className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs font-medium">Çevrimdışı mod aktif</span>
            </div>
          )}
          
          <CardContent>
            <SignInForm 
              onSubmit={handleSignIn} 
              loading={loading} 
              error={error} 
            />
          </CardContent>
          
          <FormFooter
            text="Hesabınız yok mu?"
            linkText="Kayıt ol"
            linkPath="/sign-up"
          />
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
