
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Copy, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { debugLog } from "@/utils/debugUtils";

interface ReferralCodeCardProps {
  referralCode: string;
}

const ReferralCodeCard = ({ referralCode }: ReferralCodeCardProps) => {
  const [copied, setCopied] = useState(false);
  // Only generate the referral link once the code is available
  const referralLink = referralCode ? `https://app.nominalcoin.com/signup?ref=${referralCode}` : '';

  const handleCopy = async () => {
    if (!referralCode) {
      toast({
        title: "Hata",
        description: "Referans kodu henüz mevcut değil",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast({
        title: "Başarılı",
        description: "Referans kodu kopyalandı!",
        duration: 3000
      });
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({
        title: "Hata",
        description: "Kopyalama başarısız oldu",
        variant: "destructive",
        duration: 3000
      });
      debugLog("Referral", "Copy failed:", err);
    }
  };

  const handleShare = async () => {
    if (!referralCode) {
      toast({
        title: "Hata",
        description: "Referans kodu henüz mevcut değil",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NominalCoin\'e davet',
          text: 'Madencilik yaparak NC kazanın! Referans kodumu kullanarak kaydolun:',
          url: referralLink
        });
        toast({
          title: "Başarılı",
          description: "Paylaşım başarılı!",
          duration: 3000
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: "Hata",
            description: "Paylaşım başarısız oldu",
            variant: "destructive",
            duration: 3000
          });
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
        <CardTitle className="text-white">Referans Kodun</CardTitle>
        <CardDescription className="text-gray-300">
          Bu kodu arkadaşlarınla paylaş
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between p-3 bg-blue-950/50 rounded-lg border border-blue-800/30">
          <div className="font-mono text-xl font-bold tracking-wider text-white">
            {referralCode || "Yükleniyor..."}
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
          Her kullanıcıya özel sabit kod - değişmez
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          onClick={handleShare}
          disabled={!referralCode}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Arkadaşlarını Davet Et
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReferralCodeCard;
