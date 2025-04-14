
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

  // Android geri tuşunu yönet
  useEffect(() => {
    const handleBackButton = () => {
      // Kayıt sayfasında geri tuşunu engelle
      return false;
    };

    // Capacitor App plugin ile geri tuşu olayını dinle
    App.addListener('backButton', handleBackButton);

    // Bileşen temizlendiğinde dinleyiciyi kaldır
    return () => {
      App.removeAllListeners();
    };
  }, []);

  const handleSignUp = async (name: string, email: string, password: string, referralCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let referrerId: string | null = null;
      
      // Referans kodu varsa doğrula (artık tamamen opsiyonel)
      if (referralCode && referralCode.trim() !== '') {
        try {
          // Standardize the referral code (remove spaces, convert to uppercase, remove dashes)
          const storageCode = prepareReferralCodeForStorage(referralCode);
          
          debugLog("SignUp", "Checking referral code:", { 
            original: referralCode,
            standardized: storageCode
          });
          
          // Search with standardized code regardless of upper/lower case
          const referrerIds = await findUsersByReferralCode(storageCode);
          
          if (referrerIds.length > 0) {
            referrerId = referrerIds[0];
            debugLog("SignUp", "Found user with referral code:", referrerId);
          } else {
            // Referans kodu bulunamazsa ARTIK hata vermiyoruz, sadece uyarı gösteriyoruz
            toast.warning("Girdiğiniz referans kodu bulunamadı. Kayıt işlemi referans kodunsuz devam ediyor.");
          }
        } catch (err) {
          // Referans kodu kontrolünde hata olsa bile kayıt işlemine devam ediyoruz
          errorLog("SignUp", "Error checking referral code:", err);
          toast.warning("Referans kodu kontrolünde bir hata oluştu. Kayıt işlemi referans kodunsuz devam ediyor.");
        }
      }

      // Kullanıcıyı kaydet - referans kodu opsiyonel
      const userCredential = await registerUser(email, password, {
        name,
        emailAddress: email,
        referredBy: referrerId,
      });

      // Eğer referans varsa, direk referansı ödüllendir
      if (referrerId && userCredential?.uid) {
        try {
          await rewardDirectReferrer(userCredential.uid);
          debugLog("SignUp", "Direct referral reward given");
        } catch (refError) {
          errorLog("SignUp", "Error with referral rewards:", refError);
        }
      }

      // Kayıt başarılı, ana sayfaya yönlendir
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
