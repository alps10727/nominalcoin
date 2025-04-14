
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ReferralCodeInput from "../inputs/ReferralCodeInput";
import { generateSuggestedCode } from "@/services/referralService";

interface ReferralCodeSectionProps {
  referralCode: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const ReferralCodeSection = ({
  referralCode,
  onChange,
  disabled
}: ReferralCodeSectionProps) => {
  const [generatingCode, setGeneratingCode] = useState(false);
  
  const handleGenerateCode = () => {
    setGeneratingCode(true);
    try {
      const suggestedCode = generateSuggestedCode();
      onChange(suggestedCode);
    } catch (error) {
      console.error("Kod üretme hatası:", error);
    } finally {
      setGeneratingCode(false);
    }
  };
  
  return (
    <div className="space-y-1">
      <ReferralCodeInput 
        value={referralCode} 
        onChange={onChange}
        disabled={disabled}
        required={false}
      />
      
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGenerateCode}
          disabled={disabled || generatingCode}
          className="mt-1 text-xs flex items-center"
        >
          {generatingCode ? (
            <>
              <div className="animate-spin mr-1 h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
              Oluşturuluyor...
            </>
          ) : (
            <>
              <RefreshCw className="h-3 w-3 mr-1" />
              Kod Öner
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReferralCodeSection;
