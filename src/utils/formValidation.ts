
import { toast } from "sonner";
import { standardizeReferralCode, validateReferralCode } from "@/utils/referralUtils";

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

  // Referans kodu kontrolü
  const processedReferralCode = standardizeReferralCode(values.referralCode);
  
  // Referans kodu girilmiş ama geçerli değilse uyarı ver
  if (processedReferralCode && !validateReferralCode(processedReferralCode)) {
    toast.error("Geçersiz referans kodu formatı. Doğru format: XXX-XXX-XXX");
    return "Geçersiz referans kodu formatı. Doğru format: XXX-XXX-XXX";
  }

  return null;
};
