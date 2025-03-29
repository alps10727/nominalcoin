
import { RefreshCw, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LoadingScreen = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-darkPurple-900 to-navy-900">
      <div className="text-center relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-darkPurple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-navy-500/30 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="relative flex items-center justify-center mb-4">
            {/* Spinning outer circle */}
            <div className="absolute w-24 h-24 rounded-full border-4 border-darkPurple-400/30 animate-spin-slow"></div>
            
            {/* Inner circle */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-darkPurple-700 to-navy-700 flex items-center justify-center shadow-lg">
              <RefreshCw className="h-8 w-8 text-darkPurple-300 animate-spin" />
            </div>
            
            {/* Decorative elements */}
            <Sparkles className="absolute top-0 right-0 h-5 w-5 text-darkPurple-400/70 animate-pulse" />
            <Sparkles className="absolute bottom-0 left-0 h-5 w-5 text-darkPurple-400/70 animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkPurple-300 to-navy-300">{t('app.title')}</h2>
          <p className="mt-2 text-darkPurple-400">Loading your experience...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
