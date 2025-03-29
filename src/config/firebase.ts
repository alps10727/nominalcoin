
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri - Kendi Firebase hesabınızın bilgileriyle değiştirin
const firebaseConfig = {
  apiKey: "BURAYA_KENDİ_FIREBASE_API_KEY_BİLGİNİZİ_YAZIN",
  authDomain: "BURAYA_KENDİ_FIREBASE_AUTH_DOMAIN_BİLGİNİZİ_YAZIN",
  projectId: "BURAYA_KENDİ_FIREBASE_PROJECT_ID_BİLGİNİZİ_YAZIN",
  storageBucket: "BURAYA_KENDİ_FIREBASE_STORAGE_BUCKET_BİLGİNİZİ_YAZIN",
  messagingSenderId: "BURAYA_KENDİ_FIREBASE_MESSAGING_SENDER_ID_BİLGİNİZİ_YAZIN",
  appId: "BURAYA_KENDİ_FIREBASE_APP_ID_BİLGİNİZİ_YAZIN"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
