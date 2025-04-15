
export interface FormValues {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
  referralCode?: string;
}

export const validateSignUpForm = (values: FormValues): string | null => {
  if (!values.name || values.name.trim() === "") {
    return "İsim alanı boş bırakılamaz";
  }
  
  if (!values.email || values.email.trim() === "") {
    return "Email alanı boş bırakılamaz";
  }
  
  if (!values.password || values.password.trim() === "") {
    return "Şifre alanı boş bırakılamaz";
  }
  
  if (values.password.length < 6) {
    return "Şifre en az 6 karakter olmalıdır";
  }
  
  if (values.password !== values.confirmPassword) {
    return "Şifreler eşleşmiyor";
  }
  
  if (!values.agreeTerms) {
    return "Kullanım şartlarını kabul etmelisiniz";
  }
  
  // Referral code validation (if provided)
  if (values.referralCode && values.referralCode.length > 0) {
    if (values.referralCode.length !== 6) {
      return "Referans kodu 6 karakter olmalıdır";
    }
    
    // Check if referral code is alphanumeric
    if (!/^[A-Z0-9]+$/.test(values.referralCode)) {
      return "Referans kodu sadece büyük harf ve rakam içerebilir";
    }
  }
  
  return null;
};

export const validateSignInForm = (values: FormValues): string | null => {
  if (!values.email || values.email.trim() === "") {
    return "Email alanı boş bırakılamaz";
  }
  
  if (!values.password || values.password.trim() === "") {
    return "Şifre alanı boş bırakılamaz";
  }
  
  return null;
};
