
// Bu dosya geriye dönük uyumluluk için mevcut
// Yeni kod doğrudan yeni servis dosyalarını kullanmalıdır

import { 
  loadUserDataFromFirebase, 
  saveUserDataToFirebase, 
  initializeMiningStateFromFirebase 
} from './userService';

import {
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail
} from './authService';

// Tüm fonksiyonları dışa aktar
export {
  loadUserDataFromFirebase,
  saveUserDataToFirebase,
  initializeMiningStateFromFirebase,
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail
};
