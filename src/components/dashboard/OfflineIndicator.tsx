
import { WifiOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const OfflineIndicator = () => {
  const { isOffline } = useAuth();
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-2 bg-yellow-950 text-yellow-300 px-4 py-2 rounded-full shadow-lg border border-yellow-800/50 backdrop-blur-sm">
        <WifiOff className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Çevrimdışı mod</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
