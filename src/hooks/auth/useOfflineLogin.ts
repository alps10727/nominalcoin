
import { useState } from "react";
import { loadUserData } from "@/utils/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useOfflineLogin() {
  const [offlineLoginAttempted, setOfflineLoginAttempted] = useState(false);
  const navigate = useNavigate();

  const attemptOfflineLogin = async (email: string): Promise<boolean> => {
    setOfflineLoginAttempted(true);
    
    // LocalStorage'da kayıtlı kullanıcı verilerini kontrol et
    const localUserData = loadUserData();
    
    if (localUserData && localUserData.emailAddress === email) {
      console.log("Çevrimdışı giriş başarılı");
      toast.success("Çevrimdışı modda giriş yapıldı. Sınırlı özellikler kullanılabilir.");
      navigate("/");
      return true;
    }
    
    return false;
  };

  return {
    offlineLoginAttempted,
    attemptOfflineLogin
  };
}
