
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Sparkles, Gem } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { isDarkMode } = useTheme();

  return (
    <Card className="mb-6 overflow-hidden border-none shadow-xl transition-all duration-500 group bg-gradient-to-br from-indigo-900/90 via-blue-900/90 to-indigo-900/90">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabS0yMCAyMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptMC0yMGMwLTIuMjA5LTEuNzkxLTQtNC00cy00IDEuNzkxLTQgNCAxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNFptNDAgMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRabTAtMjBjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRaIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-cyan-500/10 animate-nebula-shift" style={{backgroundSize: '200% 200%', animationDuration: '8s'}}></div>
      
      {/* Glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* Content */}
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : 'pb-2'}`}>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
            <Gem className="h-4 w-4 text-blue-300" />
          </div>
          <span className="bg-gradient-to-r from-blue-100 to-cyan-200 bg-clip-text text-transparent">{t('balance.title')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-white`}>
                {balance.toFixed(3)}
              </span>
              <span className="ml-2 text-xl text-blue-300 font-medium">NC</span>
            </div>
            <p className="text-blue-200/80 mt-1 text-sm">{t('balance.total')}</p>
            
            {/* Data visualization bar */}
            <div className="relative mt-3">
              <div className="h-1 bg-blue-900/50 rounded-full w-full"></div>
              <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full absolute top-0 left-0" style={{width: `${Math.min(balance * 10, 100)}%`}}></div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="hidden md:block w-24 h-24 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/10 to-cyan-500/10 animate-pulse-slow"></div>
            <Coins className="w-full h-full text-blue-400/20" />
          </div>
        </div>
        
        {/* Stats chips */}
        <div className="flex gap-2 mt-4">
          <div className="bg-blue-900/30 px-2 py-1 rounded-md text-xs text-blue-200 border border-blue-500/20 backdrop-blur-sm">
            <span className="font-medium">Today: </span>
            <span className="text-cyan-300">+{(balance * 0.05).toFixed(2)} NC</span>
          </div>
          <div className="bg-blue-900/30 px-2 py-1 rounded-md text-xs text-blue-200 border border-blue-500/20 backdrop-blur-sm">
            <span className="font-medium">Week: </span>
            <span className="text-cyan-300">+{(balance * 0.23).toFixed(2)} NC</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
