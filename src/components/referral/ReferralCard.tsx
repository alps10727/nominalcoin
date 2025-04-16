
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { applyReferralCode, getUserReferralInfo, initializeReferralCode } from "@/services/referral/referralService";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

export default function ReferralCard() {
  const { currentUser, userData } = useAuth();
  const [referralCode, setReferralCode] = useState<string>("");
  const [inputCode, setInputCode] = useState<string>("");
  const [referrals, setReferrals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Referans kodunu ve davet edilen kullanıcıları yükle
  useEffect(() => {
    async function loadReferralInfo() {
      if (!currentUser) return;

      setIsLoading(true);
      try {
        // Referans kodu yoksa oluştur, varsa getir
        const info = await getUserReferralInfo(currentUser.uid);
        
        if (info) {
          setReferralCode(info.referralCode);
          setReferrals(info.referrals || []);
        } else if (currentUser.uid) {
          // Hiç referans bilgisi yoksa yeni bir kod oluştur
          const newCode = await initializeReferralCode(currentUser.uid);
          if (newCode) setReferralCode(newCode);
        }
      } catch (error) {
        debugLog("ReferralCard", "Referans bilgisi yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReferralInfo();
  }, [currentUser]);

  // Referans kodunu kopyala
  const copyReferralCode = () => {
    if (!referralCode) return;
    
    navigator.clipboard.writeText(referralCode)
      .then(() => {
        toast.success("Referans kodu kopyalandı!");
      })
      .catch((err) => {
        toast.error("Kopyalama başarısız oldu: " + err);
      });
  };

  // Referans kodunu paylaş
  const shareReferralCode = async () => {
    if (!referralCode) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Coin Kazandıran Uygulama',
          text: `Referans kodumu kullanarak kaydol ve bonus kazanma şansı yakala! Kodum: ${referralCode}`,
          url: window.location.origin,
        });
      } catch (error) {
        console.error('Paylaşım hatası:', error);
      }
    } else {
      copyReferralCode();
      toast.info("Tarayıcınız doğrudan paylaşımı desteklemiyor, bunun yerine referans kodunuz kopyalandı.");
    }
  };

  // Referans kodunu uygula
  const handleApplyCode = async () => {
    if (!inputCode || !currentUser) return;

    setIsApplying(true);
    try {
      const success = await applyReferralCode(currentUser.uid, inputCode);
      if (success) {
        setInputCode("");
      }
    } finally {
      setIsApplying(false);
    }
  };

  // Kullanıcının davet ettiği kullanıcı sayısını hesapla
  const referralCount = referrals?.length || 0;
  
  // Kullanıcının zaten bir davetçisi varsa
  const hasInviter = userData?.invitedBy ? true : false;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-indigo-500" />
          Arkadaş Davet Sistemi
        </CardTitle>
        <CardDescription>
          Arkadaşlarınızı davet edin, her başarılı davet için madencilik hızınız artar!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Referans Kodu Gösterimi */}
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Referans Kodunuz:</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md p-2 font-mono text-lg">
              {isLoading ? "Yükleniyor..." : referralCode || "Henüz kod oluşturulmadı"}
            </div>
            <Button variant="outline" size="icon" onClick={copyReferralCode} title="Kopyala">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={shareReferralCode} title="Paylaş">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Davet Ettiğiniz Kişi Sayısı</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{referralCount}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Bonus</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              +{(referralCount * 0.003).toFixed(3)}
            </p>
          </div>
        </div>

        {/* Referans Kodu Girişi */}
        {!hasInviter && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Arkadaşınızın referans kodunu girin:
            </p>
            <div className="flex gap-2">
              <Input 
                value={inputCode} 
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="REFERANS KODU" 
                className="flex-1 uppercase"
                maxLength={15}
              />
              <Button onClick={handleApplyCode} disabled={isApplying || !inputCode}>
                {isApplying ? "İşleniyor..." : "Uygula"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch border-t pt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Her başarılı davet için madencilik hızınıza +0.003 bonus eklenir. 
          Davet ettiğiniz arkadaşlarınız da +0.001 bonus kazanır!
        </p>
      </CardFooter>
    </Card>
  );
}
