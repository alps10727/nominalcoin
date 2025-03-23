
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gray-800 dark:bg-gray-850">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90"></div>
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className="text-lg font-medium text-gray-200">{t('balance.title')}</CardTitle>
      </CardHeader>
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-baseline">
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-white`}>{balance.toFixed(2)}</span>
          <span className="ml-2 text-xl text-indigo-200">FC</span>
        </div>
        <p className="text-indigo-200 mt-2 opacity-80">{t('balance.total')}</p>
      </CardContent>
      <div className="absolute bottom-0 right-0 p-6 opacity-10">
        <Coins className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} text-white`} />
      </div>
    </Card>
  );
};

export default BalanceCard;
