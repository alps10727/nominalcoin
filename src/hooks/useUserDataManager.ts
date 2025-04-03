
import { useState } from "react";
import { User } from "firebase/auth";
import { saveUserDataToFirebase } from "@/services/userService";
import { saveUserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog, Timer } from "@/utils/debugUtils";

interface UserDataManager {
  updateUserData: (data: any) => Promise<void>;
  isUpdating: boolean;
  lastUpdateStatus: 'idle' | 'success' | 'error' | 'offline';
}

export function useUserDataManager(
  currentUser: User | null, 
  userData: any | null, 
  setUserData: React.Dispatch<React.SetStateAction<any | null>>
): UserDataManager {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');
  
  const updateUserData = async (data: any): Promise<void> => {
    if (!currentUser) {
      debugLog("useUserDataManager", "Kullanıcı oturum açmadığı için veri güncellenemiyor");
      return;
    }
    
    try {
      debugLog("useUserDataManager", "Kullanıcı verileri güncelleniyor:", data);
      const timer = new Timer("userDataUpdate");
      setIsUpdating(true);
      
      const updatedData = {
        ...userData,
        ...data
      };
      
      // Önce UI durumunu güncelle
      setUserData(prev => ({ ...prev, ...data }));
      timer.mark("UI durumu güncellendi");
      
      // Yerel depoya kaydet (hızlı erişim için)
      try {
        saveUserData(updatedData);
        timer.mark("Yerel depo güncellendi");
      } catch (err) {
        errorLog("useUserDataManager", "Yerel depo güncelleme hatası:", err);
      }
      
      // Firebase'e kaydet (öncelikli olarak)
      try {
        await saveUserDataToFirebase(currentUser.uid, updatedData);
        timer.mark("Firebase güncellendi");
        setLastUpdateStatus('success');
      } catch (error) {
        timer.mark("Firebase güncelleme hatası");
        
        if ((error as any)?.code === 'unavailable' || (error as Error).message.includes('zaman aşımı')) {
          debugLog("useUserDataManager", "Çevrimdışı modda veri güncellendi");
          setLastUpdateStatus('offline');
          toast.warning("Çevrimdışı moddasınız. Verileriniz yeniden bağlandığınızda senkronize edilecek.");
        } else {
          errorLog("useUserDataManager", "Veri güncelleme hatası:", error);
          setLastUpdateStatus('error');
          toast.error("Veri güncelleme başarısız: " + (error as Error).message);
        }
      }
      
      setIsUpdating(false);
      timer.stop();
    } catch (err) {
      setIsUpdating(false);
      errorLog("useUserDataManager", "Beklenmeyen hata:", err);
    }
  };

  return { updateUserData, isUpdating, lastUpdateStatus };
}
