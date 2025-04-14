
import { useState, useEffect } from "react";
import EmailInput from "./inputs/EmailInput";
import NameInput from "./inputs/NameInput";
import TermsAgreement from "./terms/TermsAgreement";
import SignUpButton from "./buttons/SignUpButton";
import { validateSignUpForm, FormValues } from "@/utils/formValidation";
import { debugLog } from "@/utils/debugUtils";
import FormErrorDisplay from "./form-sections/FormErrorDisplay";
import PasswordInputGroup from "./form-sections/PasswordInputGroup";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
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
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
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
    
    if (isOffline) return;
    
    setFormError(null);
    
    const formValues: FormValues = {
      name,
      email,
      password,
      confirmPassword,
      agreeTerms
    };
    
    const validationError = validateSignUpForm(formValues);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      await onSubmit(name, email, password);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormErrorDisplay 
        error={error}
        formError={formError}
        isOffline={isOffline}
      />
      
      <NameInput 
        value={name} 
        onChange={setName}
        disabled={loading || isOffline}
      />
      
      <EmailInput 
        value={email} 
        onChange={setEmail}
        disabled={loading || isOffline}
      />
      
      <PasswordInputGroup
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        disabled={loading || isOffline}
      />
      
      <TermsAgreement 
        checked={agreeTerms}
        onCheckedChange={setAgreeTerms}
        disabled={loading || isOffline}
      />
      
      <SignUpButton 
        loading={loading} 
        isOffline={isOffline} 
      />
    </form>
  );
};

export default SignUpForm;
