
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface TermsAgreementProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const TermsAgreement = ({ checked, onCheckedChange, disabled = false }: TermsAgreementProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckedChange(checked as boolean);
        }}
        disabled={disabled}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        <Link to="/terms" className="text-primary hover:underline">
          Kullanım şartlarını
        </Link>{" "}
        ve{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          gizlilik politikasını
        </Link>{" "}
        kabul ediyorum
      </label>
    </div>
  );
};

export default TermsAgreement;
