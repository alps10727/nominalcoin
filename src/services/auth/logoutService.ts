
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { clearUserData } from "@/utils/storage";

export async function logoutUser(): Promise<void> {
  try {
    // Clear all user data from local storage first
    clearUserData(true); // Pass true to clear ALL user data
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    debugLog("authService", "User logged out successfully");
    
    // Force clear any problematic cached data
    localStorage.removeItem('supabase.auth.token');
    
    // Clear any other user-specific items
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('fcMinerUserData') || 
        key === 'userReferralCode' || 
        key.includes('supabase.auth')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
  } catch (error) {
    errorLog("authService", "Logout error:", error);
    
    // Even if there's an error, try to clear local storage
    try {
      clearUserData(true);
    } catch (e) {
      // Ignore any errors when clearing
    }
    
    throw error;
  }
}
