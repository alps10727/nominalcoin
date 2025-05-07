
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormValues } from "@/components/auth/schemas/signUpSchema";
import { validateSignUpForm } from "@/utils/formValidation";
import { toast } from "sonner";
import { useEffect } from "react";

interface UseSignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  initialReferralCode?: string;
}

export const useSignUpForm = ({ onSubmit, initialReferralCode = '' }: UseSignUpFormProps) => {
  const [formError, setFormError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: initialReferralCode || "",
      agreedToTerms: false as any,
    },
    mode: "onChange"
  });
  
  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Bu değişiklik, formun geçerliliğini daha doğru şekilde izlememizi sağlar
  const isFormValid = form.formState.isValid && 
                     !!form.watch("name")?.trim() && 
                     !!form.watch("email")?.trim() && 
                     !!form.watch("password")?.trim() && 
                     form.watch("confirmPassword") === form.watch("password") &&
                     form.watch("agreedToTerms") === true;

  const handleSubmit = async (values: SignUpFormValues) => {
    setFormError(null);
    
    const validationError = validateSignUpForm({
      name: values.name,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      agreeTerms: values.agreedToTerms,
      referralCode: values.referralCode
    });
    
    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      await onSubmit(
        values.name, 
        values.email, 
        values.password, 
        values.referralCode || undefined
      );
    } catch (error: any) {
      console.error("Form submission error:", error);
      setFormError(error.message || "Form gönderim hatası");
    }
  };

  return {
    form,
    formError,
    isOffline,
    isFormValid,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
