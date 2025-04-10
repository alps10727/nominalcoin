
import { USER_ID_STORAGE_KEY } from './constants';

/**
 * Get next available user ID
 * This function reads the last assigned ID from localStorage and increments it
 */
export function getNextUserId(): string {
  try {
    let nextId = 1; // Default start at 1
    
    try {
      const lastIdData = localStorage.getItem(USER_ID_STORAGE_KEY);
      if (lastIdData) {
        nextId = parseInt(lastIdData, 10) + 1;
      }
    } catch (readErr) {
      console.error('User ID okuma hatası:', readErr);
      // Fail gracefully, continue with default
    }
    
    // Save the new last ID
    try {
      localStorage.setItem(USER_ID_STORAGE_KEY, nextId.toString());
    } catch (writeErr) {
      console.error('User ID yazma hatası:', writeErr);
    }
    
    // Format with leading zeros to create 8-digit ID
    return nextId.toString().padStart(8, '0');
  } catch (err) {
    console.error('Error generating user ID:', err);
    // Fallback to timestamp-based ID if something goes wrong
    return Date.now().toString().slice(-8).padStart(8, '0');
  }
}
