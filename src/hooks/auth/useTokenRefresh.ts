
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Hook to automatically refresh authentication token before it expires
 * This implements token refresh mechanism for better security
 */
export function useTokenRefresh() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Function to refresh the token
    const refreshToken = async () => {
      try {
        debugLog("useTokenRefresh", "Refreshing token");
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          errorLog("useTokenRefresh", "Failed to refresh token:", error);
          return;
        }
        
        if (data.session) {
          debugLog("useTokenRefresh", "Token refreshed successfully");
          // Schedule the next refresh
          scheduleTokenRefresh(data.session.expires_at);
        }
      } catch (err) {
        errorLog("useTokenRefresh", "Token refresh error:", err);
      }
    };
    
    // Function to schedule the token refresh
    const scheduleTokenRefresh = (expiresAt: number | null) => {
      // Clear any existing timers
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      
      // If no expiry time, don't schedule a refresh
      if (!expiresAt) return;
      
      // Convert expires_at to milliseconds and calculate refresh time
      // Refresh 5 minutes before expiry
      const expiresAtMs = expiresAt * 1000;
      const timeUntilRefresh = Math.max(0, expiresAtMs - Date.now() - (5 * 60 * 1000));
      
      debugLog("useTokenRefresh", "Scheduling token refresh in", 
        `${Math.floor(timeUntilRefresh / 60000)} minutes`);
      
      // Set up the timer
      refreshTimerRef.current = setTimeout(refreshToken, timeUntilRefresh);
    };
    
    // Initialize by checking current session
    const initializeTokenRefresh = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          scheduleTokenRefresh(data.session.expires_at);
        }
      } catch (err) {
        errorLog("useTokenRefresh", "Error getting current session:", err);
      }
    };
    
    initializeTokenRefresh();
    
    // Clean up the timer when component unmounts
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);
}
