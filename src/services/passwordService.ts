
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Şifre sıfırlama e-postası gönderme
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    debugLog("passwordService", "Şifre sıfırlama e-postası gönderiliyor:", email);
    
    // Şifre sıfırlama işlemi
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      throw error;
    }
    
    debugLog("passwordService", "Şifre sıfırlama e-postası gönderildi");
  } catch (err) {
    errorLog("passwordService", "Şifre sıfırlama hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}
