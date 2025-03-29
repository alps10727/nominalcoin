
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CornerRightUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Upgrade {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  effect: string;
  icon: JSX.Element;
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  balance: number;
  onPurchase: (upgradeId: string) => void;
}

const UpgradeCard = ({ upgrade, balance, onPurchase }: UpgradeCardProps) => {
  const { t } = useLanguage();

  return (
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
            onClick={() => onPurchase(upgrade.id)}
            disabled={upgrade.level >= upgrade.maxLevel}
          >
            <CornerRightUp className="h-4 w-4 mr-1" />
            {t('mining.upgrade')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
