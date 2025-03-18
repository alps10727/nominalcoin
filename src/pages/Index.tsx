
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import GameCard from "@/components/dashboard/GameCard";
import DashboardActions from "@/components/dashboard/DashboardActions";
import ExploreButton from "@/components/dashboard/ExploreButton";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check if user navigated to /game and redirect to home
    if (location.pathname === "/game") {
      navigate("/");
      // Show a toast to inform the user
      setTimeout(() => {
        toast({
          title: t('game.title'),
          description: "Game feature is coming soon!"
        });
      }, 500);
    }
  }, [location.pathname, navigate, t]);

  const handlePlayGame = () => {
    toast({
      title: t('game.title'),
      description: "Game feature is coming soon!"
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <BalanceCard />
        <MiningCard />
        <GameCard onPlay={handlePlayGame} />
        <DashboardActions />
        <ExploreButton />
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
