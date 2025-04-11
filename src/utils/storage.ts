
// Re-export everything from the refactored modules
// This maintains backward compatibility with existing code

export { loadUserData, saveUserData, clearUserData } from './storageOperations';
export { getNextUserId } from './userIdGenerator';
export type { UserData } from '../types/storage';
