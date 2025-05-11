
import { toast } from "sonner";
import { errorLog } from "./debugUtils";
import { translate } from "@/utils/translationUtils";

/**
 * Handles Firebase connection errors with appropriate user feedback
 */
export function handleFirebaseConnectionError(error: any, context: string = "Firebase"): void {
  // Log the error with context
  errorLog(context, "Firebase connection error:", error);

  // Check for offline or timeout errors - added more error condition checks
  if ((error?.code === 'unavailable' || 
      error?.message?.includes('timeout') || 
      error?.message?.includes('network error') || 
      error?.message?.includes('disconnected') ||
      navigator.onLine === false)) {
    
    toast.warning(translate("firebase.connectionFailed"), {
      id: "offline-mode-warning",
      duration: 5000
    });
  } else if (error?.code === 'permission-denied') {
    // Permission error
    toast.error(translate("firebase.permissionDenied"), {
      description: translate("firebase.tryRelogging"),
      duration: 5000
    });
  } else if (error?.code?.startsWith('quota-exceeded')) {
    // Quota error
    toast.error(translate("firebase.quotaExceeded"), {
      description: translate("firebase.tryLater"),
      duration: 5000
    });
  } else {
    // Generic error for other cases
    toast.error(translate("firebase.dataLoadError"), {
      description: error?.message || translate("errors.unknown"),
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
