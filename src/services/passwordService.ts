
import { auth } from "@/config/firebase";
import { sendPasswordResetEmail as firebaseSendPasswordResetEmail } from "firebase/auth";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Şifre sıfırlama e-postası gönderme
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    debugLog("passwordService", "Şifre sıfırlama e-postası gönderiliyor:", email);
    
    // Şifre sıfırlama işlemi
    const resetPromise = firebaseSendPasswordResetEmail(auth, email);
    
    // Timeout ile daha hızlı hata bildirimi
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("İşlem zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 10000); // 10 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    await Promise.race([resetPromise, timeoutPromise]);
    
    debugLog("passwordService", "Şifre sıfırlama e-postası gönderildi");
  } catch (err) {
    errorLog("passwordService", "Şifre sıfırlama hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}
