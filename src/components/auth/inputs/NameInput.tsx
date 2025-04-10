
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

interface NameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const NameInput = ({ value, onChange, disabled }: NameInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Ad Soyad</Label>
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="name"
          type="text"
          placeholder="Adınızı ve soyadınızı girin"
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

export default NameInput;
