import { toast } from "sonner";
import { User } from "firebase/auth";
import { loginUser, logoutUser, registerUser, UserRegistrationData } from "@/services/authService";
import { debugLog, errorLog } from "@/utils/debugUtils";

// Admin kimlik bilgileri
const ADMIN_CREDENTIALS = {
  email: "ncowner0001@gmail.com",
  password: "1069GYSF"
};

interface AuthActions {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: UserRegistrationData) => Promise<boolean>;
}

export function useAuthActions(): AuthActions {
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Admin giriş kontrolü - Firebase'i atla
      if (email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && 
          password === ADMIN_CREDENTIALS.password) {
        debugLog("useAuthActions", "Admin girişi tespit edildi, Firebase atlanıyor");
        
        // Admin oturumunu local storage'a kaydet
        localStorage.setItem('isAdminSession', 'true');
        
        // Başarılı bildirim göster
        toast.success("Admin girişi başarılı!");
        return true;
      }
      
      debugLog("useAuthActions", "Starting login process:", email);
      const user = await loginUser(email, password);
      if (user) {
        toast.success("Successfully logged in!");
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
        toast.error("Email veya şifre hatalı.");
      } else if (errorMessage.includes("too-many-requests")) {
        toast.error("Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error("Lütfen internet bağlantınızı kontrol edin.");
      } else {
        toast.error("Giriş başarısız: " + errorMessage);
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      toast.success("Logged out");
    } catch (error) {
      errorLog("useAuthActions", "Logout error:", error);
      toast.error("Failed to log out: " + (error as Error).message);
    }
  };

  const register = async (email: string, password: string, userData: UserRegistrationData = {}): Promise<boolean> => {
    try {
      debugLog("useAuthActions", "Starting registration:", email);
      const user = await registerUser(email, password, userData);
      
      if (user) {
        debugLog("useAuthActions", "Registration successful:", user.uid);
        toast.success("Your account was created successfully!");
        return true;
      }
      
      debugLog("useAuthActions", "Registration failed: No user data returned");
      return false;
    } catch (error) {
      errorLog("useAuthActions", "Registration error:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("email-already-in-use")) {
        toast.error("This email is already in use.");
      } else if (errorMessage.includes("weak-password")) {
        toast.error("Password must be at least 6 characters.");
      } else if (errorMessage.includes("invalid-email")) {
        toast.error("Invalid email address.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error("Please check your internet connection.");
      } else {
        toast.error("Registration failed: " + errorMessage);
      }
      return false;
    }
  };

  return { login, logout, register };
}
