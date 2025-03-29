
import { RefreshCw, Sparkles, Wifi, WifiOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const LoadingScreen = ({ message, forceOffline = false }: { message?: string, forceOffline?: boolean }) => {
  // Use try-catch to safely access the language context
  let translationFunction: (key: string, ...args: string[]) => string;
  try {
    const { t } = useLanguage();
    translationFunction = t;
  } catch (error) {
    // Fallback function if useLanguage fails
    translationFunction = (key: string) => {
      // Basic translations for loading screen when outside language context
      const fallbackTranslations: Record<string, string> = {
        'app.title': 'FutureMining',
      };
      return fallbackTranslations[key] || key;
    };
  }

  const [offlineDetected, setOfflineDetected] = useState(!navigator.onLine || forceOffline);
  const [loadingTime, setLoadingTime] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    forceOffline 
      ? "İnternet bağlantısı bulunamadı. Uygulama internet olmadan çalışmaz." 
      : message || "Yükleniyor..."
  );
  
  // Offline durumunu takip et
  useEffect(() => {
    if (forceOffline) {
      setOfflineDetected(true);
      setLoadingMessage("İnternet bağlantısı bulunamadı. Uygulama internet olmadan çalışmaz.");
      return;
    }

    const handleOnline = () => {
      setOfflineDetected(false);
      setLoadingMessage("Bağlantı kuruldu, yükleniyor...");
    };
    
    const handleOffline = () => {
      setOfflineDetected(true);
      setLoadingMessage("İnternet bağlantınız kapalı. Lütfen kontrol edin...");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Yükleme süresini takip et, daha hızlı feedback için
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 1;
        
        // Yükleme süresine göre mesajları güncelle (daha hızlı)
        if (!offlineDetected) {
          if (newTime === 2) {
            setLoadingMessage("Veriler yükleniyor...");
          } else if (newTime === 4) {
            setLoadingMessage("Yükleme beklenenden uzun sürüyor. Lütfen bekleyin...");
          } else if (newTime === 7) {
            setLoadingMessage("Sayfa yukleniyor, çok az kaldı...");
          }
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(timer);
    };
  }, [forceOffline, offlineDetected]);
  
  // Internet bağlantısı yoksa otomatik yenileme
  useEffect(() => {
    let reloadTimer: NodeJS.Timeout;
    
    if (offlineDetected && loadingTime > 10) {
      // İnternet yok ve uzun süredir bekliyorsa
      reloadTimer = setTimeout(() => {
        window.location.reload();
      }, 5000); // 5 saniye sonra yeniden dene
    }
    
    return () => {
      if (reloadTimer) clearTimeout(reloadTimer);
    };
  }, [loadingTime, offlineDetected]);
  
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
              {offlineDetected ? (
                <WifiOff className="h-8 w-8 text-red-400" />
              ) : (
                <RefreshCw className="h-8 w-8 text-darkPurple-300 animate-spin" />
              )}
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
            {translationFunction('app.title')}
          </h2>
          <p className="mt-2 text-darkPurple-400">
            {loadingMessage}
          </p>
          
          {/* Uzun süre yükleme durumunda bilgi göster */}
          {(loadingTime > 8 || forceOffline) && (
            <div className="mt-4 p-3 bg-darkPurple-800/50 border border-darkPurple-700 rounded-md text-sm text-darkPurple-300">
              {forceOffline ? (
                <p>Bu uygulama internet bağlantısı gerektirmektedir. Lütfen internet bağlantınızı açın ve sayfayı yenileyin.</p>
              ) : (
                <p>Sayfayı yenilemeyi deneyin veya daha sonra tekrar giriş yapmayı deneyin.</p>
              )}
              
              {(loadingTime > 10 && offlineDetected) && (
                <p className="mt-2 font-semibold">Sayfa otomatik olarak yenilenecek...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
