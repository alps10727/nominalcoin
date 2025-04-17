import { useState, useEffect } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { App } from '@capacitor/app';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check URL for referral code
  const [initialReferralCode, setInitialReferralCode] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('ref') || '';
  });

  // Android back button handler
  useEffect(() => {
    const handleBackButton = () => {
      // Prevent back button on registration page
      return false;
    };

    // Listen for back button events with Capacitor App plugin
    App.addListener('backButton', handleBackButton);

    // Remove listeners when component unmounts
    return () => {
      App.removeAllListeners();
    };
  }, []);

  const handleSignUp = async (name: string, email: string, password: string, referralCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      debugLog("SignUp", "Starting registration", { name, email, referralCode });
      
      // Register the user with referral code
      const userCredential = await registerUser(email, password, {
        name,
        emailAddress: email,
        referralCode: referralCode // Pass referral code to registration function
      });

      // Registration successful, redirect to home page
      toast.success("Hesabınız başarıyla oluşturuldu!");
      
      // Show special message for referral code
      if (referralCode) {
        toast.success("Referans kodu başarıyla uygulandı!");
      }
      
      navigate("/");
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
          {initialReferralCode && (
            <div className="mt-2 bg-blue-900/30 text-blue-200 text-sm py-1 px-2 rounded-md">
              Referans kodu ile kaydoluyorsunuz: {initialReferralCode}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SignUpForm 
            onSubmit={handleSignUp} 
            loading={loading} 
            error={error}
            initialReferralCode={initialReferralCode} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
