import { useState } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { findUsersByReferralCode } from "@/services/referralService";
import { rewardDirectReferrer } from "@/services/multiLevelReferralService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { prepareReferralCodeForStorage, standardizeReferralCode } from "@/utils/referralUtils";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignUp = async (name: string, email: string, password: string, referralCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check referral code (if any)
      let referrerId: string | null = null;
      
      if (referralCode && referralCode.trim() !== '') {
        try {
          // Standardize the referral code (remove spaces, convert to uppercase, remove dashes)
          const storageCode = prepareReferralCodeForStorage(referralCode);
          
          debugLog("SignUp", "Standardized referral code:", { 
            original: referralCode,
            standardized: storageCode
          });
          
          // Search with standardized code regardless of upper/lower case
          const referrerIds = await findUsersByReferralCode(storageCode);
          
          if (referrerIds.length > 0) {
            referrerId = referrerIds[0];
            debugLog("SignUp", "Found user with referral code:", referrerId);
          } else {
            toast.error("Geçersiz referans kodu. Kayıt işlemi referans olmadan devam edecek.");
            debugLog("SignUp", "Invalid referral code. No match found:", storageCode);
          }
        } catch (err) {
          errorLog("SignUp", "Error checking referral code:", err);
          toast.error("Referans kodu kontrolünde bir hata oluştu.");
        }
      }

      // Register user
      const userCredential = await registerUser(email, password, {
        name,
        emailAddress: email,
        referredBy: referrerId,
      });

      // If there's a referral, reward the direct referrer
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
