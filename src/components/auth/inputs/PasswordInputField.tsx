
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface PasswordInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
}

const PasswordInputField = ({ id, label, value, onChange, placeholder, disabled }: PasswordInputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          type="password"
          placeholder={placeholder}
          className="pl-10"
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
          minLength={6}
        />
      </div>
    </div>
  );
};

export default PasswordInputField;
