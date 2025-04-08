
import { toast } from "sonner";
import { errorLog } from "./debugUtils";

/**
 * Handles Firebase connection errors with appropriate user feedback
 */
export function handleFirebaseConnectionError(error: any, context: string = "Firebase"): void {
  // Log the error with context
  errorLog(context, "Firebase connection error:", error);

  // Check for offline or timeout errors
  if ((error?.code === 'unavailable' || error?.message?.includes('zaman aşımı'))) {
    toast.warning("Sunucuya bağlanılamadı, yerel veriler kullanılıyor", {
      id: "offline-mode-warning",
      duration: 5000
    });
  } else {
    // Generic error for other cases
    toast.error("Firebase veri yükleme hatası", {
      description: error?.message,
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
