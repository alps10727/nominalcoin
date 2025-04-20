
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferralListProps {
  referrals: string[];
}

const ReferralList = ({ referrals }: ReferralListProps) => {
  const { t } = useLanguage();
  
  if (!referrals || referrals.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" /> 
          <span>{t("referral.yourReferrals")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {referrals.map((referral, index) => (
            <div 
              key={`referral-${index}-${referral.substring(0, 8)}`} 
              className="p-2 bg-secondary/50 rounded-md"
            >
              <div className="text-sm font-medium">
                {referral}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralList;
