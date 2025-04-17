
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

/**
 * Authentication state hook with Supabase integration
 * Note: This is now a wrapper for useSupabaseAuth for backwards compatibility
 */
export function useAuthState() {
  try {
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
  } catch (error) {
    console.error("Error in useAuthState:", error);
    // Provide fallback values to prevent app crashes
    return {
      currentUser: null,
      userData: null,
      loading: false,
      isOffline: true,
      updateUserData: async () => {},
      dataSource: 'local'
    };
  }
}
