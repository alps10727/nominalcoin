
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

// Firebase yapılandırma bilgilerini çevre değişkenlerinden al
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA25GTCK5zJIgrDR1RQK5cesSpJCqTmw1A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nominal-25c8a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nominal-25c8a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nominal-25c8a.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754037394526",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754037394526:web:9a39f2cc84213a5d8678cf",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-C1QMWWHVHH"
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
  
  // Emülatör kullanımını devre dışı bırakalım (geçici çözüm)
  console.log("⚠️ Emülatör yerine gerçek Firebase servisleri kullanılacak");
  localStorage.setItem('useFirebaseEmulator', 'false');
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
