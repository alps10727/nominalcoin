
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatReferralCodeForDisplay, standardizeReferralCode } from "@/utils/referralUtils";
import { useState, useEffect } from "react";

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean; // Whether the input is required
}

const ReferralCodeInput = ({ 
  value, 
  onChange, 
  disabled = false, 
  required = false 
}: ReferralCodeInputProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Format input value for display
  useEffect(() => {
    setDisplayValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    
    // Send the standardized value upward (uppercase, no spaces)
    const standardized = standardizeReferralCode(input);
    onChange(standardized);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode" className="flex items-center">
        Referans Kodu {required && <span className="text-red-500 ml-1">*</span>}
        {required ? (
          <span className="text-xs text-muted-foreground ml-2">(Zorunlu)</span>
        ) : (
          <span className="text-xs text-muted-foreground ml-2">(Opsiyonel)</span>
        )}
      </Label>
      <div className="relative">
        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="referralCode"
          type="text"
          placeholder="Referans kodu girin (örn: ABC123)"
          className="pl-10"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={6} // New format is exactly 6 characters
          onInvalid={(e: React.FormEvent<HTMLInputElement>) => {
            if (required) {
              (e.target as HTMLInputElement).setCustomValidity('Referans kodu gereklidir!');
            }
          }}
          onInput={(e: React.FormEvent<HTMLInputElement>) => {
            (e.target as HTMLInputElement).setCustomValidity('');
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Referans kodu girebilir veya boş bırakabilirsiniz.
        Geçerli format: 3 harf + 3 rakam (örn: ABC123)
      </p>
    </div>
  );
};

export default ReferralCodeInput;
