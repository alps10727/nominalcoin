
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { clearUserData } from "@/utils/storage";

export async function logoutUser(): Promise<void> {
  try {
    debugLog("logoutService", "Starting logout process");
    
    // Clear all user data from local storage first
    clearUserData(true); // Pass true to clear ALL user data
    
    // Clear any specific user-related items that might not be caught by clearUserData
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('fcMinerUserData') || 
        key === 'userReferralCode' || 
        key.includes('supabase.auth') ||
        key.includes('sb-') ||
        key.includes('user-')
      )) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
        debugLog("logoutService", `Removed item: ${key}`);
      } catch (e) {
        // Ignore any errors when clearing
      }
    });
    
    // Then sign out from Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Ensure complete signout across all tabs/devices
    });
    
    if (error) throw error;
    
    debugLog("logoutService", "User logged out successfully");
    
    // Force clear any problematic cached data
    localStorage.removeItem('supabase.auth.token');
    
    // Final verification that all user data is cleared
    debugLog("logoutService", "Final localStorage cleanup check");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('fcMinerUserData') || 
        key === 'userReferralCode' || 
        key.includes('supabase') ||
        key.includes('sb-')
      )) {
        try {
          localStorage.removeItem(key);
          debugLog("logoutService", `Removed remaining item: ${key}`);
        } catch (e) {
          // Ignore any errors
        }
      }
    }
    
    // Force browser to refresh auth state
    setTimeout(() => {
      supabase.auth.refreshSession();
    }, 100);
    
  } catch (error) {
    errorLog("logoutService", "Logout error:", error);
    
    // Even if there's an error, try to clear local storage
    try {
      clearUserData(true);
    } catch (e) {
      // Ignore any errors when clearing
    }
    
    throw error;
  }
}
