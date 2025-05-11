
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog } from "@/utils/debugUtils";

interface ReferralCodeCardProps {
  referralCode: string;
}

const ReferralCodeCard = ({ referralCode }: ReferralCodeCardProps) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  // Only generate the referral link once the code is available
  const referralLink = referralCode ? `https://app.nominalcoin.com/signup?ref=${referralCode}` : '';

  const handleCopy = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      debugLog("Referral", "Copy failed:", err);
    }
  };

  const handleShare = async () => {
    if (!referralCode) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("referral.inviteTitle"),
          text: t("referral.inviteText"),
          url: referralLink
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          debugLog("Referral", "Share failed:", err);
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 border-none shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">{t("referral.yourCode")}</CardTitle>
        <CardDescription className="text-gray-300">
          {t("referral.shareCodeWithFriends")}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between p-3 bg-blue-950/50 rounded-lg border border-blue-800/30">
          <div className="font-mono text-xl font-bold tracking-wider text-white">
            {referralCode || t("common.loading")}
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 bg-blue-800/30 hover:bg-blue-700/50"
            onClick={handleCopy}
            disabled={!referralCode}
          >
            {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-2 text-xs text-blue-300">
          {t("referral.uniqueCode")}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={handleShare}
          disabled={!referralCode}
        >
          <Share2 className="mr-2 h-4 w-4" />
          {t("referral.inviteFriends")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralCodeCard;
