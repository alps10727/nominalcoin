
import { useState } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();
  const { register } = useSupabaseAuth();

  // Monitor network status
  useState(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      debugLog("SignUp", "Starting registration", { name, email });
      
      if (isOffline) {
        setError("İnternet bağlantınız olmadan kayıt olamazsınız");
        return;
      }
      
      // Register the user with Supabase
      const success = await register(email, password, {
        name,
        emailAddress: email
      });

      if (success) {
        // Registration successful, redirect to home page
        toast.success("Hesabınız başarıyla oluşturuldu!");
        navigate("/");
      } else {
        setError("Kayıt işlemi başarısız oldu");
      }
    } catch (error: any) {
      setError(error.message);
      errorLog("SignUp", "Registration error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy-950 to-blue-950">
      <Card className="w-full max-w-lg shadow-xl border-none bg-gradient-to-br from-navy-900/90 to-navy-950/90 backdrop-blur-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-white">Hesap Oluştur</CardTitle>
          <CardDescription className="text-gray-300">
            Yeni bir hesap oluşturarak Coin kazanmaya başlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm 
            onSubmit={handleSignUp} 
            loading={loading}
            isOffline={isOffline} 
            error={error}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
