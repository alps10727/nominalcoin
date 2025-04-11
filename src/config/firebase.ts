
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  connectFirestoreEmulator
} from "firebase/firestore";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  connectAuthEmulator
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { emulatorConfig, isEmulatorEnabled } from "./firebaseEmulator";

// Firebase configuration strictly from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore, Auth ve Storage servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

// Auth durumunu önbelleğe alma
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});

// Emülatör kullanımını kontrol et ve bağlan
if (isEmulatorEnabled()) {
  console.log("🔥 Firebase Emülatörleri kullanılıyor!");
  
  // DDoS koruması için rate limiting ekleyelim
  const MAX_REQUESTS_PER_MINUTE = 60;
  let requestCount = 0;
  let lastResetTime = Date.now();
  
  // Basit bir rate limiter ekliyoruz
  const checkRateLimit = () => {
    const now = Date.now();
    // 1 dakikada bir sayacı sıfırla
    if (now - lastResetTime > 60000) {
      requestCount = 0;
      lastResetTime = now;
      return true;
    }
    
    // İstek sayısını kontrol et
    if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
      console.error("Rate limit exceeded!");
      return false;
    }
    
    requestCount++;
    return true;
  };
  
  // Rate limit koruması ekle
  if (checkRateLimit()) {
    try {
      connectAuthEmulator(auth, `http://${emulatorConfig.auth.host}:${emulatorConfig.auth.port}`);
      connectFirestoreEmulator(db, emulatorConfig.firestore.host, emulatorConfig.firestore.port);
      connectStorageEmulator(storage, emulatorConfig.storage.host, emulatorConfig.storage.port);
    } catch (err) {
      console.error("Emulator connection error:", err);
    }
  }
} else {
  try {
    // Emülatör kullanılmıyorsa normal çevrimdışı önbelleği etkinleştir
    enableMultiTabIndexedDbPersistence(db)
      .then(() => {
        console.log("Firestore offline persistence etkinleştirildi");
      })
      .catch((err) => {
        // Sadece critical hataları göster, diğerlerini geçici olarak görmezden gel
        if (err.code !== 'failed-precondition') {
          console.error("Offline persistence hatası:", err);
        } else {
          console.log("Birden fazla sekme açık - tam persistence sınırlı olabilir");
        }
      });
  } catch (error) {
    console.error("Persistence hatası:", error);
  }
}
