
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAdMob } from "@/hooks/useAdMob";
import { useCallback } from "react";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";

interface MenuCardProps {
  title: string;
  icon: LucideIcon;
  to: string;
  showAd?: boolean;
}

const MenuCard = ({ title, icon: Icon, to, showAd }: MenuCardProps) => {
  const isMobile = useIsMobile();
  const { showInterstitialAd } = useAdMob();

  const handleClick = useCallback(async (e: React.MouseEvent) => {
    if (showAd) {
      e.preventDefault();
      
      try {
        debugLog("MenuCard", `Displaying interstitial ad before navigating to ${to}`);
        const success = await showInterstitialAd();
        debugLog("MenuCard", "Ad display result:", success);
        // Using a small timeout to ensure ad has time to complete
        setTimeout(() => {
          debugLog("MenuCard", `Navigating to ${to} after ad`);
          window.location.href = to;
        }, 300);
      } catch (error) {
        console.error('Ad display error:', error);
        toast.error("Reklam yüklenemedi, devam ediliyor...");
        window.location.href = to;
      }
    }
  }, [showAd, to, showInterstitialAd]);

  return (
    <Link to={to} onClick={showAd ? handleClick : undefined}>
      <Card className="border-0 shadow-md transition-all duration-300 cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-darkPurple-900 to-navy-900 hover:from-darkPurple-800 hover:to-navy-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-purple-500/10 rounded-full blur-xl transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        
        <div className={`${isMobile ? 'p-3' : 'p-4'} relative z-10 flex justify-between items-center text-white`}>
          <div className="flex items-center">
            <div className={`${isMobile ? 'p-1.5' : 'p-2'} rounded-xl bg-purple-500/20 mr-3 border border-purple-400/10 transition-colors duration-300 group-hover:bg-purple-500/30 group-hover:border-purple-400/20`}>
              <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-300 transition-colors duration-300 group-hover:text-purple-200`} />
            </div>
            <span className={`${isMobile ? 'text-sm' : 'text-md'} font-medium transition-colors duration-300 group-hover:text-purple-200`}>{title}</span>
          </div>
          <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-400/50 group-hover:text-purple-300 transition-all duration-300 transform group-hover:translate-x-0.5`} />
        </div>
      </Card>
    </Link>
  );
};

export default MenuCard;
