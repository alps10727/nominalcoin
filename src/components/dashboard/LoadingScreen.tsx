
import { RefreshCw, Zap, Wifi, WifiOff } from "lucide-react";
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
        'loading.message': 'Yükleniyor...',
        'loading.offline': 'Çevrimdışı',
        'loading.reconnecting': 'Yeniden bağlanıyor...'
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
  
  // Improved offline state tracking
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
    
    // More responsive loading feedback
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 1;
        
        if (!offlineDetected) {
          // More optimistic loading messages
          if (newTime === 1) {
            setLoadingMessage("Veriler hazırlanıyor...");
          } else if (newTime === 3) {
            setLoadingMessage("Neredeyse hazır...");
          } else if (newTime === 5) {
            setLoadingMessage("Son birkaç saniye...");
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
  
  // Faster auto-reload when offline
  useEffect(() => {
    let reloadTimer: NodeJS.Timeout;
    
    if (offlineDetected && loadingTime > 8) {  // Reduced from 10 to 8 seconds
      reloadTimer = setTimeout(() => {
        window.location.reload();
      }, 3000); // Reduced from 5000ms to 3000ms
    }
    
    return () => {
      if (reloadTimer) clearTimeout(reloadTimer);
    };
  }, [loadingTime, offlineDetected]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      <div className="text-center relative">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl animate-pulse" style={{animationDuration: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <div className="relative flex items-center justify-center mb-4">
            {/* More dynamic animations */}
            <div className="absolute w-24 h-24 rounded-full border-4 border-t-teal-400/80 border-r-teal-400/50 border-b-teal-400/30 border-l-teal-400/10 animate-spin-slow"></div>
            
            {/* Inner circle with better contrast */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center shadow-lg">
              {offlineDetected ? (
                <WifiOff className="h-8 w-8 text-red-300" />
              ) : (
                <RefreshCw className="h-8 w-8 text-teal-200 animate-spin" />
              )}
            </div>
            
            {/* Better decoration elements */}
            <Zap className="absolute top-0 right-0 h-5 w-5 text-teal-300/90 animate-pulse" />
            <Zap className="absolute bottom-0 left-0 h-5 w-5 text-teal-300/90 animate-pulse" style={{animationDelay: '0.5s'}} />
            <Zap className="absolute top-4 left-4 h-3 w-3 text-teal-300/70 animate-pulse" style={{animationDelay: '1s'}} />
            
            {/* Improved offline indicator */}
            {offlineDetected && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center text-red-300 bg-red-900/30 px-3 py-1 rounded-full text-xs font-medium">
                <WifiOff className="h-3 w-3 mr-1.5" />
                Offline
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">
            {translationFunction('app.title')}
          </h2>
          <p className="mt-2 text-teal-300 font-medium">
            {loadingMessage}
          </p>
          
          {/* More informative loading state for long waits */}
          {(loadingTime > 6 || forceOffline) && (
            <div className="mt-4 p-3 bg-teal-800/20 border border-teal-700/30 rounded-md text-sm text-teal-300">
              {forceOffline ? (
                <p>Bu uygulama internet bağlantısı gerektirmektedir. Lütfen internet bağlantınızı açın ve sayfayı yenileyin.</p>
              ) : (
                <p>Sayfayı yenilemeyi deneyin veya daha sonra tekrar giriş yapmayı deneyin.</p>
              )}
              
              {(loadingTime > 8 && offlineDetected) && (
                <p className="mt-2 font-semibold text-teal-200">Sayfa otomatik olarak yenilenecek...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
