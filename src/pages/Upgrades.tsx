
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
  
  // Initialize missions with a default empty array
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "social-twitter",
      title: t("missions.followTwitter") || "Follow Us on Twitter",
      description: t("missions.followTwitterDesc") || "Follow our Twitter account to earn 5 NC",
      reward: 5,
      progress: 0,
      total: 1,
      completed: false,
      claimed: false,
      icon: <Star className="h-5 w-5 text-blue-400" />
    },
    {
      id: "mining-time",
      title: t("missions.miningTime") || "Mine for 2 Hours",
      description: t("missions.miningTimeDesc") || "Keep mining active for 2 hours to increase mining speed",
      reward: 5, // Artık NC veren bir görev olarak değiştirildi
      progress: 0,
      total: 120,
      completed: false,
      claimed: false,
      icon: <Clock className="h-5 w-5 text-indigo-400" />
    },
    {
      id: "referral-friend",
      title: t("missions.inviteFriend") || "Invite a Friend",
      description: t("missions.inviteFriendDesc") || "Invite a friend to the platform and earn 20 NC",
      reward: 20,
      progress: 0,
      total: 1,
      completed: false,
      claimed: false,
      icon: <Gift className="h-5 w-5 text-pink-400" />
    }
  ]);

  // Update missions when language changes
  useEffect(() => {
    setMissions(prevMissions => prevMissions.map(mission => {
      if (mission.id === "social-twitter") {
        return {
          ...mission,
          title: t("missions.followTwitter") || mission.title,
          description: t("missions.followTwitterDesc") || mission.description
        };
      } else if (mission.id === "mining-time") {
        return {
          ...mission,
          title: t("missions.miningTime") || mission.title,
          description: t("missions.miningTimeDesc") || mission.description
        };
      } else if (mission.id === "referral-friend") {
        return {
          ...mission,
          title: t("missions.inviteFriend") || mission.title,
          description: t("missions.inviteFriendDesc") || mission.description
        };
      }
      return mission;
    }));
  }, [t]);

  // User data based mission updates
  useEffect(() => {
    if (userData) {
      // Twitter mission check - example implementation
      if (userData.socialConnections?.twitter) {
        updateMissionProgress("social-twitter", 1);
      }
      
      // Mining time check
      if (userData.miningTime && userData.miningTime >= 120) {
        updateMissionProgress("mining-time", userData.miningTime);
      }
      
      // Referral check
      if (userData.referralCount && userData.referralCount > 0) {
        updateMissionProgress("referral-friend", 1);
      }
      
      // Mark completed missions
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

  const updateMissionProgress = (missionId: string, progressAmount: number) => {
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
      toast.error(t("tasks.loginRequired"));
      return;
    }
    
    if (!mission.completed || mission.progress < mission.total) {
      toast.error(t("tasks.incompleteTask"));
      return;
    }
    
    if (mission.claimed) {
      toast.error(t("tasks.alreadyClaimed"));
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Standard NC reward process
      const { data, error } = await supabase.rpc('update_user_balance', {
        p_user_id: currentUser.id,
        p_amount: mission.reward,
        p_reason: `${t("tasks.rewardClaimed")}: ${mission.title}`
      });
      
      if (error) {
        console.error("Error claiming reward:", error);
        throw error;
      }
      
      // Update local data
      const currentBalance = userData?.balance || 0;
      const newBalance = currentBalance + mission.reward;
      
      // Mining rate güncelleme - mining-time görevi için
      let updatedMiningRate = userData?.miningRate || 0.003;
      if (mission.id === "mining-time") {
        updatedMiningRate = parseFloat((updatedMiningRate + 0.001).toFixed(4));
      }
      
      // Update userData
      if (updateUserData) {
        const updatedMissions = userData?.completedMissions || [];
        await updateUserData({
          balance: newBalance,
          miningRate: updatedMiningRate,
          completedMissions: [...updatedMissions, mission.id]
        });
      }
      
      // Update mission status
      setMissions(prevMissions => 
        prevMissions.map(m => 
          m.id === mission.id 
            ? { ...m, completed: true, claimed: true } 
            : m
        )
      );
      
      toast.success(t("tasks.rewardClaimedDesc", mission.reward.toString(), mission.title));
      debugLog("Upgrades", `Mission reward given: ${mission.id}, amount: ${mission.reward}`);
      
    } catch (error) {
      toast.error(t("tasks.claimError"));
      console.error("Claim error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const connectTwitter = async () => {
    toast.info(t("missions.connectingTwitter") || "Connecting to Twitter...");
    setTimeout(() => {
      updateMissionProgress("social-twitter", 1);
      toast.success(t("missions.twitterConnected") || "Your Twitter account has been connected!");
    }, 1500);
  };

  return (
    <div className="w-full min-h-[100dvh] px-4 py-6 relative">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold fc-gradient-text flex items-center">
          <Gift className="mr-2 h-6 w-6 text-indigo-400" />
          {t("missions.title")}
        </h1>
        <p className="text-gray-400">
          {t("missions.subtitle")}
        </p>
      </div>

      <div className="space-y-4 mt-4">
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
