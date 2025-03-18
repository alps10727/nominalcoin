
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import BalanceCard from "@/components/dashboard/BalanceCard";
import MiningCard from "@/components/dashboard/MiningCard";
import GameCard from "@/components/dashboard/GameCard";
import DashboardActions from "@/components/dashboard/DashboardActions";
import ExploreButton from "@/components/dashboard/ExploreButton";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 to-indigo-950 dark:from-gray-950 dark:to-indigo-950 flex flex-col`}>
      <Header />

      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <BalanceCard />
        <MiningCard />
        <GameCard />
        <DashboardActions />
        <ExploreButton />
      </main>

      <MobileNavigation />
    </div>
  );
};

export default Index;
