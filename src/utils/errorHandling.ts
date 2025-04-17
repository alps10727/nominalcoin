
import { errorLog, debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Veri kaydetme hatalarını işleyen yardımcı fonksiyon
 */
export function handleDataSavingError(
  error: any, 
  context: string = "Veri", 
  retryCallback?: () => void
): void {
  errorLog("errorHandling", `${context.toLowerCase()} kaydetme hatası:`, error);
  
  // Offline durumu veya zaman aşımı kontrolü
  if (error?.message?.includes('zaman aşımı') || error?.message?.includes('bağlantı hatası')) {
    debugLog("errorHandling", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
    toast.warning("Çevrimdışı moddasınız. Verileriniz yerel olarak kaydedildi.", {
      id: "offline-toast",
      duration: 4000
    });
    
    return;
  } 
  
  // Kimlik doğrulama hatası
  else if (error?.message?.includes('yetkilendirme')) {
    toast.error("Oturum süresi dolmuş olabilir. Lütfen yeniden giriş yapın.", {
      id: "auth-error-toast",
      duration: 5000
    });
  } 
  
  // Sunucu hatası
  else if (error?.message?.includes('sunucu hatası')) {
    toast.error(`Sunucu hatası. Lütfen daha sonra tekrar deneyin. ${retryCallback ? 'Otomatik olarak yeniden denenecek.' : ''}`, {
      id: "server-error-toast",
      duration: 4000
    });
    
    // Yeniden deneme mekanizması
    if (retryCallback) {
      setTimeout(() => {
        debugLog("errorHandling", "Veri kaydetme otomatik olarak yeniden deneniyor...");
        retryCallback();
      }, 3000);
      return;
    }
  } 
  
  // Bilinmeyen hatalar
  else {
    toast.error(`${context} kaydedilemedi. Hata: ${error?.message || 'bilinmiyor'}`, {
      id: "unknown-error-toast"
    });
  }
  
  throw error;
}
