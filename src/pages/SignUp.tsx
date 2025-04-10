
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import SignUpForm from "@/components/auth/SignUpForm";
import FormHeader from "@/components/auth/FormHeader";
import FormFooter from "@/components/auth/FormFooter";
import { generateReferralCode, standardizeReferralCode } from "@/utils/referralUtils";
import { debugLog, errorLog } from "@/utils/debugUtils";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();
  
  // Kayıt işlemi uzun sürdüğünde kurtarma mekanizması
  useEffect(() => {
    console.log("SignUp component mounted");
    
    // Eğer kayıt işlemi başlayıp 15 saniyeden fazla sürerse, otomatik olarak form sıfırlanır
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("Kayıt zaman aşımına uğradı, durum sıfırlanıyor");
        setLoading(false);
        setError("İşlem zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        toast.error("Kayıt işlemi zaman aşımına uğradı. Lütfen tekrar deneyin.");
      }
    }, 15000); // 15 saniye
    
    return () => {
      clearTimeout(timeoutId);
      console.log("SignUp component unmounted");
    };
  }, [loading]);

  const handleSignUp = async (name: string, email: string, password: string, referralCode: string) => {
    // Formu sıfırla
    setError(null);
    setLoading(true);
    
    try {
      debugLog("SignUp", "Kayıt işlemi başlıyor...", { email, hasReferral: !!referralCode });
      
      // Kullanıcı için benzersiz bir referans kodu oluştur
      // Not: Gerçek kullanıcı ID'si henüz mevcut değil, bu yüzden timestamp kullanıyoruz
      const timestamp = Date.now().toString();
      const newReferralCode = generateReferralCode(timestamp);
      
      // Standartlaştırılmış referans kodunu kullan
      const processedReferralCode = standardizeReferralCode(referralCode);
      
      debugLog("SignUp", "Referans bilgileri:", { 
        newUserReferralCode: newReferralCode, 
        referredByCode: processedReferralCode || "Yok" 
      });
      
      // Kullanıcı bilgilerine referans verilerini ekleyerek kayıt işlemini başlat
      const success = await register(email, password, {
        name,
        referralCode: newReferralCode, // Kullanıcının kendi referans kodu
        referredBy: processedReferralCode || null, // Kullanıcıyı davet eden kişinin referans kodu
        referrals: [], // Kullanıcının davet ettiği kişilerin listesi (boş başlar)
        referralCount: 0, // Kullanıcının kaç kişiyi davet ettiği (sıfır başlar)
      });
      
      if (success) {
        debugLog("SignUp", "Kayıt başarılı, yönlendiriliyor...");
        toast.success("Hesabınız başarıyla oluşturuldu! Giriş yapabilirsiniz.");
        navigate("/sign-in");
      } else {
        debugLog("SignUp", "Kayıt başarısız oldu");
        setError("Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      errorLog("SignUp", "Kayıt hatası:", error);
      const errorMessage = (error as Error).message;
      
      setError(errorMessage);
    } finally {
      // Her durumda yükleme durumunu kapat
      setLoading(false);
    }
  };

  // Ana sayfa yüklenirken ekranı göster
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-none shadow-lg">
          <FormHeader 
            title="Hesap Oluştur" 
            description="Hesabınızı oluşturmak için bilgilerinizi girin" 
          />
          <CardContent>
            <SignUpForm
              onSubmit={handleSignUp}
              loading={loading}
              error={error}
            />
          </CardContent>
          <FormFooter
            text="Zaten hesabınız var mı?"
            linkText="Giriş yap"
            linkPath="/sign-in"
          />
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
