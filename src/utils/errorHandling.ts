
import { errorLog, debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Firebase veri kaydetme hatalarını işleyen yardımcı fonksiyon
 * 
 * @param error Firebase hatası
 * @param context Hata bağlam bilgisi ("Bakiye", "Kullanıcı verileri" vb.)
 */
export function handleDataSavingError(error: any, context: string = "Veri"): void {
  errorLog("errorHandling", `Firebase'e ${context.toLowerCase()} kaydetme hatası:`, error);
  
  // Offline durumu veya zaman aşımı kontrolü
  if ((error?.code === 'unavailable' || error.message?.includes('zaman aşımı'))) {
    debugLog("errorHandling", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
    toast.warning("Çevrimdışı moddasınız. Verileriniz yerel olarak kaydedildi.");
  } else {
    toast.error(`${context} Firebase'e kaydedilemedi`);
    throw error;
  }
}
