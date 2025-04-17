
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

/**
 * Authentication state hook with Supabase integration
 * Note: This is now a wrapper for useSupabaseAuth for backwards compatibility
 */
export function useAuthState() {
  const { user: currentUser, userData, isLoading: loading, isOffline, updateUserData } = useSupabaseAuth();

  // Backward compatibility with old Firebase auth system
  return { 
    currentUser,
    userData, 
    loading,
    isOffline,
    updateUserData,
    dataSource: isOffline ? 'local' : 'supabase'
  };
}
