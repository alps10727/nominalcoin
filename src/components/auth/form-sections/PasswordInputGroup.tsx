
import PasswordInput from "../inputs/PasswordInput";
import ConfirmPasswordInput from "../inputs/ConfirmPasswordInput";

interface PasswordInputGroupProps {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  disabled: boolean;
}

const PasswordInputGroup = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  disabled
}: PasswordInputGroupProps) => {
  return (
    <>
      <PasswordInput 
        value={password} 
        onChange={setPassword}
        disabled={disabled}
      />
      
      <ConfirmPasswordInput 
        value={confirmPassword} 
        onChange={setConfirmPassword}
        disabled={disabled}
      />
    </>
  );
};

export default PasswordInputGroup;
