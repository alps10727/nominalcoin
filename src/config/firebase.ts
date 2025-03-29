
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri - Firebase konsolundan aldığınız bilgilerle değiştirin
const firebaseConfig = {
  apiKey: "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Firebase console'dan aldığınız apiKey
  authDomain: "your-project-id.firebaseapp.com", // Firebase console'dan aldığınız authDomain
  projectId: "your-project-id", // Firebase console'dan aldığınız projectId
  storageBucket: "your-project-id.appspot.com", // Firebase console'dan aldığınız storageBucket
  messagingSenderId: "123456789012", // Firebase console'dan aldığınız messagingSenderId
  appId: "1:123456789012:web:a1b2c3d4e5f6g7h8i9j0k1" // Firebase console'dan aldığınız appId
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
