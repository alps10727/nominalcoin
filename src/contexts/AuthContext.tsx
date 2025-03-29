
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/config/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { 
  loginUser, 
  logoutUser, 
  registerUser,
  saveUserDataToFirebase,
  loadUserDataFromFirebase
} from "@/services/firebaseService";
import { toast } from "sonner";

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

  // Auth değişikliklerini dinle
  useEffect(() => {
    console.log("Auth Provider başlatılıyor...");
    let authTimeoutId: NodeJS.Timeout;
    
    // Firebase Auth'un 10 saniyeden fazla yanıt vermemesi durumunda loading durumunu kapat
    authTimeoutId = setTimeout(() => {
      if (loading && !authInitialized) {
        console.log("Firebase Auth zaman aşımına uğradı, kullanıcıyı çıkış yapmış olarak işaretle");
        setLoading(false);
        setCurrentUser(null);
        setAuthInitialized(true);
      }
    }, 5000);
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth durumu değişti:", user ? user.email : 'Kullanıcı yok');
      clearTimeout(authTimeoutId);
      setCurrentUser(user);
      setAuthInitialized(true);
      
      if (user) {
        // Kullanıcı oturum açtıysa verilerini yükle
        try {
          const userDataFromFirebase = await loadUserDataFromFirebase(user.uid);
          setUserData(userDataFromFirebase);
        } catch (error) {
          console.error("Kullanıcı verilerini yükleme hatası:", error);
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

  // Giriş işlevi
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
      // Firebase hata mesajlarını Türkçe'ye çevir
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

  // Çıkış işlevi
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      toast.success("Çıkış yapıldı");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      toast.error("Çıkış yapılamadı: " + (error as Error).message);
    }
  };

  // Kayıt işlevi - Timeout kontrolü iyileştirildi
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Kayıt işlemi başlatılıyor:", email);
      const user = await registerUser(email, password, {});
      
      // Eğer null olmayan bir kullanıcı değeri döndüyse, işlem başarılıdır
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
      
      // Firebase hata mesajlarını Türkçe'ye çevir
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

  // Kullanıcı verilerini güncelleme işlevi
  const updateUserData = async (data: any): Promise<void> => {
    if (currentUser) {
      try {
        await saveUserDataToFirebase(currentUser.uid, {
          ...userData,
          ...data
        });
        setUserData(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error("Veri güncelleme hatası:", error);
        toast.error("Veriler güncellenemedi: " + (error as Error).message);
      }
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
