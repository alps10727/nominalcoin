
import { useState } from "react";
import { User } from "firebase/auth";
import { saveUserDataToFirebase } from "@/services/userDataSaver";
import { saveUserData, UserData } from "@/utils/storage";
import { toast } from "sonner";
import { debugLog, errorLog, Timer } from "@/utils/debugUtils";

interface UserDataManager {
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  isUpdating: boolean;
  lastUpdateStatus: 'idle' | 'success' | 'error' | 'offline';
}

export function useUserDataManager(
  currentUser: User | null, 
  userData: UserData | null, 
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
): UserDataManager {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateStatus, setLastUpdateStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');
  
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
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
      } as UserData;
      
      // Önce UI durumunu güncelle
      try {
        setUserData(prev => ({ ...prev, ...data } as UserData));
        timer.mark("UI durumu güncellendi");
      } catch (uiErr) {
        errorLog("useUserDataManager", "UI durumu güncelleme hatası:", uiErr);
      }
      
      // Yerel depoya kaydet (hızlı erişim için)
      try {
        saveUserData(updatedData);
        timer.mark("Yerel depo güncellendi");
      } catch (storageErr) {
        errorLog("useUserDataManager", "Yerel depo güncelleme hatası:", storageErr);
        toast.error("Yerel depolama erişim hatası");
      }
      
      // Firebase'e kaydet (öncelikli olarak)
      try {
        await saveUserDataToFirebase(currentUser.uid, updatedData);
        timer.mark("Firebase güncellendi");
        setLastUpdateStatus('success');
        toast.success("Verileriniz başarıyla kaydedildi");
      } catch (firebaseErr) {
        timer.mark("Firebase güncelleme hatası");
        
        if ((firebaseErr as any)?.code === 'unavailable' || (firebaseErr as Error).message.includes('zaman aşımı')) {
          debugLog("useUserDataManager", "Çevrimdışı modda veri güncellendi");
          setLastUpdateStatus('offline');
          toast.warning("Çevrimdışı moddasınız. Verileriniz yeniden bağlandığınızda senkronize edilecek.");
        } else {
          errorLog("useUserDataManager", "Veri güncelleme hatası:", firebaseErr);
          setLastUpdateStatus('error');
          toast.error("Veri güncelleme başarısız: " + (firebaseErr as Error).message);
        }
      }
      
      setIsUpdating(false);
      timer.stop();
    } catch (err) {
      setIsUpdating(false);
      errorLog("useUserDataManager", "Beklenmeyen hata:", err);
      toast.error("Kullanıcı verileri güncellenirken beklenmeyen bir hata oluştu");
    }
  };

  return { updateUserData, isUpdating, lastUpdateStatus };
}
