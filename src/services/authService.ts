
import { auth } from "@/config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from "firebase/auth";
import { saveUserDataToFirebase } from "./userService";

/**
 * Kayıt olma - Hata yönetimini iyileştirdik ve timeout'u düşürdük
 */
export async function registerUser(email: string, password: string, userData: any): Promise<User | null> {
  try {
    console.log("Firebase kayıt işlemi başlatılıyor:", email);
    
    // Kayıt için race condition'ı düzelttik
    const createPromise = createUserWithEmailAndPassword(auth, email, password);
    
    // Düşük timeout ile daha hızlı hata bildirimi
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Kayıt zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 10000); // 10 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([createPromise, timeoutPromise]);
    const user = userCredential.user;
    
    console.log("Firebase Auth kaydı başarılı:", user.uid);
    
    // Kullanıcı profilini oluşturmayı dene, başarısız olursa hata fırlat
    const saveProfilePromise = saveUserDataToFirebase(user.uid, {
      userId: user.uid,
      email: email,
      balance: 0,
      miningRate: 0.01,
      lastSaved: Date.now(), // serverTimestamp yerine istemci tarafında tarih kullanarak hızlandırıldı
      miningActive: false,
      miningTime: 21600,
      miningPeriod: 21600,
      miningSession: 0,
      ...userData
    });
    
    // Profil kaydetme için 10 saniye timeout
    const profileTimeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Profil oluşturma zaman aşımına uğradı, ancak hesabınız oluşturuldu. Giriş yaparak devam edebilirsiniz."));
      }, 10000);
    });
    
    try {
      // Profil kaydetme işlemi için de timeout ekleyelim
      await Promise.race([saveProfilePromise, profileTimeoutPromise]);
      console.log("Kullanıcı profili başarıyla oluşturuldu");
    } catch (profileError) {
      console.error("Kullanıcı profili oluşturma hatası:", profileError);
      // Profil oluşturma hatasını göster ama yine de kullanıcıyı döndür
      throw new Error("Hesabınız oluşturuldu ancak profil bilgileriniz kaydedilemedi. Giriş yaparak tekrar deneyebilirsiniz.");
    }
    
    return user;
  } catch (err) {
    console.error("Kayıt hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Giriş yapma - Timeout düşürüldü
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    console.log("Giriş işlemi başlatılıyor:", email);
    
    // Login için race condition'ı düzelttik
    const loginPromise = signInWithEmailAndPassword(auth, email, password);
    
    // Düşük timeout ile daha hızlı hata bildirimi
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Giriş zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 10000); // 10 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([loginPromise, timeoutPromise]);
    
    console.log("Giriş başarılı");
    return userCredential.user;
  } catch (err) {
    console.error("Giriş hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Çıkış yapma
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log("Kullanıcı başarıyla çıkış yaptı");
  } catch (err) {
    console.error("Çıkış hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}
