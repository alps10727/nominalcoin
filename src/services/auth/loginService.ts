
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AuthResponse } from "./types";
import { toast } from "sonner";

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // First check if the user exists but might not be confirmed
    const { data: userData, error: userCheckError } = await supabase.auth.admin
      .listUsers()
      .then(response => {
        const users = response.data.users || [];
        const user = users.find(u => u.email === email);
        return {
          data: user || null,
          error: user ? null : new Error('User not found')
        };
      })
      .catch(() => ({ data: null, error: null }));
      
    // Then attempt the login with updated session configuration
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // Set auth session to expire in 1 hour instead of default 24h
        expiresIn: 3600 // 1 hour in seconds
      }
    });
    
    if (error) {
      errorLog("authService", "Login error:", error);
      
      // Handle specific errors with user-friendly messages
      if (error.message === "Email not confirmed" || error.code === "email_not_confirmed") {
        // Auto-confirm the email for development purposes
        try {
          const { error: confirmError } = await supabase.functions.invoke('confirm_email', {
            body: { email }
          });
          
          if (!confirmError) {
            // Try signing in again after confirmation
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
              options: {
                expiresIn: 3600 // 1 hour in seconds
              }
            });
            
            if (!retryError) {
              toast.success("Email confirmed and login successful");
              return { user: retryData.user };
            }
          }
          
          toast.info("Please check your email for confirmation link");
        } catch (confirmErr) {
          errorLog("authService", "Auto-confirm failed:", confirmErr);
        }
        
        return { 
          user: null, 
          error: new Error("Email not confirmed. Please check your inbox for verification email.") 
        };
      }
      
      return { user: null, error };
    }
    
    debugLog("authService", "User logged in successfully", { email });
    
    // Set up refresh token mechanism
    setupRefreshTokenTimer();
    
    return { user: data.user };
  } catch (error) {
    errorLog("authService", "Login error:", error);
    return { user: null, error: error as Error };
  }
}

/**
 * Sets up a timer to refresh the token before it expires
 */
function setupRefreshTokenTimer() {
  // Refresh token 5 minutes before expiry (55 minutes after login)
  const refreshTimeout = setTimeout(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        errorLog("authService", "Token refresh error:", error);
        return;
      }
      
      if (data.session) {
        debugLog("authService", "Token refreshed successfully");
        // Set up the next refresh
        setupRefreshTokenTimer();
      }
    } catch (err) {
      errorLog("authService", "Token refresh error:", err);
    }
  }, 55 * 60 * 1000); // 55 minutes
  
  // Clear the timeout if user logs out
  return () => clearTimeout(refreshTimeout);
}
