
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri - Firebase konsolunda proje ayarlarından aldığınız bilgilerle değiştirilmeli
const firebaseConfig = {
  apiKey: "BURAYA_FIREBASE_KONSOLUNDAN_API_KEY_YAZIN",
  authDomain: "nominal.firebaseapp.com", 
  projectId: "nominal",
  storageBucket: "nominal.appspot.com",
  messagingSenderId: "BURAYA_FIREBASE_KONSOLUNDAN_MESSAGING_SENDER_ID_YAZIN",
  appId: "BURAYA_FIREBASE_KONSOLUNDAN_APP_ID_YAZIN"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
