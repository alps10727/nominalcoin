
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface AuthObserverState {
  currentUser: User | null;
  loading: boolean;
  authInitialized: boolean;
}

/**
 * Hook that observes Supabase authentication state changes
 * Provides authentication initialization status and user information
 */
export function useAuthObserver(): AuthObserverState {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    debugLog("useAuthObserver", "Authentication observer initializing...");
    let authTimeoutId: NodeJS.Timeout;
    
    // Set timeout for Supabase auth initialization (30 seconds)
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        debugLog("useAuthObserver", "Supabase Auth timed out, falling back to offline mode");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
        console.warn("Supabase Authentication timed out, offline mode activated");
      }
    }, 30000);

    // Get initial session
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        errorLog("useAuthObserver", "Get session error:", error);
        setCurrentUser(null);
      } else {
        setCurrentUser(data.session?.user || null);
      }
      setLoading(false);
      setAuthInitialized(true);
      clearTimeout(authTimeoutId);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        debugLog("useAuthObserver", "Auth state changed:", event);
        setCurrentUser(session?.user || null);
        setAuthInitialized(true);
        setLoading(false);
        clearTimeout(authTimeoutId);
      }
    );

    // Cleanup function
    return () => {
      clearTimeout(authTimeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return { currentUser, loading, authInitialized };
}
