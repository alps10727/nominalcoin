
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ConfirmPasswordInput = ({ value, onChange, disabled = false }: ConfirmPasswordInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Şifrenizi tekrar girin"
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
