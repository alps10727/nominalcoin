import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { loadUserData, saveUserData, UserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  dataSource: 'firebase' | 'local' | null;
}

function validateUserData(data: any): data is UserData {
  return (
    data !== null &&
    typeof data === 'object' &&
    (typeof data.balance === 'number' || data.balance === undefined) &&
    (typeof data.miningRate === 'number' || data.miningRate === undefined) &&
    (typeof data.lastSaved === 'number' || data.lastSaved === undefined)
  );
}

function ensureValidUserData(data: any, userId?: string): UserData {
  if (validateUserData(data)) {
    return data;
  }
  
  return {
    balance: typeof data?.balance === 'number' ? data.balance : 0,
    miningRate: typeof data?.miningRate === 'number' ? data.miningRate : 0.1,
    lastSaved: typeof data?.lastSaved === 'number' ? data.lastSaved : Date.now(),
    miningActive: !!data?.miningActive,
    userId: userId || data?.userId
  };
}

export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firebase' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let userDataTimeoutId: NodeJS.Timeout;
    let isActive = true; // Belleği sızıntısı önleyici

    const loadData = async () => {
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setDataSource(null);
        return;
      }

      try {
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan kullanıcı verileri yüklendi:", localData);
          
          debugLog("useUserDataLoader", "Firebase'den veri yükleniyor...");
        }
        
        try {
          const timeoutPromise = new Promise((_, reject) => {
            userDataTimeoutId = setTimeout(() => {
              reject(new Error("Firebase veri yükleme zaman aşımı"));
            }, 10000);
          });
          
          const firebaseDataPromise = loadUserDataFromFirebase(currentUser.uid);
          
          const firebaseData = await Promise.race([firebaseDataPromise, timeoutPromise]) as any;
          clearTimeout(userDataTimeoutId);
          
          if (isActive) {
            if (firebaseData) {
              debugLog("useUserDataLoader", "Firebase'den kullanıcı verileri yüklendi:", firebaseData);
              
              const validatedData = ensureValidUserData(firebaseData, currentUser.uid);
              setUserData(validatedData);
              setDataSource('firebase');
              
              saveUserData(validatedData);
            } else if (!localData) {
              const emptyData: UserData = {
                balance: 0,
                miningRate: 0.1,
                lastSaved: Date.now(),
                miningActive: false,
                userId: currentUser?.uid
              };
              setUserData(emptyData);
              saveUserData(emptyData);
              setDataSource('local');
              
              toast.warning("Kullanıcı verileriniz bulunamadı. Yeni profil oluşturuldu.");
            }
            
            setLoading(false);
          }
        } catch (error) {
          clearTimeout(userDataTimeoutId);
          
          if (isActive) {
            errorLog("useUserDataLoader", "Firebase veri yükleme hatası:", error);
            
            if (!localData) {
              const emptyData: UserData = {
                balance: 0,
                miningRate: 0.1,
                lastSaved: Date.now(),
                miningActive: false,
                userId: currentUser?.uid
              };
              setUserData(emptyData);
              saveUserData(emptyData);
            }
            
            setDataSource('local');
            setLoading(false);
            
            toast.error("Firebase'e bağlanırken hata oluştu. Verileriniz yerel olarak kaydedilecek.");
          }
        }
      } catch (error) {
        if (isActive) {
          errorLog("useUserDataLoader", "Kullanıcı verileri yüklenirken kritik hata:", error);
          
          const emptyData: UserData = {
            balance: 0,
            miningRate: 0.1,
            lastSaved: Date.now(),
            miningActive: false,
            userId: currentUser?.uid
          };
          setUserData(emptyData);
          saveUserData(emptyData);
          setDataSource('local');
          setLoading(false);
          
          toast.error("Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
      clearTimeout(userDataTimeoutId);
    };
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  return { userData, loading, dataSource };
}
