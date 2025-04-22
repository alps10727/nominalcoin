
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NameInput from "./inputs/NameInput";
import EmailInput from "./inputs/EmailInput";
import PasswordInputGroup from "./form-sections/PasswordInputGroup";
import FormErrorDisplay from "./form-sections/FormErrorDisplay";
import SignUpButton from "./buttons/SignUpButton";
import TermsAgreement from "./terms/TermsAgreement";
import ReferralCodeInput from "./inputs/ReferralCodeInput";
import { validateSignUpForm } from "@/utils/formValidation";
import { signUpSchema, type SignUpFormValues } from "./schemas/signUpSchema";

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
      agreedToTerms: undefined as any,
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
  
  const isFormValid = form.formState.isValid && 
                     !!form.watch("name")?.trim() && 
                     !!form.watch("email")?.trim() && 
                     !!form.watch("password")?.trim() && 
                     form.watch("confirmPassword") === form.watch("password") &&
                     form.watch("agreedToTerms");
  
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <NameInput 
          value={form.watch("name")} 
          onChange={(value) => form.setValue("name", value, { shouldValidate: true })} 
          disabled={loading}
        />
        
        <EmailInput 
          value={form.watch("email")} 
          onChange={(value) => form.setValue("email", value, { shouldValidate: true })}
          disabled={loading}
        />
        
        <PasswordInputGroup 
          password={form.watch("password")}
          confirmPassword={form.watch("confirmPassword")}
          setPassword={(value) => form.setValue("password", value, { shouldValidate: true })}
          setConfirmPassword={(value) => form.setValue("confirmPassword", value, { shouldValidate: true })}
          disabled={loading}
        />
        
        <ReferralCodeInput
          value={form.watch("referralCode")}
          onChange={(value) => form.setValue("referralCode", value)}
          disabled={loading}
          initialReferralCode={initialReferralCode}
        />
        
        <TermsAgreement 
          checked={form.watch("agreedToTerms") === true} 
          onCheckedChange={(checked) => {
            form.setValue("agreedToTerms", checked ? true : undefined, { shouldValidate: true })
          }}
          disabled={loading}
        />
        
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
