
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import UpgradesGrid from "@/components/mining/UpgradesGrid";
import { useUpgrades } from "@/hooks/useUpgrades";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext"; // Changed from useAuth
import { Zap } from "lucide-react";

const MiningUpgrades = () => {
  const { upgrades, purchaseUpgrade } = useUpgrades();
  const { userData } = useSupabaseAuth(); // Changed from useAuth
  const balance = userData?.balance || 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30">
          <Zap className="h-6 w-6 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold fc-gradient-text">Mining Upgrades</h1>
      </div>
      
      <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <p className="text-gray-300 mb-6">
            Increase your mining power by purchasing upgrades. Each upgrade will boost your mining rate.
          </p>
          
          <UpgradesGrid 
            upgrades={upgrades} 
            balance={balance} 
            onPurchase={purchaseUpgrade} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MiningUpgrades;
