
import { errorLog, debugLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { translate } from "@/utils/translationUtils";

/**
 * Helper function for handling Firebase data saving errors
 * 
 * @param error Firebase error
 * @param context Error context information ("Balance", "User data", etc.)
 * @param retryCallback Optional retry function
 */
export function handleDataSavingError(
  error: any, 
  context: string = "Data", 
  retryCallback?: () => void
): void {
  errorLog("errorHandling", `Error saving ${context.toLowerCase()} to Firebase:`, error);
  
  // Check for offline condition or timeout
  if ((error?.code === 'unavailable' || error?.message?.includes('timeout') || 
       error?.message?.includes('network error'))) {
    debugLog("errorHandling", "Device is offline or connection timed out, data saved locally");
    toast.warning(translate("errors.offlineSaving"), {
      id: "offline-toast",
      duration: 4000
    });
    
    // We assume that data has already been saved to local storage
    return; // End execution and don't throw error
  } 
  
  // Authentication error
  else if (error?.code === 'permission-denied' || error?.code === 'unauthenticated') {
    toast.error(translate("errors.sessionExpired"), {
      id: "auth-error-toast",
      duration: 5000
    });
  } 
  
  // Server error
  else if (error?.code?.startsWith('5')) {
    toast.error(translate("errors.serverError", retryCallback ? translate("errors.autoRetry") : ""), {
      id: "server-error-toast",
      duration: 4000
    });
    
    // Retry mechanism
    if (retryCallback) {
      setTimeout(() => {
        debugLog("errorHandling", "Auto-retrying data save...");
        retryCallback();
      }, 3000);
      return; // End execution and don't throw error
    }
  } 
  
  // Unknown errors
  else {
    toast.error(translate("errors.saveFailed", context, error?.code || translate("errors.unknown")), {
      id: "unknown-error-toast"
    });
  }
  
  // Normal flow continuation or interruption check
  // In this example, the error was handled but needs to be reported to the upper layer
  throw error;
}
