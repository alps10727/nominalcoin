
// Bu dosya geriye dönük uyumluluk için mevcut
// Yeni kod doğrudan yeni servis dosyalarını kullanmalıdır

import { 
  loadUserDataFromFirebase
} from './user/userDataLoaderService';

import {
  saveUserDataToFirebase,
  updateUserCoinBalance
} from './user/saveUserDataService';

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
