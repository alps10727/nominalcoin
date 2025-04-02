
import { WifiOff, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const OfflineIndicator = () => {
  const { isOffline } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  if (!isOffline) return null;
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Sayfayı yenile
    window.location.reload();
  };
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 bg-yellow-950 text-yellow-300 px-4 py-2 rounded-full shadow-lg border border-yellow-800/50 backdrop-blur-sm">
        <WifiOff className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Çevrimdışı mod</span>
        
        {/* Yenileme butonu ekleyelim */}
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-2 flex items-center justify-center text-xs text-yellow-300 hover:text-yellow-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="ml-1">{isRefreshing ? 'Yenileniyor...' : 'Yenile'}</span>
        </button>
      </div>
    </div>
  );
};

export default OfflineIndicator;
