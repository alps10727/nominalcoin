
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
    <Card className="mb-6 overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-800 to-indigo-900 opacity-95"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.05] pointer-events-none"></div>
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className="text-lg font-medium text-gray-100">{t('balance.title')}</CardTitle>
      </CardHeader>
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-baseline">
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-white`}>{balance.toFixed(3)}</span>
          <span className="ml-2 text-xl text-violet-200">FC</span>
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
