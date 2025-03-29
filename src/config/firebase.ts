
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyDX_nominal_project_api_key_buraya",  // Firebase konsolundan aldığınız API key
  authDomain: "nominal.firebaseapp.com",              // nominal.firebaseapp.com şeklinde olmalı
  projectId: "nominal",                               // "nominal" projenizin ID'si
  storageBucket: "nominal.appspot.com",               // nominal.appspot.com şeklinde olmalı
  messagingSenderId: "123456789012",                  // Firebase konsolundan aldığınız messagingSenderId
  appId: "1:123456789012:web:abc123def456"            // Firebase konsolundan aldığınız appId
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore ve Auth servislerini al
export const db = getFirestore(app);
export const auth = getAuth(app);
