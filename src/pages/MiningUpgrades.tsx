
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUpgrades } from "@/hooks/useUpgrades";
import UpgradesGrid from "@/components/mining/UpgradesGrid";

const MiningUpgrades = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { balance, upgrades, purchaseUpgrade } = useUpgrades();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{t('mining.upgrades')}</h1>
          <div className="flex items-center bg-navy-800/80 px-3 py-1 rounded-full">
            <Coins className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-yellow-300 font-medium">{balance.toFixed(2)} FC</span>
          </div>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-navy-900 text-gray-100 dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart className="h-5 w-5 text-teal-400" />
              {t('mining.upgrades')}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Upgrade your mining capabilities to earn more FC
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UpgradesGrid 
              upgrades={upgrades} 
              balance={balance} 
              onPurchase={purchaseUpgrade} 
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MiningUpgrades;
