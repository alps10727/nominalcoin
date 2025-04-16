
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Share2, Copy, Users, Award, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

const Referral = () => {
  const { userData, currentUser, updateUserData } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Referral kod kontrolü
  const referralCode = userData?.referralCode || '';
  const referralCount = userData?.referralCount || 0;
  const referrals = userData?.referrals || [];
  
  const referralLink = `https://app.nominalcoin.com/signup?ref=${referralCode}`;
  
  // Refresh user data function to get the latest referral stats
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast.loading("Referans bilgileri yükleniyor...");
      
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const freshUserData = userDocSnap.data();
        
        // Update the user data in context with fresh data
        if (updateUserData) {
          await updateUserData({
            referralCode: freshUserData.referralCode || referralCode,
            referralCount: freshUserData.referralCount || 0,
            referrals: freshUserData.referrals || [],
            miningRate: freshUserData.miningRate || userData?.miningRate || 0.003
          });
          
          toast.success("Referans bilgileri güncellendi");
        }
      }
    } catch (error) {
      toast.error("Verileri güncellerken bir hata oluştu");
      debugLog("Referral", "Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      toast.dismiss();
    }
  };
  
  // Effect to refresh data on initial load
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      refreshUserData();
    }
  }, [currentUser]);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      toast.success("Referans kodu kopyalandı!");
      
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error("Kopyalama başarısız oldu");
      debugLog("Referral", "Copy failed:", err);
    }
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NominalCoin\'e davet',
          text: 'Madencilik yaparak NC kazanın! Referans kodumu kullanarak kaydolun:',
          url: referralLink
        });
        toast.success("Paylaşım başarılı!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error("Paylaşım başarısız oldu");
          debugLog("Referral", "Share failed:", err);
        }
      }
    } else {
      handleCopy();
    }
  };
  
  const totalBonus = (referralCount * REFERRAL_BONUS_RATE).toFixed(3);
  
  return (
    <div className="container max-w-md px-4 py-8 mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Arkadaşlarını Davet Et</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshUserData} 
          disabled={isRefreshing}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>
      
      <Card className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" /> 
            <span>Referans İstatistikleri</span>
          </CardTitle>
          <CardDescription className="text-gray-300">
            Arkadaşlarını davet ederek madencilik hızını artır
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-700/30">
              <div className="text-sm text-indigo-300">Toplam Davet</div>
              <div className="text-2xl font-bold mt-1 text-white">{referralCount}</div>
            </div>
            <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-700/30">
              <div className="text-sm text-purple-300">Toplam Bonus</div>
              <div className="text-2xl font-bold mt-1 text-white">+{totalBonus} NC/dk</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
      
      <Card className="bg-gradient-to-br from-violet-900/80 to-indigo-900/80 border-none shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="w-5 h-5" /> 
            <span>Kazanımlar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-violet-900/30 rounded border border-violet-700/30">
              <div className="text-sm text-white">Her referans için</div>
              <div className="font-bold text-green-300">+{REFERRAL_BONUS_RATE} NC/dk</div>
            </div>
            <p className="text-sm text-gray-300 mt-2">
              Her başarılı davet için madencilik hızın kalıcı olarak artar.
              Arkadaşların kaydolduğunda anında bonus kazanırsın!
            </p>
          </div>
        </CardContent>
      </Card>
      
      {referralCount > 0 && (
        <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Davet Ettiğin Kişiler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referrals.map((userId, index) => (
                <div key={userId} className="flex items-center justify-between p-2 bg-gray-800/40 rounded">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2">
                      {index + 1}
                    </div>
                    <div className="text-sm text-white">Kullanıcı {userId.substring(0, 6)}...</div>
                  </div>
                  <div className="text-sm text-green-400">+{REFERRAL_BONUS_RATE} NC/dk</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Referral;
