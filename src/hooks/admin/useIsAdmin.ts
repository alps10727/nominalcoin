
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
      if (!currentUser) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Önce sabit e-posta listesine göre kontrol et
        if (ADMIN_EMAILS.includes(currentUser.email || "")) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // Ardından Firestore'daki kullanıcı belgesini kontrol et
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists() && userDoc.data()?.isAdmin === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin durumu kontrol edilirken hata:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  return { isAdmin, loading };
}
