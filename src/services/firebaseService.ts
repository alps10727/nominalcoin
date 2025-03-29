
import { db, auth } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentReference,
  enableIndexedDbPersistence
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from "firebase/auth";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";

// Offline çalışma için persistence etkinleştir
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore offline persistence etkinleştirildi");
    })
    .catch((err) => {
      console.error("Offline persistence hatası:", err);
    });
} catch (error) {
  console.error("Persistence hatası:", error);
}

interface UserData {
  userId?: string;
  balance: number;
  miningRate: number;
  lastSaved: number | any; // serverTimestamp için
  miningActive?: boolean;
  miningTime?: number;
  miningSession?: number;
  upgrades?: any[];
  miningPeriod?: number;
  email?: string;
}

/**
 * Kullanıcı verilerini Firestore'dan yükleme
 */
export async function loadUserDataFromFirebase(userId: string): Promise<UserData | null> {
  try {
    console.log("Kullanıcı verileri yükleniyor... UserId:", userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log("Kullanıcı verileri başarıyla yüklendi");
      return docSnap.data() as UserData;
    }
    console.log("Kullanıcı verileri bulunamadı");
    return null;
  } catch (err) {
    console.error("Firebase'den veri yükleme hatası:", err);
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable') {
      console.log("Cihaz çevrimdışı, offline mod etkinleştiriliyor");
      return {
        balance: 0,
        miningRate: 0.01,
        lastSaved: Date.now(),
        miningActive: false
      };
    }
    return null;
  }
}

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
    console.log("Kullanıcı verileri kaydediliyor...", userId);
    // Boş veya null değerleri temizle
    const sanitizedData = {
      ...userData,
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.01,
      lastSaved: serverTimestamp(),
    };
    
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, sanitizedData, { merge: true });
    console.log("Kullanıcı verileri başarıyla kaydedildi:", userId);
  } catch (err) {
    console.error("Firebase'e veri kaydetme hatası:", err);
    // Offline hatası için kullanıcıya anlamlı geri bildirim
    if ((err as any)?.code === 'unavailable') {
      console.log("Cihaz çevrimdışı, veriler daha sonra kaydedilecek");
    }
    throw err; // Hataları yukarıya ilet
  }
}

/**
 * Kayıt olma - Timeout ve hata işleme eklendi
 */
export async function registerUser(email: string, password: string, userData: Partial<UserData>): Promise<User | null> {
  try {
    console.log("Firebase kayıt işlemi başlatılıyor:", email);
    
    // Firebase Auth için timeout promise
    const authTimeout = new Promise<null>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Kayıt zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 15000); // 15 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([
      createUserWithEmailAndPassword(auth, email, password),
      authTimeout
    ]) as any;
    
    if (!userCredential || !userCredential.user) {
      console.error("Kayıt başarısız: Kullanıcı verisi alınamadı");
      return null;
    }
    
    const user = userCredential.user;
    console.log("Firebase Auth kaydı başarılı:", user.uid);
    
    // Kullanıcı profilini oluştur
    try {
      await saveUserDataToFirebase(user.uid, {
        userId: user.uid,
        email: email,
        balance: 0,
        miningRate: 0.01,
        lastSaved: serverTimestamp(),
        miningActive: false,
        miningTime: 21600,
        miningPeriod: 21600,
        miningSession: 0,
        ...userData
      });
      console.log("Kullanıcı profili başarıyla oluşturuldu");
      return user;
    } catch (profileError) {
      console.error("Kullanıcı profili oluşturma hatası:", profileError);
      return user; // Profil hatası olsa bile kullanıcıyı döndür, yine de kayıt başarılı oldu
    }
  } catch (err) {
    console.error("Kayıt hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * Giriş yapma - Timeout eklendi
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    console.log("Giriş işlemi başlatılıyor:", email);
    
    // Firebase Auth için timeout promise
    const authTimeout = new Promise<null>((_, reject) => {
      setTimeout(() => {
        reject(new Error("Giriş zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin."));
      }, 15000); // 15 saniye timeout
    });
    
    // Promise.race ile timeout kontrolü
    const userCredential = await Promise.race([
      signInWithEmailAndPassword(auth, email, password),
      authTimeout
    ]) as any;
    
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

/**
 * MiningState'i Firebase'den yükleme ve işleme
 */
export async function initializeMiningStateFromFirebase(userId: string): Promise<MiningState | null> {
  console.log("Mining state başlatılıyor...");
  const userData = await loadUserDataFromFirebase(userId);
  
  if (userData) {
    return {
      isLoading: false,
      userId: userData.userId,
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.01,
      miningActive: userData.miningActive || false,
      miningTime: userData.miningTime || 21600,
      miningPeriod: userData.miningPeriod || 21600,
      miningSession: userData.miningSession || 0,
      progress: calculateProgress(userData.miningTime || 21600, userData.miningPeriod || 21600)
    };
  }
  
  return null;
}
