import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, TrendingUp, Coins, Bolt, BarChart, CornerRightUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface Upgrade {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  effect: string;
  icon: JSX.Element;
}

interface UserData {
  balance: number;
  miningRate: number;
  lastSaved: number;
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: Upgrade[];
}

const MiningUpgrades = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [balance, setBalance] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "speed",
      title: "Mining Speed",
      description: "Decreases time needed for each mining cycle",
      level: 2,
      maxLevel: 10,
      cost: 10,
      effect: "-10% time per level",
      icon: <Bolt className="h-5 w-5 text-yellow-400" />
    },
    {
      id: "rate",
      title: "Mining Rate",
      description: "Increases FC earned per mining cycle",
      level: 1,
      maxLevel: 10,
      cost: 15,
      effect: "+0.05 FC per level",
      icon: <TrendingUp className="h-5 w-5 text-green-400" />
    },
    {
      id: "efficiency",
      title: "Energy Efficiency",
      description: "Reduces energy consumption during mining",
      level: 0,
      maxLevel: 5,
      cost: 20,
      effect: "-5% energy per level",
      icon: <Zap className="h-5 w-5 text-indigo-400" />
    },
    {
      id: "bonus",
      title: "Luck Bonus",
      description: "Chance to get double rewards",
      level: 0,
      maxLevel: 5,
      cost: 25,
      effect: "+5% chance per level",
      icon: <Coins className="h-5 w-5 text-purple-400" />
    },
  ]);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('fcMinerUserData');
      if (savedData) {
        const userData: UserData = JSON.parse(savedData);
        setBalance(userData.balance);
        setMiningRate(userData.miningRate);
        
        // Load saved upgrades if available
        if (userData.upgrades) {
          setUpgrades(userData.upgrades);
        } else {
          // Initialize rate upgrade level based on mining rate
          const currentRateLevel = Math.round((userData.miningRate - 0.1) / 0.05);
          if (currentRateLevel > 0) {
            const updatedUpgrades = [...upgrades];
            const rateUpgradeIndex = updatedUpgrades.findIndex(u => u.id === "rate");
            if (rateUpgradeIndex !== -1) {
              updatedUpgrades[rateUpgradeIndex].level = currentRateLevel;
              setUpgrades(updatedUpgrades);
            }
          }
        }
      }
    } catch (err) {
      console.error('Kullanıcı verisi yüklenirken hata oluştu:', err);
    }
  }, []);

  // Save data when balance or upgrades change
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('fcMinerUserData');
      if (savedData) {
        const userData: UserData = JSON.parse(savedData);
        const updatedUserData = {
          ...userData,
          balance: balance,
          miningRate: miningRate,
          upgrades: upgrades
        };
        localStorage.setItem('fcMinerUserData', JSON.stringify(updatedUserData));
      }
    } catch (err) {
      console.error('Kullanıcı verisi kaydedilirken hata oluştu:', err);
    }
  }, [balance, miningRate, upgrades]);

  const purchaseUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex(upgrade => upgrade.id === upgradeId);
    if (upgradeIndex !== -1) {
      const upgrade = upgrades[upgradeIndex];
      
      if (upgrade.level >= upgrade.maxLevel) {
        toast({
          title: "Maximum Level Reached",
          description: `${upgrade.title} is already at maximum level.`,
          variant: "destructive"
        });
        return;
      }
      
      if (balance >= upgrade.cost) {
        setBalance(prev => prev - upgrade.cost);
        
        const newUpgrades = [...upgrades];
        newUpgrades[upgradeIndex] = { 
          ...upgrade, 
          level: upgrade.level + 1,
          cost: Math.floor(upgrade.cost * 1.5) // Increase cost for next level
        };
        setUpgrades(newUpgrades);
        
        // Update mining rate for rate upgrades
        if (upgradeId === "rate") {
          const newLevel = upgrade.level + 1;
          const newMiningRate = 0.1 + newLevel * 0.05; // Base rate + level bonus
          setMiningRate(newMiningRate);
          
          try {
            const savedData = localStorage.getItem('fcMinerUserData');
            if (savedData) {
              const userData: UserData = JSON.parse(savedData);
              const updatedUserData = {
                ...userData,
                miningRate: newMiningRate,
                balance: balance - upgrade.cost,
                upgrades: newUpgrades
              };
              localStorage.setItem('fcMinerUserData', JSON.stringify(updatedUserData));
            }
          } catch (err) {
            console.error('Mining rate update failed:', err);
          }
        }
        
        toast({
          title: "Upgrade Purchased",
          description: `${upgrade.title} upgraded to level ${upgrade.level + 1}`,
        });
      } else {
        toast({
          title: "Insufficient Funds",
          description: `You need ${upgrade.cost} FC to purchase this upgrade.`,
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{t('mining.upgrades')}</h1>
          <div className="flex items-center bg-gray-800/80 px-3 py-1 rounded-full">
            <Coins className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300 font-medium">{balance.toFixed(2)} FC</span>
          </div>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gray-800 text-gray-100 dark:bg-gray-850">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart className="h-5 w-5 text-indigo-400" />
              {t('mining.upgrades')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upgrade your mining capabilities to earn more FC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upgrades.map(upgrade => (
                <Card key={upgrade.id} className="border border-gray-700 bg-gray-850">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-gray-800 mr-3">
                          {upgrade.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-200">{upgrade.title}</h3>
                          <p className="text-xs text-gray-400">{upgrade.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{t('mining.level', upgrade.level.toString())} / {upgrade.maxLevel}</span>
                        <span>{upgrade.effect}</span>
                      </div>
                      <Progress value={(upgrade.level / upgrade.maxLevel) * 100} className="h-2 bg-gray-700" />
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-300">
                        {t('mining.cost', upgrade.cost.toString())}
                      </div>
                      <Button 
                        size="sm" 
                        className={`${
                          upgrade.level >= upgrade.maxLevel 
                            ? 'bg-gray-700 hover:bg-gray-700 cursor-not-allowed' 
                            : balance >= upgrade.cost 
                              ? 'bg-indigo-600 hover:bg-indigo-700' 
                              : 'bg-red-900/50 hover:bg-red-900 cursor-not-allowed'
                        } h-8`}
                        onClick={() => purchaseUpgrade(upgrade.id)}
                        disabled={upgrade.level >= upgrade.maxLevel}
                      >
                        <CornerRightUp className="h-4 w-4 mr-1" />
                        {t('mining.upgrade')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <MobileNavigation />
    </div>
  );
};

export default MiningUpgrades;
