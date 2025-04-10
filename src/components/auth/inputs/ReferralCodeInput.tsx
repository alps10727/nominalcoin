
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

interface ReferralCodeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

const ReferralCodeInput = ({ value, onChange, disabled }: ReferralCodeInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode">Referans Kodu (Opsiyonel)</Label>
      <div className="relative">
        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="referralCode"
          type="text"
          placeholder="Referans kodunuz varsa girin"
          className="pl-10"
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ReferralCodeInput;
