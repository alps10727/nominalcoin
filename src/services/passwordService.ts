
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    debugLog("passwordService", "Sending password reset email:", email);
    
    // Password reset process
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw error;
    }
    
    debugLog("passwordService", "Password reset email sent");
  } catch (err) {
    errorLog("passwordService", "Password reset error:", err);
    throw err; // Pass errors to upper layer
  }
}
