
import { db, auth } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentReference
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User 
} from "firebase/auth";
import { MiningState } from "@/types/mining";
import { calculateProgress } from "@/utils/miningUtils";

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
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (err) {
    console.error("Firebase'den veri yükleme hatası:", err);
    return null;
  }
}

/**
 * Kullanıcı verilerini Firestore'a kaydetme
 */
export async function saveUserDataToFirebase(userId: string, userData: UserData): Promise<void> {
  try {
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
    throw err; // Hataları yukarıya ilet
  }
}

/**
 * Kayıt olma
 */
export async function registerUser(email: string, password: string, userData: Partial<UserData>): Promise<User | null> {
  try {
    console.log("Firebase kayıt işlemi başlatılıyor:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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
 * Giriş yapma
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
  } catch (err) {
    console.error("Çıkış hatası:", err);
    throw err; // Hataları üst katmana ilet
  }
}

/**
 * MiningState'i Firebase'den yükleme ve işleme
 */
export async function initializeMiningStateFromFirebase(userId: string): Promise<MiningState | null> {
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
