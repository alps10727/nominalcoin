
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferralHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

const ReferralHeader = ({ onRefresh, isRefreshing }: ReferralHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{t("referral.inviteFriends")}</h1>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh} 
        disabled={isRefreshing}
        className="flex items-center gap-1"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        {t("common.refresh")}
      </Button>
    </div>
  );
};

export default ReferralHeader;
