
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const ExploreButton = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/explore");
  };

  return (
    <Button 
      className="w-full bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-800 hover:to-purple-800 text-white shadow-md transition-all hover:shadow-lg border-none" 
      size="lg"
      onClick={handleExplore}
    >
      <span>{t('explore.button')}</span>
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default ExploreButton;
