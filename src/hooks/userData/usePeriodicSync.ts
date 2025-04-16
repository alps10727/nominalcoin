
import { useEffect } from "react";
import { User } from "firebase/auth";
import { UserData } from "@/types/storage";
import { QueryCacheManager } from "@/services/db";
import { debugLog } from "@/utils/debugUtils";

export function usePeriodicSync(
  currentUser: User | null,
  networkAvailable: boolean,
  loadFirebaseUserData: (userId: string) => Promise<{ data: UserData | null; source: string }>,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  useEffect(() => {
    // Periyodik yeniden doğrulama (5 dakikada bir)
    const refreshInterval = setInterval(() => {
      if (currentUser && networkAvailable) {
        // Sadece önbelleği güncelleyerek sunucu verilerini kontrol et
        loadFirebaseUserData(currentUser.uid)
          .then(({ data, source }) => {
            if (data && (source === 'firebase' || source === 'cache')) {
              setUserData(current => {
                if (!current) return data;
                
                if (data.balance > current.balance) {
                  debugLog("useUserDataLoader", "Sunucudan daha yüksek bakiye tespit edildi, güncelleniyor", {
                    currentBalance: current.balance,
                    serverBalance: data.balance
                  });
                  
                  return {
                    ...current,
                    balance: data.balance
                  };
                }
                return current;
              });
            }
          });
      }
    }, 300000); // 5 dakika
    
    return () => clearInterval(refreshInterval);
  }, [currentUser, networkAvailable, loadFirebaseUserData, setUserData]);
}
