
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyBZ7C50TQYVVoj5KBr-xtdMFfhj7GBDXtk",
  authDomain: "future-coin-app.firebaseapp.com",
  projectId: "future-coin-app",
  storageBucket: "future-coin-app.appspot.com",
  messagingSenderId: "628461041667",
  appId: "1:628461041667:web:39c70a231f45c07e7d54ed"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
