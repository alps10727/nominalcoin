
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Copy, Share, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Referral = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [referralCode] = useState("FC-MINER-123456");
  const [referralLink] = useState("https://futurecoin.app/ref/FC-MINER-123456");
  const [referralCount] = useState(2);
  const [totalEarned] = useState(10);
  const [showCopied, setShowCopied] = useState<'code' | 'link' | null>(null);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
    toast({
      title: t('referral.copied'),
      description: type === 'code' ? referralCode : referralLink,
    });
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Future Coin",
        text: "Join me on Future Coin and we both earn rewards!",
        url: referralLink,
      }).catch(error => console.log('Error sharing', error));
    } else {
      copyToClipboard(referralLink, 'link');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('referral.title')}</h1>
        </div>

        <Card className="mb-6 overflow-hidden border-none shadow-lg bg-navy-800 dark:bg-navy-850">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-blue-800 opacity-90"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-medium text-gray-200">
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-teal-300" />
                {t('referral.title')}
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              {t('referral.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('referral.code')}
                </label>
                <div className="relative">
                  <Input 
                    value={referralCode} 
                    readOnly
                    className="pr-10 bg-navy-700/50 border-navy-600 text-white"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full text-gray-300 hover:text-white"
                    onClick={() => copyToClipboard(referralCode, 'code')}
                  >
                    {showCopied === 'code' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {t('referral.link')}
                </label>
                <div className="relative">
                  <Input 
                    value={referralLink} 
                    readOnly
                    className="pr-10 bg-navy-700/50 border-navy-600 text-white"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full text-gray-300 hover:text-white"
                    onClick={() => copyToClipboard(referralLink, 'link')}
                  >
                    {showCopied === 'link' ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white" 
                onClick={shareReferral}
              >
                <Share className="h-4 w-4 mr-2" />
                {t('referral.share')}
              </Button>

              <div className="text-center mt-6 text-gray-300">
                <p>{t('referral.reward', "5.0")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-none shadow-md bg-navy-800 text-gray-100 dark:bg-navy-850">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-center">Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-teal-400">{referralCount}</p>
                <p className="text-sm text-gray-400">Friends joined</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-navy-800 text-gray-100 dark:bg-navy-850">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-center">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{totalEarned} FC</p>
                <p className="text-sm text-gray-400">From referrals</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Referral;
