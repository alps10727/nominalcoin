
import { UserData, saveUserData } from "@/utils/storage";
import { saveUserDataToFirebase } from "@/services/userDataSaver";
import { debugLog, errorLog, Timer } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Updates user data locally and in Firebase
 */
export async function updateUserDataWithStatus(
  userId: string | null, 
  currentData: UserData | null,
  newData: Partial<UserData>
): Promise<{ status: 'success' | 'error' | 'offline', updatedData: UserData }> {
  if (!userId) {
    debugLog("userDataUpdater", "Kullanıcı oturum açmadığı için veri güncellenemiyor");
    throw new Error("No authenticated user");
  }

  debugLog("userDataUpdater", "Kullanıcı verileri güncelleniyor:", newData);
  const timer = new Timer("userDataUpdate");
  
  // Create updated data object
  const updatedData = {
    ...currentData,
    ...newData
  } as UserData;
  
  try {
    // Save to local storage first (for fast access)
    try {
      saveUserData(updatedData);
      timer.mark("Yerel depo güncellendi");
    } catch (storageErr) {
      errorLog("userDataUpdater", "Yerel depo güncelleme hatası:", storageErr);
      toast.error("Yerel depolama erişim hatası");
    }
    
    // Try to save to Firebase (prioritized)
    try {
      await saveUserDataToFirebase(userId, updatedData);
      timer.mark("Firebase güncellendi");
      toast.success("Verileriniz başarıyla kaydedildi");
      timer.stop();
      return { status: 'success', updatedData };
    } catch (firebaseErr) {
      timer.mark("Firebase güncelleme hatası");
      
      // Handle offline mode
      if ((firebaseErr as any)?.code === 'unavailable' || (firebaseErr as Error).message.includes('zaman aşımı')) {
        debugLog("userDataUpdater", "Çevrimdışı modda veri güncellendi");
        toast.warning("Çevrimdışı moddasınız. Verileriniz yeniden bağlandığınızda senkronize edilecek.");
        timer.stop();
        return { status: 'offline', updatedData };
      } else {
        // Handle other errors
        errorLog("userDataUpdater", "Veri güncelleme hatası:", firebaseErr);
        toast.error("Veri güncelleme başarısız: " + (firebaseErr as Error).message);
        timer.stop();
        return { status: 'error', updatedData };
      }
    }
  } catch (err) {
    errorLog("userDataUpdater", "Beklenmeyen hata:", err);
    toast.error("Kullanıcı verileri güncellenirken beklenmeyen bir hata oluştu");
    throw err;
  }
}
