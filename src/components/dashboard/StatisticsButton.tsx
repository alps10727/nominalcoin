
import { Button } from "@/components/ui/button";
import { BarChart2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const StatisticsButton = () => {
  const { t } = useLanguage();
  
  return (
    <Link to="/statistics">
      <Button 
        className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg border-none" 
        size="lg"
      >
        <BarChart2 className="mr-2 h-5 w-5" />
        <span>{t('stats.title')}</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
  );
};

export default StatisticsButton;
