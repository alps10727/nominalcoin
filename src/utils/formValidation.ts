
import { toast } from "sonner";
import { standardizeReferralCode } from "@/utils/referralUtils";

export interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
  agreeTerms: boolean;
}

export const validateSignUpForm = (values: FormValues): string | null => {
  if (values.password !== values.confirmPassword) {
    toast.error("Şifreler eşleşmiyor, lütfen kontrol edin.");
    return "Şifreler eşleşmiyor, lütfen kontrol edin.";
  }

  if (!values.agreeTerms) {
    toast.error("Devam etmek için kullanım şartlarını kabul etmelisiniz.");
    return "Devam etmek için kullanım şartlarını kabul etmelisiniz.";
  }
  
  if (values.password.length < 6) {
    toast.error("Şifre en az 6 karakter olmalıdır.");
    return "Şifre en az 6 karakter olmalıdır.";
  }

  // Referral code is optional
  const processedReferralCode = standardizeReferralCode(values.referralCode);
  
  // If a referral code is provided, validate its format (3 letters + 3 digits)
  if (processedReferralCode) {
    if (!(/^[A-Z]{3}\d{3}$/.test(processedReferralCode))) {
      toast.error("Geçersiz referans kodu formatı. Doğru format: AAA000 (3 harf + 3 rakam)");
      return "Geçersiz referans kodu formatı. Doğru format: AAA000 (3 harf + 3 rakam)";
    }
  }

  return null;
};
