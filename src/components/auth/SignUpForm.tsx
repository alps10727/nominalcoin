
import { Form } from "@/components/ui/form";
import FormErrorDisplay from "./form-sections/FormErrorDisplay";
import SignUpButton from "./buttons/SignUpButton";
import SignUpFormFields from "./form-sections/SignUpFormFields";
import { useSignUpForm } from "@/hooks/auth/useSignUpForm";

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
  const {
    form,
    formError,
    isOffline,
    isFormValid,
    handleSubmit
  } = useSignUpForm({ onSubmit, initialReferralCode });
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormFields
          control={form.control}
          loading={loading}
          initialReferralCode={initialReferralCode}
          watch={form.watch}
          setValue={form.setValue}
        />
        
        <FormErrorDisplay 
          error={error} 
          formError={formError}
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
