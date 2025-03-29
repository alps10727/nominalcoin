
import React from "react";
import UpgradeCard, { Upgrade } from "./UpgradeCard";

interface UpgradesGridProps {
  upgrades: Upgrade[];
  balance: number;
  onPurchase: (upgradeId: string) => void;
}

const UpgradesGrid = ({ upgrades, balance, onPurchase }: UpgradesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {upgrades.map(upgrade => (
        <UpgradeCard 
          key={upgrade.id} 
          upgrade={upgrade} 
          balance={balance} 
          onPurchase={onPurchase}
        />
      ))}
    </div>
  );
};

export default UpgradesGrid;
