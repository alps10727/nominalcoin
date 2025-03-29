
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
      {/* Main background */}
      <div className="absolute inset-0 bg-gradient-to-r from-darkPurple-700/90 via-navy-600/90 to-darkPurple-700/90"></div>
      
      {/* Glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
      
      {/* Animated light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-darkPurple-400/10 rounded-full blur-3xl transform translate-x-10 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-navy-400/10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>
        
        {/* Subtle moving glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-darkPurple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
      </div>
      
      {/* Content */}
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : ''}`}>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-darkPurple-700/50 rounded-lg">
            <Sparkles className="h-4 w-4 text-darkPurple-300" />
          </div>
          {t('balance.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-baseline">
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkPurple-200 to-white`}>
            {balance.toFixed(3)}
          </span>
          <span className="ml-2 text-xl text-darkPurple-300 font-medium">FC</span>
        </div>
        <p className="text-navy-200 mt-2 opacity-80 text-sm">{t('balance.total')}</p>
        
        {/* Highlight bar with glowing effect */}
        <div className="relative mt-3">
          <div className="h-1 w-1/3 bg-gradient-to-r from-darkPurple-400 to-navy-600 rounded-full"></div>
          <div className="absolute inset-0 h-1 w-1/3 bg-gradient-to-r from-darkPurple-400 to-navy-600 rounded-full blur-sm"></div>
        </div>
      </CardContent>
      
      {/* Decorative coin icon */}
      <div className="absolute bottom-0 right-0 p-6 opacity-10 transition-opacity duration-500">
        <Coins className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} text-white`} />
      </div>
    </Card>
  );
};

export default BalanceCard;
