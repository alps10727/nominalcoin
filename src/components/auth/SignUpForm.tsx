
import { useState, useEffect } from "react";
import EmailInput from "./inputs/EmailInput";
import NameInput from "./inputs/NameInput";
import TermsAgreement from "./terms/TermsAgreement";
import SignUpButton from "./buttons/SignUpButton";
import { validateSignUpForm, FormValues } from "@/utils/formValidation";
import { debugLog } from "@/utils/debugUtils";
import FormErrorDisplay from "./form-sections/FormErrorDisplay";
import PasswordInputGroup from "./form-sections/PasswordInputGroup";
import { checkReferralCode } from "@/utils/referralUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle } from "lucide-react";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SignUpForm = ({ onSubmit, loading, error }: SignUpFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [checkingCode, setCheckingCode] = useState(false);
  
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

  // Validate referral code when input changes
  useEffect(() => {
    // Skip validation if code is empty or too short
    if (!referralCode || referralCode.length < 6) {
      setReferralValid(null);
      return;
    }

    const validateReferralCode = async () => {
      setCheckingCode(true);
      try {
        const { valid } = await checkReferralCode(referralCode);
        setReferralValid(valid);
      } catch (err) {
        debugLog("SignUpForm", "Error validating referral code:", err);
        setReferralValid(false);
      } finally {
        setCheckingCode(false);
      }
    };

    // Debounce validation to avoid too many requests
    const timer = setTimeout(() => {
      validateReferralCode();
    }, 500);

    return () => clearTimeout(timer);
  }, [referralCode]);

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
      // Only pass valid referral codes
      const finalReferralCode = referralValid === true ? referralCode : undefined;
      await onSubmit(name, email, password, finalReferralCode);
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
      
      {/* Referral Code Input */}
      <div className="space-y-1">
        <Label htmlFor="referralCode" className="text-sm font-medium">
          Referans Kodu (Opsiyonel)
        </Label>
        <div className="relative">
          <Input
            id="referralCode"
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
            className="pr-10"
            placeholder="Örn: ABC123"
            maxLength={6}
            disabled={loading || isOffline}
          />
          {referralCode && referralCode.length >= 6 && !checkingCode && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {referralValid ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {referralValid === true && (
          <p className="text-xs text-green-500 mt-1">Geçerli referans kodu</p>
        )}
        {referralValid === false && referralCode.length >= 6 && (
          <p className="text-xs text-red-500 mt-1">Geçersiz veya kullanılmış referans kodu</p>
        )}
      </div>
      
      <TermsAgreement 
        checked={agreeTerms}
        onCheckedChange={setAgreeTerms}
        disabled={loading || isOffline}
      />
      
      <SignUpButton 
        loading={loading || checkingCode} 
        isOffline={isOffline} 
      />
    </form>
  );
};

export default SignUpForm;
