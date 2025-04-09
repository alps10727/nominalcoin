
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

// Admin e-posta bilgisi
const ADMIN_EMAIL = "ncowner0001@gmail.com";

export function useAdminRedirect() {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      if (currentUser && !authLoading) {
        try {
          // Admin e-posta kontrolü
          if (currentUser.email === ADMIN_EMAIL) {
            navigate("/admin");
            return;
          }
          
          // Kullanıcının admin olup olmadığını Firebase'den kontrol et
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists() && userDoc.data()?.isAdmin === true) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Admin durumu kontrol edilirken hata:", error);
          navigate("/");
        }
      }
    };
    
    checkUserAndRedirect();
  }, [currentUser, authLoading, navigate]);
}
