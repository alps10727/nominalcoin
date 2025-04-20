
import { toast } from "sonner";
import { User } from "@supabase/supabase-js"; // Changed from firebase/auth to supabase
import { loginUser, logoutUser, registerUser, UserRegistrationData } from "@/services/authService";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: UserRegistrationData) => Promise<boolean>;
}

export function useAuthActions(): AuthActions {
  const { t } = useLanguage();
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      debugLog("useAuthActions", "Starting login process:", email);
      const user = await loginUser(email, password);
      if (user) {
        toast.success(t("auth.loginSuccess"));
        return true;
      }
      return false;
    } catch (error) {
      errorLog("useAuthActions", "Login error:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("user-not-found") || 
         errorMessage.includes("wrong-password") || 
         errorMessage.includes("invalid-credential") ||
         errorMessage.includes("invalid-email")) {
        toast.error(t("auth.invalidCredentials"));
      } else if (errorMessage.includes("too-many-requests")) {
        toast.error(t("auth.tooManyRequests"));
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error(t("auth.networkError"));
      } else {
        toast.error(t("auth.loginFailed") + ": " + errorMessage);
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      toast.success(t("auth.logoutSuccess"));
    } catch (error) {
      errorLog("useAuthActions", "Logout error:", error);
      toast.error(t("auth.logoutFailed") + ": " + (error as Error).message);
    }
  };

  const register = async (email: string, password: string, userData: UserRegistrationData = {}): Promise<boolean> => {
    try {
      debugLog("useAuthActions", "Starting registration:", email);
      const user = await registerUser(email, password, userData);
      
      if (user) {
        debugLog("useAuthActions", "Registration successful:", user.uid);
        
        // Show different toast message based on referral status
        if (userData.referralCode) {
          toast.success(t("auth.registrationWithReferralSuccess"));
        } else {
          toast.success(t("auth.registrationSuccess"));
        }
        
        return true;
      }
      
      debugLog("useAuthActions", "Registration failed: No user data returned");
      return false;
    } catch (error) {
      errorLog("useAuthActions", "Registration error:", error);
      const errorMessage = (error as Error).message;
      const errorCode = (error as any).code || '';
      
      if (errorMessage.includes("email-already-in-use")) {
        toast.error(t("auth.emailInUse"));
      } else if (errorMessage.includes("weak-password")) {
        toast.error(t("auth.weakPassword"));
      } else if (errorMessage.includes("invalid-email")) {
        toast.error(t("auth.invalidEmail"));
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error(t("auth.networkError"));
      } else if (errorMessage.includes("invalid-referral")) {
        toast.error(t("auth.invalidReferral"));
      } else if (errorCode === "over_email_send_rate_limit" || errorMessage.includes("email rate limit exceeded")) {
        toast.error(t("auth.emailRateLimitExceeded"));
      } else {
        toast.error(t("auth.registrationFailed") + ": " + errorMessage);
      }
      
      // Let the error propagate so it can be handled by components that display specific error UI
      throw error;
    }
  };

  return { login, logout, register };
}
