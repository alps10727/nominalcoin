import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { registerUser } from "@/services/authService";
import { UserRegistrationData } from "@/services/auth/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NameInput from "./inputs/NameInput";
import EmailInput from "./inputs/EmailInput";
import PasswordInputGroup from "./form-sections/PasswordInputGroup";
import FormErrorDisplay from "./form-sections/FormErrorDisplay";
import SignUpButton from "./buttons/SignUpButton";
import TermsAgreement from "./terms/TermsAgreement";
import { validateSignUpForm } from "@/utils/formValidation";

// SignUp Schema - Daha detaylı validasyon kuralları
const signUpSchema = z.object({
  name: z.string().min(2, {
    message: "Ad alanı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  password: z.string()
    .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, {
      message: "Şifre en az bir harf ve bir rakam içermelidir."
    }),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "Kullanım koşullarını kabul etmelisiniz." }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor.",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  warningMessage?: string | null;
  initialReferralCode?: string;
}

export default function SignUpForm({ 
  onSubmit, 
  loading, 
  error, 
  warningMessage,
  initialReferralCode = '' 
}: SignUpFormProps) {
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    
    // Set initial status
    setIsOffline(!navigator.onLine);
    
    // Add event listeners for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: initialReferralCode || "",
      agreedToTerms: undefined as any,
    },
    mode: "onChange" // Validate on change for better user feedback
  });
  
  const isFormValid = form.formState.isValid && 
                     !!form.watch("name")?.trim() && 
                     !!form.watch("email")?.trim() && 
                     !!form.watch("password")?.trim() && 
                     form.watch("confirmPassword") === form.watch("password") &&
                     form.watch("agreedToTerms");
  
  const handleSubmit = async (values: SignUpFormValues) => {
    setFormError(null);
    
    // Additional validation
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <NameInput 
            value={form.watch("name")} 
            onChange={(value) => form.setValue("name", value, { shouldValidate: true })} 
            disabled={loading}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <EmailInput 
            value={form.watch("email")} 
            onChange={(value) => form.setValue("email", value, { shouldValidate: true })}
            disabled={loading}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <PasswordInputGroup 
          password={form.watch("password")}
          confirmPassword={form.watch("confirmPassword")}
          setPassword={(value) => form.setValue("password", value, { shouldValidate: true })}
          setConfirmPassword={(value) => form.setValue("confirmPassword", value, { shouldValidate: true })}
          disabled={loading}
        />
        
        <div className="space-y-2">
          <label htmlFor="referralCode" className="text-sm font-medium">
            Referans Kodu (İsteğe Bağlı)
          </label>
          <input
            id="referralCode"
            type="text"
            className="w-full p-2 border rounded-md bg-background"
            placeholder="Referans kodu girin"
            value={form.watch("referralCode")}
            onChange={(e) => form.setValue("referralCode", e.target.value)}
            disabled={loading || !!initialReferralCode}
          />
          {initialReferralCode && (
            <p className="text-xs text-blue-500">Referans kodu ile kaydoluyorsunuz</p>
          )}
        </div>
        
        <div className="space-y-2">
          <TermsAgreement 
            checked={form.watch("agreedToTerms") === true} 
            onCheckedChange={(checked) => {
              form.setValue("agreedToTerms", checked ? true : undefined, { shouldValidate: true })
            }}
            disabled={loading}
          />
          {form.formState.errors.agreedToTerms && (
            <p className="text-sm text-destructive">{form.formState.errors.agreedToTerms.message}</p>
          )}
        </div>
        
        <FormErrorDisplay 
          error={error} 
          formError={form.formState.errors.root?.message?.toString() || formError}
          isOffline={isOffline} 
          warningMessage={warningMessage}
        />
        
        <SignUpButton 
          loading={loading} 
          isOffline={isOffline}
          disabled={!isFormValid || loading} 
        />
      </form>
    </Form>
  );
}
