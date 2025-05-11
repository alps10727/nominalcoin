
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface TermsAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TermsAgreement = ({ checked, onCheckedChange, disabled = false }: TermsAgreementProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckedChange(checked === true);
        }}
        disabled={disabled}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        <Link to="/terms" className="text-primary hover:underline">
          {t("auth.termsOfService") || "Terms of Service"}
        </Link>{" "}
        {t("auth.and") || "and"}{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          {t("auth.privacyPolicy") || "Privacy Policy"}
        </Link>{" "}
        {t("auth.iAccept") || "I accept"}
      </label>
    </div>
  );
};

export default TermsAgreement;
