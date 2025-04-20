
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";
import { useLanguage } from "@/contexts/LanguageContext";

const ReferralBenefits = () => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-gradient-to-br from-violet-900/80 to-indigo-900/80 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white">
          <Award className="w-5 h-5" /> 
          <span>{t("referral.benefits")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-violet-900/30 rounded border border-violet-700/30">
            <div className="text-sm text-white">{t("referral.perReferral")}</div>
            <div className="font-bold text-green-300">+{REFERRAL_BONUS_RATE} NC/min</div>
          </div>
          <p className="text-sm text-gray-300 mt-2">
            {t("referral.bonusDescription")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralBenefits;
