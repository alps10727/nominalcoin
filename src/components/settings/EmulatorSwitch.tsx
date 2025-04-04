
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isEmulatorEnabled, setEmulatorEnabled } from "@/config/firebaseEmulator";
import { toast } from "@/hooks/use-toast";

export const EmulatorSwitch = () => {
  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    // Mevcut emülatör durumunu yükle
    setEnabled(isEmulatorEnabled());
  }, []);
  
  const handleToggle = (checked: boolean) => {
    setEnabled(checked);
    setEmulatorEnabled(checked);
    
    if (checked) {
      toast({
        title: "Firebase Emülatörü Etkinleştirildi",
        description: "Sayfa yeniden yüklenecek ve yerel emülatöre bağlanılacak.",
      });
    } else {
      toast({
        title: "Firebase Emülatörü Devre Dışı Bırakıldı",
        description: "Sayfa yeniden yüklenecek ve gerçek Firebase servislerine bağlanılacak.",
      });
    }
  };
  
  return (
    <div className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
      <Switch 
        id="emulator-mode" 
        checked={enabled} 
        onCheckedChange={handleToggle} 
      />
      <Label 
        htmlFor="emulator-mode" 
        className="cursor-pointer text-white"
      >
        Firebase Emülatör Modu {enabled ? "Açık" : "Kapalı"}
      </Label>
      {enabled && (
        <a 
          href="http://localhost:4000" 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-2 text-xs text-blue-400 hover:text-blue-300"
        >
          Emülatör Panelini Aç
        </a>
      )}
    </div>
  );
};

export default EmulatorSwitch;
