
import { useState, useEffect } from "react";
import { CheckCircle, Clock, Award, CheckCheck } from "lucide-react";
import { Task, Badge } from "@/types/tasks";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

export const useTasksData = () => {
  const { t } = useLanguage();
  const { userData, currentUser } = useAuth();
  
  const [dailyTasks, setDailyTasks] = useState<Task[]>([
    {
      id: 1,
      title: t("tasks.mineTask"),
      description: t("tasks.mineTaskDesc"),
      reward: 1,
      progress: 0,
      totalRequired: 5,
      completed: false
    },
    {
      id: 2,
      title: t("tasks.profileTask"),
      description: t("tasks.profileTaskDesc"),
      reward: 0.5,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
    {
      id: 3,
      title: t("tasks.inviteTask"),
      description: t("tasks.inviteTaskDesc"),
      reward: 2,
      progress: 0,
      totalRequired: 1,
      completed: false
    },
  ]);

  const [badges, setBadges] = useState<Badge[]>([
    {
      id: 1,
      title: t("badges.firstMiner"),
      description: t("badges.firstMinerDesc"),
      icon: <CheckCircle className="h-6 w-6 text-green-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 2,
      title: t("badges.miningPro"),
      description: t("badges.miningProDesc"),
      icon: <Clock className="h-6 w-6 text-indigo-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 3,
      title: t("badges.socialNetworker"),
      description: t("badges.socialNetworkerDesc"),
      icon: <Award className="h-6 w-6 text-yellow-400" />,
      earned: false,
      progress: 0
    },
    {
      id: 4,
      title: t("badges.upgradeMaster"),
      description: t("badges.upgradeMasterDesc"),
      icon: <CheckCheck className="h-6 w-6 text-purple-400" />,
      earned: false,
      progress: 0
    },
  ]);

  // Kullanıcı veri yüklendiğinde görev ilerlemesini güncelle
  useEffect(() => {
    if (userData) {
      // Kullanıcı verilerine göre görev ilerlemesini güncelle
      const updatedTasks = [...dailyTasks];
      
      // Madencilik görevi: userData'dan madencilik oturumu bilgisine göre güncelle
      if (userData.miningSession !== undefined) {
        const miningTaskIndex = updatedTasks.findIndex(task => task.id === 1);
        if (miningTaskIndex !== -1) {
          // Her 0.003 coin kazanıldığında bir ilerleme sayılır (1 periyot tamamlandığında)
          const miningProgress = Math.min(
            Math.floor((userData.miningSession || 0) / 0.003), 
            updatedTasks[miningTaskIndex].totalRequired
          );
          
          updatedTasks[miningTaskIndex] = {
            ...updatedTasks[miningTaskIndex],
            progress: miningProgress,
            completed: userData.tasks?.completed?.includes(1) || false
          };
        }
      }
      
      // Profil görevi: Kullanıcı profil bilgileri varsa tamamlandı
      const profileTaskIndex = updatedTasks.findIndex(task => task.id === 2);
      if (profileTaskIndex !== -1) {
        const profileCompleted = !!(userData.name && userData.emailAddress);
        updatedTasks[profileTaskIndex] = {
          ...updatedTasks[profileTaskIndex],
          progress: profileCompleted ? 1 : 0,
          completed: userData.tasks?.completed?.includes(2) || profileCompleted
        };
      }
      
      // Davet görevi: Referans sayısına göre güncelle
      const inviteTaskIndex = updatedTasks.findIndex(task => task.id === 3);
      if (inviteTaskIndex !== -1) {
        const referralCount = userData.referralCount || 0;
        updatedTasks[inviteTaskIndex] = {
          ...updatedTasks[inviteTaskIndex],
          progress: Math.min(referralCount, updatedTasks[inviteTaskIndex].totalRequired),
          completed: userData.tasks?.completed?.includes(3) || false
        };
      }
      
      // Rozetleri güncelle
      const updatedBadges = [...badges];
      
      // İlk madenci rozeti: Herhangi bir madencilik yapıldıysa
      updatedBadges[0] = {
        ...updatedBadges[0],
        earned: userData.balance > 0,
        progress: userData.balance > 0 ? 100 : 0
      };
      
      // Madencilik profesyoneli: Bakiyeye göre ilerleme
      updatedBadges[1] = {
        ...updatedBadges[1],
        earned: userData.balance >= 50,
        progress: Math.min(Math.floor((userData.balance / 50) * 100), 100)
      };
      
      // Sosyal ağ uzmanı: Referans sayısına göre
      updatedBadges[2] = {
        ...updatedBadges[2],
        earned: (userData.referralCount || 0) >= 5,
        progress: Math.min(Math.floor(((userData.referralCount || 0) / 5) * 100), 100)
      };
      
      // Yükseltme uzmanı: Yükseltme sayısına göre
      const upgradeCount = userData.upgrades?.length || 0;
      updatedBadges[3] = {
        ...updatedBadges[3],
        earned: upgradeCount >= 3,
        progress: Math.min(Math.floor((upgradeCount / 3) * 100), 100)
      };
      
      setDailyTasks(updatedTasks);
      setBadges(updatedBadges);
    }
  }, [userData, t]);

  const claimReward = (taskId: string | number) => {
    if (!currentUser || !userData) {
      toast({
        title: t("tasks.loginRequired"),
        description: t("tasks.loginToClaimRewards"),
      });
      return;
    }
    
    const taskIndex = dailyTasks.findIndex(task => task.id.toString() === taskId.toString());
    if (taskIndex !== -1) {
      const task = dailyTasks[taskIndex];
      if (task.progress >= task.totalRequired && !task.completed) {
        // Görev tamamlandı olarak işaretle
        const newTasks = [...dailyTasks];
        newTasks[taskIndex] = { ...task, completed: true };
        setDailyTasks(newTasks);
        
        // Kullanıcı verisini güncelle
        const updatedUserData = {
          ...userData,
          balance: (userData.balance || 0) + task.reward,
          tasks: {
            ...(userData.tasks || {}),
            completed: [...(userData.tasks?.completed || []), task.id]
          }
        };
        
        // Veriyi kaydet
        saveUserData(updatedUserData, currentUser.uid);
        
        debugLog("useTasksData", `${task.reward} ödül kazanıldı, yeni bakiye: ${updatedUserData.balance}`);
        
        toast({
          title: t("tasks.rewardClaimed"),
          description: t("tasks.rewardClaimedDesc", task.reward.toString(), task.title),
        });
      } else if (task.completed) {
        toast({
          title: t("tasks.alreadyClaimed"),
          description: t("tasks.rewardAlreadyClaimed"),
        });
      } else {
        toast({
          title: t("tasks.incompleteTask"),
          description: t("tasks.completeTaskFirst"),
        });
      }
    }
  };

  return { dailyTasks, badges, claimReward };
};
