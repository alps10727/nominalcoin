
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

  // Auth değişikliklerini dinle
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Kullanıcı oturum açtıysa verilerini yükle
        const userDataFromFirebase = await loadUserDataFromFirebase(user.uid);
        setUserData(userDataFromFirebase);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
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
      toast.error("Giriş yapılamadı: " + (error as Error).message);
      return false;
    }
  };

  // Çıkış işlevi
  const logout = async (): Promise<void> => {
    try {
      await logoutUser();
      toast.success("Çıkış yapıldı");
    } catch (error) {
      toast.error("Çıkış yapılamadı: " + (error as Error).message);
    }
  };

  // Kayıt işlevi
  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await registerUser(email, password, {});
      if (user) {
        toast.success("Hesap başarıyla oluşturuldu!");
        return true;
      }
      return false;
    } catch (error) {
      toast.error("Kayıt yapılamadı: " + (error as Error).message);
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
      {!loading && children}
    </AuthContext.Provider>
  );
}
