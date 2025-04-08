
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ReferralCodeCardProps {
  referralCode: string;
  referralLink: string;
}

export const ReferralCodeCard = ({ referralCode }: ReferralCodeCardProps) => {
  const { t } = useLanguage();
  const [showCopied, setShowCopied] = useState<'code' | 'link' | null>(null);

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopied(type);
        setTimeout(() => setShowCopied(null), 2000);
        toast.success(t('referral.copied'), {
          description: text,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error(t('referral.copyFailed', 'Kopyalama başarısız oldu'));
      });
  };

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-200">
          <div className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-purple-400" />
            {t('referral.yourCode', 'Referans Kodunuz')}
          </div>
        </CardTitle>
        <CardDescription className="text-gray-300">
          {t('referral.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 space-y-6">
          <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {t('referral.code')}
            </label>
            <div className="flex items-center justify-between">
              <div className="text-center flex-grow">
                <div className="font-mono text-2xl md:text-2xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 py-2">
                  {referralCode}
                </div>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="ml-3 h-10 w-10 text-gray-300 hover:text-white hover:bg-purple-700/20 border border-purple-500/30"
                onClick={() => copyToClipboard(referralCode, 'code')}
              >
                {showCopied === 'code' ? 
                  <CheckCircle className="h-4 w-4 text-green-400" /> : 
                  <Copy className="h-4 w-4" />
                }
              </Button>
            </div>
            <div className="animate-pulse mt-2 flex justify-center">
              <div className="text-xs text-purple-300/80">
                {showCopied === 'code' ? 
                  t('referral.codeCopied', 'Kod kopyalandı!') : 
                  t('referral.tapToCopy', 'Kopyalamak için tıklayın')
                }
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-300">
            <p>{t('referral.reward', "5.0")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
