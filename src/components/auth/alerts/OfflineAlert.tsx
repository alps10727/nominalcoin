
import { WifiOff } from "lucide-react";

const OfflineAlert = () => {
  return (
    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-600 rounded-md flex items-start">
      <WifiOff className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
      <span className="text-sm">İnternet bağlantınız yok. Kayıt olmak için internet bağlantınızı kontrol edin.</span>
    </div>
  );
};

export default OfflineAlert;
