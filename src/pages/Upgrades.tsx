
import React, { useState, useEffect } from "react";
import { Gift, Star, Clock, Rocket } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog } from "@/utils/debugUtils";
import { supabase } from "@/integrations/supabase/client";
import MissionsList from "@/components/upgrades/MissionsList";

export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  total: number;
  completed: boolean;
  claimed: boolean;
  icon: React.ReactNode;
};

const Upgrades = () => {
  const { t } = useLanguage();
  const { userData, currentUser, updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "social-twitter",
      title: "Twitter'da Bizi Takip Et",
      description: "Twitter hesabımızı takip ederek 5 NC kazan",
      reward: 5,
      progress: 0,
      total: 1,
      completed: false,
      claimed: false,
      icon: <Star className="h-5 w-5 text-blue-400" />
    },
    {
      id: "mining-time",
      title: "2 Saat Madencilik Yap",
      description: "2 saat boyunca madenciliği açık tut ve 10 NC kazan",
      reward: 10,
      progress: 0,
      total: 120,
      completed: false,
      claimed: false,
      icon: <Clock className="h-5 w-5 text-indigo-400" />
    },
    {
      id: "referral-friend",
      title: "Arkadaşını Davet Et",
      description: "Bir arkadaşını platforma davet et ve 20 NC kazan",
      reward: 20,
      progress: 0,
      total: 1,
      completed: false,
      claimed: false,
      icon: <Gift className="h-5 w-5 text-pink-400" />
    }
  ]);

  // Kullanıcı verilerine göre görevleri güncelleme
  useEffect(() => {
    if (userData) {
      // Twitter görevi için kontrol - örnek implementation
      if (userData.socialConnections?.twitter) {
        updateMissionProgress("social-twitter", 1);
      }
      
      // Madencilik süresi kontrolü
      if (userData.miningTime && userData.miningTime >= 120) {
        updateMissionProgress("mining-time", userData.miningTime);
      }
      
      // Referral kontrolü
      if (userData.referralCount && userData.referralCount > 0) {
        updateMissionProgress("referral-friend", 1);
      }
      
      // Tamamlanmış görevleri işaretle
      if (userData.completedMissions && Array.isArray(userData.completedMissions)) {
        setMissions(prevMissions => prevMissions.map(mission => {
          if (userData.completedMissions?.includes(mission.id)) {
            return { ...mission, claimed: true };
          }
          return mission;
        }));
      }
    }
  }, [userData]);

  const updateMissionProgress = async (missionId: string, progressAmount: number) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          const newProgress = Math.min(mission.progress + progressAmount, mission.total);
          return { 
            ...mission, 
            progress: newProgress,
            completed: newProgress >= mission.total && !mission.completed 
          };
        }
        return mission;
      })
    );
  };

  const claimReward = async (mission: Mission) => {
    if (!currentUser) {
      toast.error("Ödül almak için giriş yapmalısınız");
      return;
    }
    
    if (!mission.completed || mission.progress < mission.total) {
      toast.error("Bu görevi henüz tamamlamadınız");
      return;
    }
    
    if (mission.claimed) {
      toast.error("Bu ödülü zaten aldınız");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Supabase bakiye güncelleme fonksiyonunu çağırma
      const { data, error } = await supabase.rpc('update_user_balance', {
        p_user_id: currentUser.id,
        p_amount: mission.reward,
        p_reason: `Görev tamamlandı: ${mission.title}`
      });
      
      if (error) {
        console.error("Ödül alma hatası:", error);
        throw error;
      }
      
      // Yerel veriyi güncelleme
      const currentBalance = userData?.balance || 0;
      const newBalance = currentBalance + mission.reward;
      
      // userDatası güncellemesi
      if (updateUserData) {
        const updatedMissions = userData?.completedMissions || [];
        await updateUserData({
          balance: newBalance,
          completedMissions: [...updatedMissions, mission.id] as string[]
        });
      }
      
      // Görev durumunu güncelleme
      setMissions(prevMissions => 
        prevMissions.map(m => 
          m.id === mission.id 
            ? { ...m, completed: true, claimed: true } 
            : m
        )
      );
      
      toast.success(`Tebrikler! ${mission.reward} NC kazandınız`);
      debugLog("Upgrades", `Görev ödülü verildi: ${mission.id}, miktar: ${mission.reward}`);
      
    } catch (error) {
      toast.error("Ödül alınırken bir hata oluştu");
      console.error("Claim error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectTwitter = async () => {
    toast.info("Twitter bağlantısı simüle ediliyor...");
    setTimeout(() => {
      updateMissionProgress("social-twitter", 1);
      toast.success("Twitter hesabınız bağlandı!");
    }, 1500);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold fc-gradient-text flex items-center">
          <Gift className="mr-2 h-6 w-6 text-indigo-400" />
          Görevler ve Ödüller
        </h1>
        <p className="text-gray-400">
          Çeşitli görevleri tamamlayarak ekstra NC coin kazanın.
        </p>
      </div>

      <div className="space-y-4">
        <MissionsList 
          missions={missions}
          onClaim={claimReward}
          onConnect={connectTwitter}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Upgrades;
