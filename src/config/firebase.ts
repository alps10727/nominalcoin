
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

