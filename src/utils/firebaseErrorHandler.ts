
import { toast } from "sonner";
import { errorLog } from "./debugUtils";

/**
 * Handles Firebase connection errors with appropriate user feedback
 */
export function handleFirebaseConnectionError(error: any, context: string = "Firebase"): void {
  // Log the error with context
  errorLog(context, "Firebase connection error:", error);

  // Check for offline or timeout errors - daha fazla hata durumu kontrolü eklendi
  if ((error?.code === 'unavailable' || 
      error?.message?.includes('zaman aşımı') ||
      error?.message?.includes('network error') || 
      error?.message?.includes('timeout') || 
      error?.message?.includes('disconnected') ||
      navigator.onLine === false)) {
    
    toast.warning("Sunucuya bağlanılamadı, yerel veriler kullanılıyor", {
      id: "offline-mode-warning",
      duration: 5000
    });
  } else if (error?.code === 'permission-denied') {
    // Yetki hatası
    toast.error("Veri erişim izniniz yok veya oturum süreniz dolmuş", {
      description: "Lütfen yeniden giriş yapmayı deneyin.",
      duration: 5000
    });
  } else if (error?.code?.startsWith('quota-exceeded')) {
    // Kota hatası
    toast.error("Firebase kota sınırına ulaşıldı", {
      description: "Lütfen daha sonra tekrar deneyin.",
      duration: 5000
    });
  } else {
    // Generic error for other cases
    toast.error("Firebase veri yükleme hatası", {
      description: error?.message || 'Bilinmeyen hata',
      duration: 5000
    });
  }
}

/**
 * Utility for handling data migration and merging between local and remote sources
 */
export function mergeUserData<T extends { balance?: number }>(localData: T | null, remoteData: T | null): T | null {
  if (!remoteData) return localData;
  if (!localData) return remoteData;
  
  // Use the highest balance between local and remote data
  const highestBalance = Math.max(
    typeof localData.balance === 'number' ? localData.balance : 0,
    typeof remoteData.balance === 'number' ? remoteData.balance : 0
  );
  
  return {
    ...remoteData,
    balance: highestBalance
  };
}
