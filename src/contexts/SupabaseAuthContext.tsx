
import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/types/storage";
import { useSupabaseDataManager } from "@/hooks/supabase/useSupabaseDataManager";

interface SupabaseAuthContextProps {
  user: User | null;
  session: Session | null;
  userData: UserData | null;
  isLoading: boolean;
  isOffline: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, userData?: any) => Promise<boolean>;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextProps | undefined>(undefined);

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  const { loadUserData, updateUserData, isUpdating } = useSupabaseDataManager(user?.id);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // User profile değiştiğinde veriler güncelleniyor
        if (event === 'SIGNED_IN') {
          // Use setTimeout to prevent auth state deadlock
          setTimeout(() => {
            fetchUserProfile(newSession?.user?.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserData(null);
        }
      }
    );

    // İlk yüklemede session kontrolü
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId?: string) => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await loadUserData();
      setUserData(data);
    } catch (error) {
      errorLog("SupabaseAuthContext", "Error fetching user data:", error);
      toast.error("Kullanıcı verileri yüklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Başarıyla giriş yapıldı!");
      return true;
    } catch (error: any) {
      errorLog("SupabaseAuthContext", "Login error:", error);
      
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Email veya şifre hatalı.");
      } else if (error.message.includes("too many requests")) {
        toast.error("Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.");
      } else if (error.message.includes("network")) {
        toast.error("Lütfen internet bağlantınızı kontrol edin.");
      } else {
        toast.error(error.message || "Giriş başarısız oldu");
      }
      
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      toast.success("Başarıyla çıkış yapıldı");
    } catch (error: any) {
      errorLog("SupabaseAuthContext", "Logout error:", error);
      toast.error(`Çıkış yapılamadı: ${error.message}`);
    }
  };

  // Register function
  const register = async (email: string, password: string, userData: any = {}): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || ""
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Hesabınız başarıyla oluşturuldu!");
      return true;
    } catch (error: any) {
      errorLog("SupabaseAuthContext", "Registration error:", error);
      
      if (error.message.includes("email already in use")) {
        toast.error("Bu email adresi zaten kullanımda.");
      } else if (error.message.includes("password")) {
        toast.error("Şifre en az 6 karakter olmalıdır.");
      } else if (error.message.includes("invalid email")) {
        toast.error("Geçersiz email adresi.");
      } else if (error.message.includes("network")) {
        toast.error("Lütfen internet bağlantınızı kontrol edin.");
      } else {
        toast.error(error.message || "Kayıt başarısız oldu");
      }
      
      return false;
    }
  };

  // Veri yönetimi fonksiyonları
  const handleUpdateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!user) return;
    
    try {
      await updateUserData(data);
      // Güncel kullanıcı verileri
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (error) {
      errorLog("SupabaseAuthContext", "Update error:", error);
      toast.error("Veri güncellenirken bir hata oluştu");
    }
  };

  const value = {
    user,
    session,
    userData,
    isLoading,
    isOffline,
    login,
    logout,
    register,
    updateUserData: handleUpdateUserData
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
