
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface BalanceCardProps {
  balance: number;
}

const BalanceCard = ({ balance }: BalanceCardProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const formattedBalance = balance < 1 
    ? balance.toFixed(3)
    : balance.toFixed(2);
  
  return (
    <Card className="overflow-hidden relative border-none shadow-md bg-gradient-to-r from-indigo-900/90 to-purple-900/90">
      <div className="absolute inset-0 opacity-5 bg-grid-pattern"></div>
      
      <CardContent className={`p-6 relative z-10 ${isMobile ? "px-4 py-5" : ""}`}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-800 to-purple-900">
                <CreditCard className="h-4 w-4 text-indigo-300" />
              </div>
              <span className="text-sm text-indigo-300 font-medium">
                {t('wallet.balance')}
              </span>
            </div>
            
            <div className="flex items-end mt-2">
              <span className="text-3xl sm:text-4xl font-bold text-white mr-1">
                {formattedBalance}
              </span>
              <span className="text-lg sm:text-xl text-indigo-300 font-medium mb-0.5">
                NC
              </span>
            </div>
            
            <p className="text-xs text-indigo-300/70 mt-2">
              NOMINAL Coin
            </p>
          </div>
          
          <div className="hidden sm:block">
            <div className="p-3 rounded-lg bg-indigo-900/50 border border-indigo-700/30 backdrop-blur-sm">
              <img 
                src={theme === 'dark' ? "/assets/nc-logo-dark.svg" : "/assets/nc-logo-light.svg"} 
                alt="NC Logo" 
                className="h-8 w-8"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;

