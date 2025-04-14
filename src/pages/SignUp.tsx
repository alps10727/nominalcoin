
import { useState, useEffect } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { findUsersByReferralCode } from "@/services/referralService";
import { rewardDirectReferrer } from "@/services/multiLevelReferralService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { prepareReferralCodeForStorage } from "@/utils/referralUtils";
import { App } from '@capacitor/app';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleSignUp = async (name: string, email: string, password: string, referralCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let referrerId: string | null = null;
      
      // Validate referral code if provided (completely optional)
      if (referralCode && referralCode.trim() !== '') {
        try {
          // Standardize the referral code
          const storageCode = prepareReferralCodeForStorage(referralCode);
          
          debugLog("SignUp", "Checking referral code:", { 
            original: referralCode,
            standardized: storageCode
          });
          
          // Check referral code format (3 letters + 3 digits)
          if (!/^[A-Z]{3}\d{3}$/.test(storageCode)) {
            toast.warning("Geçersiz referans kodu formatı. Doğru format: ABC123 (3 harf + 3 rakam)");
            setLoading(false);
            return; // Prevent registration with invalid code format
          }
          
          // Search for the referrer
          const referrerIds = await findUsersByReferralCode(storageCode);
          
          if (referrerIds.length > 0) {
            referrerId = referrerIds[0];
            debugLog("SignUp", "Found user with referral code:", referrerId);
          } else {
            // Code not found, show warning but continue with registration
            toast.warning("Girdiğiniz referans kodu bulunamadı. Kayıt işlemi referans kodunsuz devam ediyor.");
          }
        } catch (err) {
          // Error checking referral code, continue with registration
          errorLog("SignUp", "Error checking referral code:", err);
          toast.warning("Referans kodu kontrolünde bir hata oluştu. Kayıt işlemi referans kodunsuz devam ediyor.");
        }
      }

      // Register the user - referral code is optional
      const userCredential = await registerUser(email, password, {
        name,
        emailAddress: email,
        referredBy: referrerId,
      });

      // Reward the direct referrer if there is one
      if (referrerId && userCredential?.uid) {
        try {
          await rewardDirectReferrer(userCredential.uid);
          debugLog("SignUp", "Direct referral reward given");
        } catch (refError) {
          errorLog("SignUp", "Error with referral rewards:", refError);
        }
      }

      // Registration successful, redirect to home page
      toast.success("Hesabınız başarıyla oluşturuldu!");
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
        </CardHeader>
        <CardContent>
          <SignUpForm onSubmit={handleSignUp} loading={loading} error={error} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
