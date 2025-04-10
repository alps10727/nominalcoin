
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { standardizeReferralCode, validateReferralCode } from "@/utils/referralUtils";

interface UseSignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode: string) => Promise<void>;
  loading: boolean;
}

interface UseSignUpFormReturn {
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  referralCode: string;
  setReferralCode: (value: string) => void;
  agreeTerms: boolean;
  setAgreeTerms: (value: boolean) => void;
  formError: string | null;
  isOffline: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useSignUpForm = ({ onSubmit, loading }: UseSignUpFormProps): UseSignUpFormReturn => {
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

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    referralCode,
    setReferralCode,
    agreeTerms,
    setAgreeTerms,
    formError,
    isOffline,
    handleSubmit
  };
};
