
import { RefreshCw, Sparkles, Wifi, WifiOff, RotateCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const LoadingScreen = ({ 
  message, 
  forceOffline = false 
}: { 
  message?: string, 
  forceOffline?: boolean 
}) => {
  let translationFunction: (key: string, ...args: string[]) => string;
  try {
    const { t } = useLanguage();
    translationFunction = t;
  } catch (error) {
    translationFunction = (key: string) => {
      const fallbackTranslations: Record<string, string> = {
        'app.title': 'NOMINAL Coin',
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
      ? "İnternet bağlantısı bulunamadı. Çevrimdışı modda çalışmaya devam edebilirsiniz." 
      : message || "Yükleniyor..."
  );
  
  useEffect(() => {
    // Force offline durumu kontrol et
    if (forceOffline) {
      setOfflineDetected(true);
      setLoadingMessage("İnternet bağlantısı bulunamadı. Çevrimdışı modda çalışmaya devam edebilirsiniz.");
      return;
    }

    // Bağlantı durumu event listener'ları
    const handleOnline = () => {
      setOfflineDetected(false);
      setLoadingMessage("Bağlantı kuruldu, yükleniyor...");
    };
    
    const handleOffline = () => {
      setOfflineDetected(true);
      setLoadingMessage("İnternet bağlantınız kapalı. Çevrimdışı modda devam ediliyor...");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Yükleme zamanlayıcısı - hızlandırıldı
    const timer = setInterval(() => {
      setLoadingTime(prev => {
        const newTime = prev + 1;
        
        if (!offlineDetected) {
          if (newTime === 3) {
            setLoadingMessage("Neredeyse hazır...");
          } else if (newTime === 6) {
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
  }, [forceOffline, offlineDetected, message]);
  
  // Otomatik yeniden başlatma mekanizması - süre uzatıldı
  useEffect(() => {
    let reloadTimer: NodeJS.Timeout;
    
    if (loadingTime > 20) {
      reloadTimer = setTimeout(() => {
        // Yenileme girişimini bildir ve yenilemeyi gerçekleştir
        setLoadingMessage("Sayfa yanıt vermiyor, yeniden yükleniyor...");
        window.location.reload();
      }, 3000);
    }
    
    return () => {
      if (reloadTimer) clearTimeout(reloadTimer);
    };
  }, [loadingTime]);
  
  const handleManualReload = () => {
    setLoadingMessage("Yenileniyor...");
    window.location.reload();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="text-center relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDuration: '5s'}}></div>
        </div>
        
        {/* Subtle stars/particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.2,
                animationDuration: `${2 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Main loading animation */}
        <div className="relative flex flex-col items-center justify-center mb-10">
          {/* Outer rotating ring */}
          <div className="absolute w-36 h-36 border border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '10s'}}></div>
          <div className="absolute w-32 h-32 border border-purple-300/30 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
          
          {/* Star decorations */}
          <Sparkles className="absolute top-0 right-12 h-5 w-5 text-purple-300/80 animate-pulse" style={{animationDuration: '3s'}} />
          <Sparkles className="absolute bottom-10 left-6 h-4 w-4 text-purple-300/70 animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}} />
          
          {/* Main circle with loading icon */}
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-b from-indigo-700/90 to-purple-800/90 flex items-center justify-center shadow-[0_0_20px_rgba(129,140,248,0.4)]">
            {offlineDetected ? (
              <WifiOff className="h-9 w-9 text-purple-200" />
            ) : (
              <div className="relative">
                <RotateCw className="h-9 w-9 text-purple-100 animate-spin" />
              </div>
            )}
            
            {/* Inner glow */}
            <div className="absolute inset-0 bg-indigo-400/10 blur-md rounded-full animate-pulse"></div>
          </div>
          
          {/* Dots around the circle */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = Math.cos(angle) * 60;
            const y = Math.sin(angle) * 60;
            return (
              <div 
                key={i}
                className="absolute w-1.5 h-1.5 bg-purple-300 rounded-full"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  opacity: 0.4 + (i % 3) * 0.2
                }}
              />
            );
          })}
          
          {/* Offline indicator badge */}
          {offlineDetected && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center text-yellow-300 bg-yellow-900/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium border border-yellow-700/30">
              <WifiOff className="h-3 w-3 mr-1.5" />
              <span className="tracking-wider">Çevrimdışı Mod</span>
            </div>
          )}
        </div>
        
        {/* App title and message */}
        <h2 className="text-3xl font-bold text-white mb-2">
          NOMINAL Coin
        </h2>
        <p className="text-purple-200 font-medium text-lg">
          {loadingMessage}
        </p>
        
        {/* Only show after delay */}
        {(loadingTime > 5 || forceOffline) && (
          <div className="mt-8 p-4 backdrop-blur-md bg-indigo-900/40 border border-indigo-700/40 rounded-xl text-sm text-indigo-200 max-w-xs mx-auto">
            {forceOffline ? (
              <p>Bu uygulama çevrimdışı modda da çalışır, ancak verileri daha sonra senkronize etmek için internet gerekecektir.</p>
            ) : (
              <p>Beklenenden uzun sürüyor. Sayfayı yenilemek isteyebilirsiniz.</p>
            )}
            
            <button
              onClick={handleManualReload}
              className="mt-3 w-full flex items-center justify-center bg-indigo-800/60 hover:bg-indigo-700/60 text-indigo-100 px-4 py-2 rounded-md text-sm transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sayfayı Yenile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
