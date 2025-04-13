
import { errorLog, debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Firebase veri kaydetme hatalarını işleyen yardımcı fonksiyon
 * 
 * @param error Firebase hatası
 * @param context Hata bağlam bilgisi ("Bakiye", "Kullanıcı verileri" vb.)
 * @param retryCallback İsteğe bağlı yeniden deneme fonksiyonu
 */
export function handleDataSavingError(
  error: any, 
  context: string = "Veri", 
  retryCallback?: () => void
): void {
  errorLog("errorHandling", `Firebase'e ${context.toLowerCase()} kaydetme hatası:`, error);
  
  // Offline durumu veya zaman aşımı kontrolü
  if ((error?.code === 'unavailable' || error?.message?.includes('zaman aşımı') || 
       error?.message?.includes('network error') || error?.message?.includes('timeout'))) {
    debugLog("errorHandling", "Cihaz çevrimdışı veya bağlantı zaman aşımına uğradı, veriler yerel olarak kaydedildi");
    toast.warning("Çevrimdışı moddasınız. Verileriniz yerel olarak kaydedildi.", {
      id: "offline-toast",
      duration: 4000
    });
    
    // Verilerin yerel depoya zaten kaydedilmiş olduğunu varsayıyoruz
    return; // İşlemi sonlandır ve hata fırlatma
  } 
  
  // Kimlik doğrulama hatası
  else if (error?.code === 'permission-denied' || error?.code === 'unauthenticated') {
    toast.error("Oturum süresi dolmuş olabilir. Lütfen yeniden giriş yapın.", {
      id: "auth-error-toast",
      duration: 5000
    });
  } 
  
  // Sunucu hatası
  else if (error?.code?.startsWith('5')) {
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
      return; // İşlemi sonlandır ve hata fırlatma
    }
  } 
  
  // Bilinmeyen hatalar
  else {
    toast.error(`${context} kaydedilemedi. Hata kodu: ${error?.code || 'bilinmiyor'}`, {
      id: "unknown-error-toast"
    });
  }
  
  // Normal akışı devam ettirme veya kesme kontrolü
  // Bu örnekte, hata işlendi ancak üst katmana bildirilmesi gerekiyor
  throw error;
}
