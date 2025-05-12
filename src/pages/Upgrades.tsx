
import React from "react";
import { Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

// Export the Mission interface so it can be used by other components
export interface Mission {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  total: number;
  reward: number;
  claimed: boolean;
}

const Upgrades = () => {
  const { t } = useLanguage();
  
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="w-full min-h-[100dvh] px-4 py-6 relative">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold fc-gradient-text flex items-center">
          <Gift className="mr-2 h-6 w-6 text-indigo-400" />
          {t("missions.title")}
        </h1>
        <p className="text-gray-400">
          {t("missions.subtitle")}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex flex-col items-center justify-center p-10 bg-navy-800/50 border border-navy-700 rounded-lg">
          <p className="text-gray-300 mb-3">Görevler şu an için devre dışı bırakılmıştır.</p>
          <Button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
          >
            Yenile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Upgrades;
