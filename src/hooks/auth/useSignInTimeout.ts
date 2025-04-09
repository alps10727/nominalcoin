
import { useEffect } from "react";

export function useSignInTimeout(
  loading: boolean,
  offlineLoginAttempted: boolean,
  handleOfflineLogin: () => Promise<boolean>
) {
  useEffect(() => {
    console.log("SignIn component mounted");
    
    // Eğer giriş işlemi başlayıp 10 saniyeden fazla sürerse, otomatik olarak çevrimdışı modu dene
    const timeoutId = setTimeout(() => {
      if (loading && !offlineLoginAttempted) {
        console.log("Giriş zaman aşımına uğradı, çevrimdışı mod deneniyor");
        handleOfflineLogin();
      }
    }, 10000); // 10 saniye
    
    return () => {
      clearTimeout(timeoutId);
      console.log("SignIn component unmounted");
    };
  }, [loading, offlineLoginAttempted, handleOfflineLogin]);
}
