
export interface FormValues {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: boolean;
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
