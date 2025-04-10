
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const EmailInput = ({ value, onChange, disabled = false }: EmailInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          placeholder="Email adresinizi girin"
          className="pl-10"
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default EmailInput;
