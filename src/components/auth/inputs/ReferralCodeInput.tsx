
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  initialReferralCode?: string;
}

const ReferralCodeInput = ({ 
  value, 
  onChange, 
  disabled = false,
  initialReferralCode
}: ReferralCodeInputProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode">{t("auth.referralCode") || "Referral Code (Optional)"}</Label>
      <Input
        id="referralCode"
        type="text"
        className="w-full"
        placeholder={t("auth.enterReferralCode") || "Enter referral code"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !!initialReferralCode}
      />
      {initialReferralCode && (
        <p className="text-xs text-blue-500">{t("auth.signingUpWithReferral") || "Signing up with a referral code"}</p>
      )}
    </div>
  );
};

export default ReferralCodeInput;
