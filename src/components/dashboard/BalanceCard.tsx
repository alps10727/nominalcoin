
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
    <Card className="mb-6 overflow-hidden border-none shadow-xl hover:shadow-glow-lg transition-all duration-500 group">
      {/* Main background with cosmic effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-darkPurple-800/95 via-navy-800/95 to-darkPurple-800/95"></div>
      
      {/* Animated nebula background */}
      <div className="absolute inset-0 opacity-40 nebula-bg"></div>
      
      {/* Glass effect */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/5"></div>
      
      {/* Star particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-star-twinkle" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Subtle moving glow */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-darkPurple-500/30 rounded-full blur-3xl animate-cosmic-pulse"></div>
        </div>
      </div>
      
      {/* Content */}
      <CardHeader className={`relative z-10 ${isMobile ? 'px-4 py-3' : 'pb-2'}`}>
        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
          <div className="p-1.5 bg-darkPurple-700/50 rounded-lg border border-darkPurple-600/30 shadow-glow">
            <Gem className="h-4 w-4 text-darkPurple-300" />
          </div>
          <span className="text-shadow">{t('balance.title')}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`relative z-10 ${isMobile ? 'px-4 pb-4' : ''}`}>
        <div className="flex items-baseline">
          <span className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold gradient-text animate-nebula-shift`}>
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
      
      {/* Decorative coin icon with animation */}
      <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:opacity-15 transition-opacity duration-500">
        <Coins className={`${isMobile ? 'h-24 w-24' : 'h-32 w-32'} text-white animate-cosmic-pulse`} style={{animationDuration: '8s'}} />
      </div>
    </Card>
  );
};

export default BalanceCard;
