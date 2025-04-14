
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatReferralCodeForDisplay, standardizeReferralCode } from "@/utils/referralUtils";
import { useState, useEffect } from "react";

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  onValidate?: (isValid: boolean) => void;
}

const ReferralCodeInput = ({ 
  value, 
  onChange, 
  disabled = false, 
  required = false,
  onValidate 
}: ReferralCodeInputProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  useEffect(() => {
    setDisplayValue(formatReferralCodeForDisplay(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);
    
    // Basic format validation
    const standardized = standardizeReferralCode(input);
    if (standardized && !/^[A-Z]{0,3}\d{0,3}$/.test(standardized)) {
      setErrorMessage("Geçersiz format! Örnek: ABC123 (3 harf + 3 rakam)");
      onValidate?.(false);
    } else {
      setErrorMessage("");
      onValidate?.(true);
    }
    
    onChange(standardized);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode" className="flex items-center">
        Referans Kodu {required && <span className="text-red-500 ml-1">*</span>}
        <span className="text-xs text-muted-foreground ml-2">
          {required ? "(Zorunlu)" : "(Opsiyonel)"}
        </span>
      </Label>
      <div className="relative">
        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="referralCode"
          type="text"
          placeholder="Referans kodu girin (örn: ABC123)"
          className={`pl-10 ${errorMessage ? "border-red-500" : ""}`}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          maxLength={6}
        />
      </div>
      {errorMessage ? (
        <p className="text-xs text-red-500">{errorMessage}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Geçerli format: 3 harf + 3 rakam (örn: ABC123)
        </p>
      )}
    </div>
  );
};

export default ReferralCodeInput;
