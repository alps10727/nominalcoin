
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="space-y-2">
      <Label htmlFor="referralCode">Referans Kodu (İsteğe Bağlı)</Label>
      <Input
        id="referralCode"
        type="text"
        className="w-full"
        placeholder="Referans kodu girin"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || !!initialReferralCode}
      />
      {initialReferralCode && (
        <p className="text-xs text-blue-500">Referans kodu ile kaydoluyorsunuz</p>
      )}
    </div>
  );
};

export default ReferralCodeInput;
