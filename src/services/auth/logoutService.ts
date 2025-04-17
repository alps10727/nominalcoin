
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

export async function logoutUser(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    debugLog("authService", "User logged out successfully");
  } catch (error) {
    errorLog("authService", "Logout error:", error);
    throw error;
  }
}
