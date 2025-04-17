
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AuthResponse } from "./types";

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      errorLog("authService", "Login error:", error);
      return { user: null, error };
    }
    
    debugLog("authService", "User logged in successfully", { email });
    return { user: data.user };
  } catch (error) {
    errorLog("authService", "Login error:", error);
    return { user: null, error: error as Error };
  }
}
