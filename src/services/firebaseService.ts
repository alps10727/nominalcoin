
// Bu dosya geriye dönük uyumluluk için mevcut
// Yeni kod doğrudan yeni servis dosyalarını kullanmalıdır

import { 
  loadUserDataFromSupabase as loadUserDataFromFirebase
} from './user/userDataLoaderService';

import {
  saveUserDataToSupabase as saveUserDataToFirebase,
} from './user/saveUserDataService';

import {
  updateUserCoinBalance
} from './user/updateBalanceService';

import {
  initializeMiningStateFromSupabase as initializeMiningStateFromFirebase 
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
