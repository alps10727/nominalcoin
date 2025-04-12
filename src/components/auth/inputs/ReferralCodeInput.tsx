
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatReferralCodeForDisplay, standardizeReferralCode } from "@/utils/referralUtils";
import { useState, useEffect } from "react";

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ReferralCodeInput = ({ value, onChange, disabled = false }: ReferralCodeInputProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Format input value for display
  useEffect(() => {
    // Sadece gösterim için formatla, altta tire olmayan ham bir string saklanıyor
    setDisplayValue(value ? formatReferralCodeForDisplay(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    
    // Standartlaştırılmış değeri yukarıya gönder
    const standardized = standardizeReferralCode(input);
    onChange(standardized);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode" className="flex items-center">
        Referans Kodu <span className="text-red-500 ml-1">*</span>
        <span className="text-xs text-muted-foreground ml-2">(Zorunlu)</span>
      </Label>
      <div className="relative">
        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="referralCode"
          type="text"
          placeholder="Referans kodunuzu girin (XXX-XXX-XXX)"
          className="pl-10"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          required
        />
      </div>
    </div>
  );
};

export default ReferralCodeInput;
