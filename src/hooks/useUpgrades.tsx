
import { useState, useEffect } from "react";
import { Zap, TrendingUp, Coins, Bolt } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Upgrade } from "@/components/mining/UpgradeCard";
import { useAuth } from "@/contexts/AuthContext";

export function useUpgrades() {
  const { currentUser, userData, updateUserData } = useAuth();
  
  // Initialize with default values for new users - updated default mining rate to 0.1
  const [balance, setBalance] = useState(0);
  const [miningRate, setMiningRate] = useState(0.1);
  
  // Default upgrade configurations for new users
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "speed",
      title: "Mining Speed",
      description: "Decreases time needed for each mining cycle",
      level: 0, // Start at level 0 for new users
      maxLevel: 10,
      cost: 10,
      effect: "-10% time per level",
      icon: <Bolt className="h-5 w-5 text-yellow-400" />
    },
    {
      id: "rate",
      title: "Mining Rate",
      description: "Increases NC earned per mining cycle",
      level: 0, // Start at level 0 for new users
      maxLevel: 10,
      cost: 15,
      effect: "+0.005 NC per level",
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

  useEffect(() => {
    if (userData) {
      // Firebase'den gelen verileri kullan
      setBalance(userData.balance || 0);
      setMiningRate(userData.miningRate || 0.1);
      
      if (userData.upgrades && userData.upgrades.length > 0) {
        setUpgrades(userData.upgrades);
      } else if (userData.miningRate && userData.miningRate > 0.01) {
        // Eski veri formatı uyumluluğu için
        const currentRateLevel = Math.round((userData.miningRate - 0.01) / 0.005);
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
  }, [userData]);

  useEffect(() => {
    if (currentUser && userData) {
      updateUserData({
        balance: balance,
        miningRate: miningRate,
        upgrades: upgrades
      });
    }
  }, [balance, miningRate, upgrades, currentUser, updateUserData, userData]);

  const purchaseUpgrade = (upgradeId: string) => {
    if (!currentUser) {
      toast({
        title: "Giriş Gerekli",
        description: "Yükseltmeleri satın almak için giriş yapmalısınız.",
        variant: "destructive"
      });
      return;
    }
    
    const upgradeIndex = upgrades.findIndex(upgrade => upgrade.id === upgradeId);
    if (upgradeIndex !== -1) {
      const upgrade = upgrades[upgradeIndex];
      
      if (upgrade.level >= upgrade.maxLevel) {
        toast({
          title: "Maksimum Seviyeye Ulaşıldı",
          description: `${upgrade.title} zaten maksimum seviyede.`,
          variant: "destructive"
        });
        return;
      }
      
      if (balance >= upgrade.cost) {
        const newBalance = balance - upgrade.cost;
        setBalance(newBalance);
        
        const newUpgrades = [...upgrades];
        newUpgrades[upgradeIndex] = { 
          ...upgrade, 
          level: upgrade.level + 1,
          cost: Math.floor(upgrade.cost * 1.5)
        };
        setUpgrades(newUpgrades);
        
        if (upgradeId === "rate") {
          const newLevel = upgrade.level + 1;
          const newMiningRate = 0.01 + newLevel * 0.005;
          setMiningRate(newMiningRate);
          
          updateUserData({
            miningRate: newMiningRate,
            balance: newBalance,
            upgrades: newUpgrades
          });
        }
        
        toast({
          title: "Yükseltme Satın Alındı",
          description: `${upgrade.title} seviye ${upgrade.level + 1}'e yükseltildi`,
        });
      } else {
        toast({
          title: "Yetersiz Bakiye",
          description: `Bu yükseltmeyi satın almak için ${upgrade.cost} NC'ye ihtiyacınız var.`,
          variant: "destructive"
        });
      }
    }
  };

  return {
    balance,
    upgrades,
    purchaseUpgrade
  };
}
