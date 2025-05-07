
import { Control } from "react-hook-form";
import { SignUpFormValues } from "../schemas/signUpSchema";
import NameInput from "../inputs/NameInput";
import EmailInput from "../inputs/EmailInput";
import PasswordInputGroup from "./PasswordInputGroup";
import ReferralCodeInput from "../inputs/ReferralCodeInput";
import TermsAgreement from "../terms/TermsAgreement";

interface SignUpFormFieldsProps {
  control: Control<SignUpFormValues>;
  loading: boolean;
  initialReferralCode?: string;
  watch: any;
  setValue: any;
}

const SignUpFormFields = ({ 
  control, 
  loading, 
  initialReferralCode,
  watch,
  setValue
}: SignUpFormFieldsProps) => {
  return (
    <>
      <NameInput 
        value={watch("name")} 
        onChange={(value) => setValue("name", value, { shouldValidate: true })} 
        disabled={loading}
      />
      
      <EmailInput 
        value={watch("email")} 
        onChange={(value) => setValue("email", value, { shouldValidate: true })}
        disabled={loading}
      />
      
      <PasswordInputGroup 
        password={watch("password")}
        confirmPassword={watch("confirmPassword")}
        setPassword={(value) => setValue("password", value, { shouldValidate: true })}
        setConfirmPassword={(value) => setValue("confirmPassword", value, { shouldValidate: true })}
        disabled={loading}
      />
      
      <ReferralCodeInput
        value={watch("referralCode")}
        onChange={(value) => setValue("referralCode", value, { shouldValidate: true })}
        disabled={loading}
        initialReferralCode={initialReferralCode}
      />
      
      <TermsAgreement 
        checked={watch("agreedToTerms") === true} 
        onCheckedChange={(checked) => {
          setValue("agreedToTerms", checked ? true : false, { shouldValidate: true })
        }}
        disabled={loading}
      />
    </>
  );
};

export default SignUpFormFields;
