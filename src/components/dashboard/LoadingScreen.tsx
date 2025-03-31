
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
    
    if (offlineDetected && loadingTime > 8) {
      reloadTimer = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    
    return () => {
      if (reloadTimer) clearTimeout(reloadTimer);
    };
  }, [loadingTime, offlineDetected]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950">
      <div className="text-center relative">
        {/* Enhanced cosmic background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{animationDuration: '6s'}}></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-violet-400/10 rounded-full blur-xl animate-pulse" style={{animationDuration: '8s'}}></div>
        </div>
        
        {/* Scattered stars */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.2,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <div className="relative flex items-center justify-center mb-8">
            {/* Outer orbit */}
            <div className="absolute w-32 h-32 rounded-full border border-indigo-400/30 animate-spin" style={{animationDuration: '12s'}}></div>
            <div className="absolute w-32 h-32 rounded-full border border-indigo-400/30 animate-spin" style={{animationDuration: '12s', animationDelay: '1s', transform: 'rotate(45deg)'}}></div>
            
            {/* Orbital particles */}
            <div className="absolute w-2 h-2 rounded-full bg-purple-400 top-1/2 left-0 animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300 bottom-0 right-1/2 animate-bounce" style={{animationDuration: '2.5s'}}></div>
            
            {/* Inner circle with animated glow */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-800 to-purple-900 flex items-center justify-center shadow-[0_0_15px_rgba(129,140,248,0.5)]">
              {offlineDetected ? (
                <WifiOff className="h-8 w-8 text-red-300" />
              ) : (
                <div className="relative">
                  <RefreshCw className="h-8 w-8 text-indigo-200 animate-spin" />
                  <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <Sparkles className="absolute top-0 right-4 h-5 w-5 text-purple-300/90 animate-pulse" />
            <Sparkles className="absolute bottom-4 left-0 h-5 w-5 text-indigo-300/90 animate-pulse" style={{animationDelay: '0.5s'}} />
            
            {/* Improved offline indicator */}
            {offlineDetected && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center text-red-300 bg-red-900/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium border border-red-500/30">
                <WifiOff className="h-3 w-3 mr-1.5" />
                <span className="tracking-wider">Offline</span>
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 mb-2">
            {translationFunction('app.title')}
          </h2>
          <p className="text-indigo-200 font-medium">
            {loadingMessage}
          </p>
          
          {/* More informative loading state for long waits */}
          {(loadingTime > 6 || forceOffline) && (
            <div className="mt-6 p-4 backdrop-blur-md bg-indigo-900/30 border border-indigo-700/40 rounded-xl text-sm text-indigo-200 max-w-xs mx-auto">
              {forceOffline ? (
                <p>Bu uygulama internet bağlantısı gerektirmektedir. Lütfen internet bağlantınızı açın ve sayfayı yenileyin.</p>
              ) : (
                <p>Sayfayı yenilemeyi deneyin veya daha sonra tekrar giriş yapmayı deneyin.</p>
              )}
              
              {(loadingTime > 8 && offlineDetected) && (
                <p className="mt-2 font-semibold text-indigo-100">Sayfa otomatik olarak yenilenecek...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
