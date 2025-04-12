
import { useState, useEffect } from "react";
import { standardizeReferralCode } from "@/utils/referralUtils";
import EmailInput from "./inputs/EmailInput";
import NameInput from "./inputs/NameInput";
import ReferralCodeInput from "./inputs/ReferralCodeInput";
import PasswordInput from "./inputs/PasswordInput";
import ConfirmPasswordInput from "./inputs/ConfirmPasswordInput";
import TermsAgreement from "./terms/TermsAgreement";
import SignUpButton from "./buttons/SignUpButton";
import ErrorAlert from "./alerts/ErrorAlert";
import OfflineAlert from "./alerts/OfflineAlert";
import { validateSignUpForm, FormValues } from "@/utils/formValidation";
import { debugLog } from "@/utils/debugUtils";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode: string) => Promise<void>;
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
  const [referralCode, setReferralCode] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      const standardizedCode = standardizeReferralCode(refCode);
      setReferralCode(standardizedCode);
      debugLog("SignUpForm", "URL'den referans kodu alındı:", { 
        original: refCode, 
        standardized: standardizedCode 
      });
    }
    
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
      referralCode,
      agreeTerms
    };
    
    const validationError = validateSignUpForm(formValues);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      // Convert to storage format before submitting (standardized with no dashes)
      const processedReferralCode = standardizeReferralCode(referralCode);
      debugLog("SignUpForm", "Form gönderiliyor, referans kodu:", processedReferralCode);
      await onSubmit(name, email, password, processedReferralCode);
    } catch (error) {
      console.error("Form gönderme hatası:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || formError) && (
        <ErrorAlert message={error || formError} />
      )}
      
      {isOffline && <OfflineAlert />}
      
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
      
      <ReferralCodeInput 
        value={referralCode} 
        onChange={setReferralCode}
        disabled={loading || isOffline}
      />
      
      <PasswordInput 
        value={password} 
        onChange={setPassword}
        disabled={loading || isOffline}
      />
      
      <ConfirmPasswordInput 
        value={confirmPassword} 
        onChange={setConfirmPassword}
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
