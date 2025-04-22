
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AuthResponse } from "./types";
import { toast } from "sonner";

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    // First check if the user exists but might not be confirmed
    // Changed from getUserByEmail to the correct method getUserById
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
      
    // Then attempt the login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
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
              password
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
    return { user: data.user };
  } catch (error) {
    errorLog("authService", "Login error:", error);
    return { user: null, error: error as Error };
  }
}
