
// Bu dosya geriye dönük uyumluluk için mevcut
// Yeni kod doğrudan yeni servis dosyalarını kullanmalıdır

import { 
  loadUserDataFromFirebase
} from './userDataLoader';

import {
  saveUserDataToFirebase,
  updateUserCoinBalance
} from './userDataSaver';

import {
  initializeMiningStateFromFirebase 
} from './miningStateInitializer';

import {
  registerUser,
  loginUser,
  logoutUser,
} from './authService';

import {
  sendPasswordResetEmail
} from './passwordService';

// Tüm fonksiyonları dışa aktar
export {
  loadUserDataFromFirebase,
  saveUserDataToFirebase,
  initializeMiningStateFromFirebase,
  registerUser,
  loginUser,
  logoutUser,
  sendPasswordResetEmail,
  updateUserCoinBalance
};
