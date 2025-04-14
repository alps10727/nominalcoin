
import { Zap } from "lucide-react";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

export const ReferralBonus = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mt-6 text-gray-300">
      <p className="flex items-center justify-center mb-2">
        <Zap className="h-4 w-4 mr-1 text-yellow-400" />
        Her referans için <span className="text-green-400 font-bold mx-1">+{REFERRAL_BONUS_RATE}</span> mining hızı
      </p>
      <p className="text-xs text-gray-400">
        Her bir kullanıcı için yalnızca bir kez ödül alırsınız. Tekrarlı bonuslar verilmez.
      </p>
    </div>
  );
};
