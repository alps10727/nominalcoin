
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all border-none relative overflow-hidden group"
        size="lg"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600/5 to-purple-600/5 group-hover:scale-75 transition-transform duration-700"></span>
        <span className="relative z-10 flex items-center justify-center">
          <BarChart2 className="mr-2 h-5 w-5" />
          <span>{t('stats.title')}</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </Button>
    </Link>
  );
};

export default StatisticsButton;
