
import { useSignUpForm } from "@/hooks/useSignUpForm";
import ErrorAlert from "@/components/auth/alerts/ErrorAlert";
import OfflineAlert from "@/components/auth/alerts/OfflineAlert";
import NameInput from "@/components/auth/inputs/NameInput";
import EmailInput from "@/components/auth/inputs/EmailInput";
import ReferralCodeInput from "@/components/auth/inputs/ReferralCodeInput";
import PasswordInputField from "@/components/auth/inputs/PasswordInputField";
import TermsCheckbox from "@/components/auth/inputs/TermsCheckbox";
import SignUpButton from "@/components/auth/buttons/SignUpButton";

interface SignUpFormProps {
  onSubmit: (name: string, email: string, password: string, referralCode: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const SignUpForm = ({ onSubmit, loading, error }: SignUpFormProps) => {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    referralCode,
    setReferralCode,
    agreeTerms,
    setAgreeTerms,
    formError,
    isOffline,
    handleSubmit
  } = useSignUpForm({ onSubmit, loading });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(error || formError) && <ErrorAlert message={error || formError} />}
      
      {isOffline && <OfflineAlert />}
      
      <NameInput 
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading || isOffline}
      />
      
      <EmailInput
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading || isOffline}
      />
      
      <ReferralCodeInput
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
        disabled={loading || isOffline}
      />
      
      <PasswordInputField
        id="password"
        label="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre oluşturun"
        disabled={loading || isOffline}
      />
      
      <PasswordInputField
        id="confirmPassword"
        label="Şifre Tekrar"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Şifrenizi tekrar girin"
        disabled={loading || isOffline}
      />
      
      <TermsCheckbox
        checked={agreeTerms}
        onCheckedChange={setAgreeTerms}
        disabled={loading || isOffline}
      />
      
      <SignUpButton loading={loading} isOffline={isOffline} />
    </form>
  );
};

export default SignUpForm;
