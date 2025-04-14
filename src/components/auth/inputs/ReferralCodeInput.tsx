
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatReferralCodeForDisplay, standardizeReferralCode } from "@/utils/referralUtils";
import { useState, useEffect } from "react";

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean; // Yeni: zorunlu olup olmadığını belirler
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
    // Only format for display, raw string without dashes is stored underneath
    setDisplayValue(value ? formatReferralCodeForDisplay(value) : '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    
    // Send the standardized value upward (uppercase, no dashes)
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
          placeholder="Referans kodunuzu girin (Opsiyonel)"
          className="pl-10"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
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
        Referans kodu girebilir veya boş bırakabilirsiniz. Büyük-küçük harf fark etmez.
      </p>
    </div>
  );
};

export default ReferralCodeInput;
