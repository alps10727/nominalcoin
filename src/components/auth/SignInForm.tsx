
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailInput from "./inputs/EmailInput";
import PasswordInput from "./PasswordInput";
import RememberMeCheckbox from "./inputs/RememberMeCheckbox";
import LoginButton from "./buttons/LoginButton";
import ErrorAlert from "./alerts/ErrorAlert";

interface SignInFormProps {
  onSubmit: (email: string, password: string) => Promise<boolean>;
  error: string | null;
  loading: boolean;
  isOffline: boolean;
}

const SignInForm = ({ onSubmit, error, loading, isOffline }: SignInFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(email, password);
    
    if (success) {
      navigate("/");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorAlert message={error || ""} />
      
      <EmailInput 
        value={email}
        onChange={handleEmailChange}
        disabled={loading}
      />
      
      <PasswordInput
        value={password}
        onChange={handlePasswordChange}
        disabled={loading}
      />
      
      <RememberMeCheckbox
        checked={rememberMe}
        onCheckedChange={setRememberMe}
        disabled={loading}
      />
      
      <LoginButton loading={loading} />
    </form>
  );
};

export default SignInForm;
