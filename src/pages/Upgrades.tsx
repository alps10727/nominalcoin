import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Star, Medal, Gift, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog } from "@/utils/debugUtils";
import CoinGame from "@/components/upgrades/CoinGame";
import { supabase } from "@/integrations/supabase/client";
import MissionItem from "@/components/upgrades/MissionItem";

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
  const [activeTab, setActiveTab] = useState("missions");
  
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
      id: "game-points",
      title: "Oyunda 500 Puan Kazan",
      description: "Mini oyunumuzda en az 500 puan topla ve 15 NC kazan",
      reward: 15,
      progress: 0,
      total: 500,
      completed: false,
      claimed: false,
      icon: <Rocket className="h-5 w-5 text-purple-400" />
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

  const [gameScore, setGameScore] = useState<number>(0);
  
  const onGameEnd = (score: number) => {
    setGameScore(prevScore => prevScore + score);
    
    updateMissionProgress("game-points", score);
    
    toast.success(`+${score} puan kazandın!`);
  };
  
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
    
    try {
      setIsLoading(true);
      
      const currentBalance = userData?.balance || 0;
      const newBalance = currentBalance + mission.reward;
      
      const { error } = await supabase.rpc('update_user_balance', {
        p_user_id: currentUser.id,
        p_amount: mission.reward,
        p_reason: `Görev tamamlandı: ${mission.title}`
      });
      
      if (error) throw error;
      
      if (updateUserData) {
        await updateUserData({
          balance: newBalance
        });
      }
      
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
          Çeşitli görevleri tamamlayarak ve mini oyunları oynayarak ekstra NC coin kazanın.
        </p>
      </div>

      <Tabs defaultValue="missions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="missions">Görevler</TabsTrigger>
          <TabsTrigger value="games">Mini Oyun</TabsTrigger>
        </TabsList>
        
        <TabsContent value="missions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {missions.map(mission => (
              <MissionItem 
                key={mission.id} 
                mission={mission} 
                onClaim={() => claimReward(mission)}
                onConnect={mission.id === "social-twitter" ? connectTwitter : undefined}
                isLoading={isLoading}
              />
            ))}
          </div>
          
          <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Medal className="mr-2 h-5 w-5 text-yellow-500" />
                Günlük Bonus
              </CardTitle>
              <CardDescription>
                Her gün giriş yaparak bonus NC kazanabilirsiniz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Gift className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold">+2 NC</p>
                    <p className="text-sm text-gray-400">Günlük bonus</p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                  Talep Et <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="games" className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/30">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="mr-2 h-5 w-5 text-indigo-400" />
                Uzay Madeni
              </CardTitle>
              <CardDescription>
                Uzayda uçarak coinleri topla ve ekstra NC kazan!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Toplam Puan: <span className="text-white font-bold">{gameScore}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Gorev İlerlemesi: <span className="text-white font-bold">
                    {Math.min(gameScore, 500)}/500
                  </span>
                </div>
              </div>
              
              <Progress 
                value={(Math.min(gameScore, 500) / 500) * 100} 
                className="h-2 mb-6" 
              />
              
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-indigo-500/30">
                <CoinGame onGameEnd={onGameEnd} />
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-sm text-gray-400 mt-4">
            <p>Daha fazla mini oyun yakında eklenecek...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Upgrades;
