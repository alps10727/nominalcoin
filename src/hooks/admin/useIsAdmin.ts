
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { isAdminEmail } from "@/config/adminConfig";

export function useIsAdmin() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // First check localStorage - special admin session check
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
        // First check against fixed email list
        if (currentUser.email && isAdminEmail(currentUser.email)) {
          setIsAdmin(true);
          localStorage.setItem('isAdminSession', 'true');
          setLoading(false);
          return;
        }
        
        // Then check the user doc in Firestore
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
