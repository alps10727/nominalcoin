
import { toast } from "sonner";
import { errorLog } from "./debugUtils";

/**
 * Handle Supabase connection errors
 */
export function handleSupabaseConnectionError(error: any, source: string = "unknown") {
  if (!error) return;
  
  const errorMsg = error.toString();
  const isNetworkError = 
    errorMsg.includes("network") || 
    errorMsg.includes("connection") || 
    errorMsg.includes("offline") ||
    errorMsg.includes("timeout") ||
    errorMsg.includes("unavailable");
  
  if (isNetworkError) {
    console.warn("Supabase connection error, switching to offline mode");
    // Only show toast for actual user interactions
    if (source !== "useSupabaseLoader" && source !== "backgroundSync") {
      toast.error("Internet connection lost, switched to offline mode", {
        duration: 4000,
      });
    }
  } else {
    errorLog(source, "Supabase error:", error);
  }
}
