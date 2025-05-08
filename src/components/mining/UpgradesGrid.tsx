
import React from "react";
import UpgradeCard, { Upgrade } from "./UpgradeCard";

interface UpgradesGridProps {
  upgrades: Upgrade[];
  balance: number;
  onPurchase: (upgradeId: string) => void;
}

const UpgradesGrid = ({ upgrades, balance, onPurchase }: UpgradesGridProps) => {
  // Add a safety check to ensure upgrades is always an array
  const safeUpgrades = Array.isArray(upgrades) ? upgrades : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {safeUpgrades.map(upgrade => (
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
