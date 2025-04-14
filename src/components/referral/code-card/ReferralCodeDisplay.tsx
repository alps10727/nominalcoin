
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReferralCodeDisplayProps {
  displayReferralCode: string;
  onEdit: () => void;
}

export const ReferralCodeDisplay = ({ displayReferralCode, onEdit }: ReferralCodeDisplayProps) => {
  const { t } = useLanguage();
  const [showCopied, setShowCopied] = useState<boolean>(false);

  // Copy the referral code to clipboard
  const copyToClipboard = (text: string) => {
    if (!text) return;
    
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
        toast.success(t('referral.copied', 'Kod kopyalandı'), {
          description: text,
        });
      })
      .catch(err => {
        console.error('Kopyalama başarısız: ', err);
        toast.error(t('referral.copyFailed', 'Kopyalama başarısız oldu'));
      });
  };
  
  return (
    <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-300">
          {t('referral.code', 'Referans Kodunuz')}
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-xs flex items-center text-purple-400 hover:text-purple-300"
        >
          <Edit className="h-3 w-3 mr-1" />
          Özel kod oluştur
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-center flex-grow">
          <div className="font-mono text-2xl md:text-2xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 py-2">
            {displayReferralCode || "KOD OLUŞTUR"}
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          className="ml-3 h-10 w-10 text-gray-300 hover:text-white hover:bg-purple-700/20 border border-purple-500/30"
          onClick={() => displayReferralCode && copyToClipboard(displayReferralCode)}
          disabled={!displayReferralCode}
        >
          {showCopied ? 
            <CheckCircle className="h-4 w-4 text-green-400" /> : 
            <Copy className="h-4 w-4" />
          }
        </Button>
      </div>
      <div className="animate-pulse mt-2 flex justify-center">
        <div className="text-xs text-purple-300/80">
          {!displayReferralCode ? (
            "Henüz referans kodunuz yok, özel kod oluşturabilirsiniz" 
          ) : showCopied ? (
            t('referral.codeCopied', 'Kod kopyalandı!') 
          ) : (
            t('referral.tapToCopy', 'Kopyalamak için tıklayın')
          )}
        </div>
      </div>
    </div>
  );
};
