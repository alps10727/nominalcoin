
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "BURAYA_FIREBASE_KONSOLUNDAN_ALDIĞINIZ_API_KEY",
  authDomain: "nominal.firebaseapp.com", 
  projectId: "nominal",
  storageBucket: "nominal.appspot.com",
  messagingSenderId: "BURAYA_FIREBASE_KONSOLUNDAN_ALDIĞINIZ_MESSAGING_SENDER_ID",
  appId: "BURAYA_FIREBASE_KONSOLUNDAN_ALDIĞINIZ_APP_ID"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
