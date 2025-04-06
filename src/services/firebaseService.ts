
// This file exists for backwards compatibility
// New code should use the new service files directly

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
  sendPasswordResetEmail
} from './auth';

// Export all functions
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
