
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ConfirmPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ConfirmPasswordInput = ({ value, onChange, disabled = false }: ConfirmPasswordInputProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">{t("auth.confirmPassword") || "Confirm Password"}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("auth.confirmYourPassword") || "Confirm your password"}
          className="pl-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
          minLength={6}
        />
      </div>
    </div>
  );
};

export default ConfirmPasswordInput;
