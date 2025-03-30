import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { 
  loginUser, 
  logoutUser, 
  registerUser 
} from "@/services/authService";
import {
  saveUserDataToFirebase,
  loadUserDataFromFirebase
} from "@/services/userService";
import { toast } from "sonner";
import { saveUserData, loadUserData } from "@/utils/storage";

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<boolean>;
  userData: any | null;
  updateUserData: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    console.log("Auth Provider başlatılıyor...");
    let authTimeoutId: NodeJS.Timeout;
    
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        console.log("Firebase Auth zaman aşımına uğradı, kullanıcıyı çıkış yapmış olarak işaretle");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
        
        try {
          const localUserData = loadUserData();
          if (localUserData) {
            setUserData(localUserData);
            console.log("Yerel depodan kullanıcı verileri yüklendi (offline mod)");
          }
        } catch (e) {
          console.error("Yerel depodan veri yükleme hatası:", e);
        }
      }
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth durumu değişti:", user ? user.email : 'Kullanıcı yok');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        try {
          const localData = loadUserData();
          if (localData) {
            setUserData(localData);
          }
          
          const userDataFromFirebase = await loadUserDataFromFirebase(user.uid);
          if (userDataFromFirebase) {
            setUserData(userDataFromFirebase);
            saveUserData(userDataFromFirebase);
          }
        } catch (error) {
          console.error("Kullanıcı verilerini yükleme hatası:", error);
          
          const localData = loadUserData();
          if (localData) {
            console.log("Offline mod: Yerel depodan kullanıcı verileri kullanılıyor");
            setUserData(localData);
          }
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(authTimeoutId);
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        toast.success("Başarıyla giriş yapıldı!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Giriş hatası:", error);
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("user-not-found") || errorMessage.includes("wrong-password")) {
        toast.error("Email veya şifre hatalı.");
      } else if (errorMessage.includes("too-many-requests")) {
        toast.error("Çok fazla deneme yapıldı. Lütfen daha sonra tekrar deneyin.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error("İnternet bağlantınızı kontrol edin.");
      } else {
        toast.error("Giriş yapılamadı: " + errorMessage);
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      toast.success("Çıkış yapıldı");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      toast.error("Çıkış yapılamadı: " + (error as Error).message);
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Kayıt işlemi başlatılıyor:", email);
      const user = await registerUser(email, password, {});
      
      if (user) {
        console.log("Kayıt işlemi başarılı:", user.uid);
        toast.success("Hesabınız başarıyla oluşturuldu!");
        return true;
      }
      
      console.log("Kayıt işlemi başarısız: Kullanıcı verisi döndürülmedi");
      return false;
    } catch (error) {
      console.error("Kayıt işlemi hatası:", error);
      const errorMessage = (error as Error).message;
      
      if (errorMessage.includes("email-already-in-use")) {
        toast.error("Bu email adresi zaten kullanılıyor.");
      } else if (errorMessage.includes("weak-password")) {
        toast.error("Şifre en az 6 karakter olmalıdır.");
      } else if (errorMessage.includes("invalid-email")) {
        toast.error("Geçersiz email adresi.");
      } else if (errorMessage.includes("network-request-failed") || errorMessage.includes("timeout")) {
        toast.error("İnternet bağlantınızı kontrol edin.");
      } else {
        toast.error("Kayıt yapılamadı: " + errorMessage);
      }
      return false;
    }
  };

  const updateUserData = async (data: any): Promise<void> => {
    if (currentUser) {
      try {
        console.log("Updating user data:", data);
        const updatedData = {
          ...userData,
          ...data
        };
        
        await saveUserDataToFirebase(currentUser.uid, updatedData);
        saveUserData(updatedData);
        
        setUserData(prev => ({ ...prev, ...data }));
        console.log("User data updated successfully");
      } catch (error) {
        console.error("Veri güncelleme hatası:", error);
        
        if ((error as any)?.code === 'unavailable') {
          const updatedData = {
            ...userData,
            ...data
          };
          saveUserData(updatedData);
          setUserData(prev => ({ ...prev, ...data }));
          toast.info("Veriler çevrimdışı modda kaydedildi. İnternet bağlantısı kurulduğunda otomatik olarak senkronize edilecek.");
        } else {
          toast.error("Veriler güncellenemedi: " + (error as Error).message);
        }
      }
    } else {
      console.warn("Cannot update user data - no user is logged in");
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
    userData,
    updateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
