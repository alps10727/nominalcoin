
import { initializeApp } from "firebase/app";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyA25GTCK5zJIgrDR1RQK5cesSpJCqTmw1A",
  authDomain: "nominal-25c8a.firebaseapp.com",
  projectId: "nominal-25c8a",
  storageBucket: "nominal-25c8a.firebasestorage.app",
  messagingSenderId: "754037394526",
  appId: "1:754037394526:web:9a39f2cc84213a5d8678cf",
  measurementId: "G-C1QMWWHVHH"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al - gelişmiş yapılandırma ile
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Auth durumunu önbelleğe alma - String yerine doğru tiple
setPersistence(auth, browserLocalPersistence).catch(err => {
  console.error("Auth persistence error:", err);
});
