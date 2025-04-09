
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PasswordInput = ({ value, onChange, disabled = false }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="password">Şifre</Label>
        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
          Şifremi unuttum?
        </Link>
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Şifrenizi girin"
          className="pl-10 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          disabled={disabled}
        />
        <button 
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
