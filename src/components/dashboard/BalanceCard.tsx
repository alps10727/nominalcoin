
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-900 via-indigo-800 to-purple-900"></div>
      
      {/* Light overlay effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-full blur-3xl transform translate-x-10 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 h-30 w-30 bg-violet-300/10 rounded-full blur-2xl transform -translate-x-10 translate-y-10"></div>
      </div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] bg-fixed opacity-[0.05] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Content */}
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-200 opacity-80" />
          {t('balance.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-baseline">
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-white`}>{balance.toFixed(3)}</span>
          <span className="ml-2 text-xl text-violet-200 font-medium">FC</span>
        </div>
        <p className="text-indigo-200 mt-2 opacity-80 text-sm">{t('balance.total')}</p>
        
        {/* Highlight bar */}
        <div className="mt-3 h-1 w-1/3 bg-gradient-to-r from-violet-400 to-transparent rounded-full"></div>
      </CardContent>
      
      {/* Decorative coin icon */}
      <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
        <Coins className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} text-white`} />
      </div>
    </Card>
  );
};

export default BalanceCard;
