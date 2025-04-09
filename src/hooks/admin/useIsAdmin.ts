
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

// Admin e-posta ve şifre bilgisi
const ADMIN_CREDENTIALS = {
  email: "ncowner0001@gmail.com",
  password: "1069GYSF"
};

// Diğer admin e-posta adresleri (ek admin kullanıcılar eklenebilir)
const ADMIN_EMAILS = [
  ADMIN_CREDENTIALS.email
  // diğer admin e-postaları buraya eklenebilir
];

export function useIsAdmin() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Önce localStorage kontrolü - özel admin oturumu kontrolü
      const isAdminSession = localStorage.getItem('isAdminSession') === 'true';
      
      if (isAdminSession) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Önce sabit e-posta listesine göre kontrol et
        if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
          setIsAdmin(true);
          localStorage.setItem('isAdminSession', 'true');
          setLoading(false);
          return;
        }
        
        // Ardından Firestore'daki kullanıcı belgesini kontrol et
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data()?.isAdmin === true) {
          setIsAdmin(true);
          localStorage.setItem('isAdminSession', 'true');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdminSession');
        }
      } catch (error) {
        console.error("Admin durumu kontrol edilirken hata:", error);
        setIsAdmin(false);
        localStorage.removeItem('isAdminSession');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  return { isAdmin, loading };
}
