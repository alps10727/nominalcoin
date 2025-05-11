
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const RememberMeCheckbox = ({ 
  checked, 
  onCheckedChange, 
  disabled = false 
}: RememberMeCheckboxProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="remember"
        checked={checked}
        onCheckedChange={(checked) => {
          onCheckedChange(checked as boolean);
        }}
        disabled={disabled}
      />
      <label
        htmlFor="remember"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t("auth.rememberMe") || "Remember me"}
      </label>
    </div>
  );
};

export default RememberMeCheckbox;
