
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, User, AlertCircle, Users, WifiOff } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { standardizeReferralCode, validateReferralCode } from "@/utils/referralUtils";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SignUpForm = ({ onSubmit, loading, error }: SignUpFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // URL'den referans kodunu al (varsa)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      const standardizedCode = standardizeReferralCode(refCode);
      console.log("URL'den referans kodu alındı:", standardizedCode);
      setReferralCode(standardizedCode);
    }
    
    // Çevrimdışı durumu izle
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Referans kodunu düzgünce formatla
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReferralCode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Çevrimdışı durumda kayıt yapılamaz
    if (isOffline) {
      toast.error("İnternet bağlantınız yok. Kayıt olmak için internet bağlantınızı kontrol edin.");
      return;
    }
    
    // Formu doğrula
    setFormError(null);
    
    if (password !== confirmPassword) {
      setFormError("Şifreler eşleşmiyor, lütfen kontrol edin.");
      toast.error("Şifreler eşleşmiyor, lütfen kontrol edin.");
      return;
    }

    if (!agreeTerms) {
      setFormError("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
      toast.error("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
      return;
    }
    
    if (password.length < 6) {
      setFormError("Şifre en az 6 karakter olmalıdır.");
      toast.error("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    // Referans kodu kontrolü
    const processedReferralCode = standardizeReferralCode(referralCode);
    console.log("Gönderilecek referans kodu:", processedReferralCode);
    
    // Referans kodu girilmiş ama geçerli değilse uyarı ver
    if (processedReferralCode && !validateReferralCode(processedReferralCode)) {
      setFormError("Geçersiz referans kodu formatı. Doğru format: XXX-XXX-XXX");
      toast.error("Geçersiz referans kodu formatı. Doğru format: XXX-XXX-XXX");
      return;
    }

    // Kayıt işlemini başlat
    try {
      await onSubmit(name, email, password, processedReferralCode);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || formError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span className="text-sm">{error || formError}</span>
        </div>
      )}
      
      {isOffline && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-md flex items-start">
          <WifiOff className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
          <span className="text-sm">İnternet bağlantınız yok. Kayıt olmak için internet bağlantınızı kontrol edin.</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Ad Soyad</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Adınızı ve soyadınızı girin"
            className="pl-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading || isOffline}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Email adresinizi girin"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || isOffline}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referans Kodu (Opsiyonel)</Label>
        <div className="relative">
          <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="referralCode"
            type="text"
            placeholder="Referans kodunuz varsa girin"
            className="pl-10"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            disabled={loading || isOffline}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Şifre oluşturun"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading || isOffline}
            minLength={6}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Şifrenizi tekrar girin"
            className="pl-10"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading || isOffline}
            minLength={6}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={(checked) => {
            setAgreeTerms(checked as boolean);
          }}
          disabled={loading || isOffline}
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <Link to="/terms" className="text-primary hover:underline">
            Kullanım şartlarını
          </Link>{" "}
          ve{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            gizlilik politikasını
          </Link>{" "}
          kabul ediyorum
        </label>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading || isOffline}>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full mr-2" />
            Hesap oluşturuluyor...
          </div>
        ) : isOffline ? (
          <div className="flex items-center justify-center">
            <WifiOff className="h-4 w-4 mr-2" />
            Çevrimdışı
          </div>
        ) : (
          "Kayıt Ol"
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
