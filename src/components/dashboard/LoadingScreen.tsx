
import { RefreshCw, Sparkles, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const LoadingScreen = ({ message }: { message?: string }) => {
  const { t } = useLanguage();
  const [offlineDetected, setOfflineDetected] = useState(!navigator.onLine);
  const [loadingTime, setLoadingTime] = useState(0);
  
  // Offline durumunu takip et
  useEffect(() => {
    const handleOnline = () => setOfflineDetected(false);
    const handleOffline = () => setOfflineDetected(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Yükleme süresini takip et, 5 saniyeden fazla sürerse farklı mesaj göster
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, []);
  
  // Yükleme mesajını belirle
  const getLoadingMessage = () => {
    if (offlineDetected) {
      return "İnternet bağlantınız kapalı. Lütfen kontrol edin...";
    }
    
    if (loadingTime > 10) {
      return "Yükleme beklenenden uzun sürüyor. Lütfen bekleyin...";
    }
    
    if (loadingTime > 5) {
      return "Veriler yükleniyor...";
    }
    
    return message || "Loading your experience...";
  };
  
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
            
            {/* Offline indicator */}
            {offlineDetected && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center text-red-400 bg-red-900/20 px-2 py-1 rounded-full text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkPurple-300 to-navy-300">
            {t('app.title')}
          </h2>
          <p className="mt-2 text-darkPurple-400">
            {getLoadingMessage()}
          </p>
          
          {/* Uzun süre yükleme durumunda ipucu göster */}
          {loadingTime > 15 && (
            <div className="mt-4 p-3 bg-darkPurple-800/50 border border-darkPurple-700 rounded-md text-sm text-darkPurple-300">
              <p>Sayfayı yenilemeyi deneyin veya daha sonra tekrar giriş yapmayı deneyin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
