
import { useState } from "react";
import SignUpForm from "../components/auth/SignUpForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "@/services/authService";
import { findUsersByReferralCode } from "@/services/referralService";
import { rewardMultiLevelReferrers } from "@/services/multiLevelReferralService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignUp = async (name: string, email: string, password: string, referralCode: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Referans kodunu kontrol et (varsa)
      let referrerId: string | null = null;
      
      if (referralCode) {
        try {
          const referrerIds = await findUsersByReferralCode(referralCode);
          if (referrerIds.length > 0) {
            referrerId = referrerIds[0];
            debugLog("SignUp", "Referans kodu ile kullanıcı bulundu:", referrerId);
          } else {
            toast.error("Geçersiz referans kodu. Kayıt işlemi referans olmadan devam edecek.");
          }
        } catch (err) {
          errorLog("SignUp", "Referans kodu kontrolünde hata:", err);
        }
      }

      // Kullanıcıyı kaydet
      const userData = await registerUser(email, password, {
        name,
        emailAddress: email,
        referredBy: referrerId,
      });

      // Referans varsa, hem doğrudan hem de üst seviye referanslara ödül ver
      if (referrerId && userData?.user?.uid) {
        try {
          // Yeni çok seviyeli referans sistemini kullan
          await rewardMultiLevelReferrers(userData.user.uid, referrerId);
          debugLog("SignUp", "Çok seviyeli referans ödülleri verildi");
        } catch (refError) {
          errorLog("SignUp", "Referans ödüllerinde hata:", refError);
        }
      }

      // Kayıt başarılı, ana sayfaya yönlendir
      toast.success("Hesabınız başarıyla oluşturuldu!");
      navigate("/");
    } catch (error: any) {
      setError(error.message);
      errorLog("SignUp", "Kayıt hatası:", error);
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
