
import { createUserWithEmailAndPassword, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { UserRegistrationData } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

/**
 * Kullanıcı kaydı yapan fonksiyon
 * @param email Kullanıcı email adresi
 * @param password Kullanıcı şifresi
 * @param userData Ek kullanıcı verileri
 * @returns Firebase User nesnesi
 */
export async function registerUser(
  email: string, 
  password: string, 
  userData: UserRegistrationData = {}
): Promise<User> {
  try {
    debugLog("authService", "Kullanıcı kaydı başlıyor...", { email });
    
    // Firebase'de kullanıcı oluştur
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    debugLog("authService", "Kullanıcı Firebase Auth'da oluşturuldu", { userId: user.uid });
    
    // Varsayılan kullanıcı verileri
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      userId: user.uid,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      registrationDate: new Date()
    };
    
    // Kullanıcı verilerini Firestore'a kaydet
    await setDoc(doc(db, "users", user.uid), defaultUserData);
    debugLog("authService", "Kullanıcı verileri Firestore'a kaydedildi");
    
    return user;
  } catch (error) {
    errorLog("authService", "Kayıt hatası:", error);
    throw error;
  }
}
