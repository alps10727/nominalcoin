import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { UserData, saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { useLocalDataLoader } from "@/hooks/user/useLocalDataLoader";
import { useFirebaseDataLoader } from "@/hooks/user/useFirebaseDataLoader";
import { useUserDataValidator } from "@/hooks/user/useUserDataValidator";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";

export interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  dataSource: 'firebase' | 'local' | null;
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

  const { loadLocalUserData, ensureReferralData, createDefaultUserData } = useLocalDataLoader();
  const { loadFirebaseUserData, mergeUserData } = useFirebaseDataLoader();
  const { ensureValidUserData } = useUserDataValidator();

  useEffect(() => {
    let isActive = true; // Prevent memory leaks

    const loadData = async () => {
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setDataSource(null);
        return;
      }

      try {
        let localData = loadLocalUserData();
        localData = ensureReferralData(localData, currentUser.uid);
        
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Loaded data from local storage:", localData);
        }
        
        try {
          const { data: firebaseData, source } = await loadFirebaseUserData(currentUser.uid);
          
          if (!isActive) return; // Component unmounted
          
          if (source === 'firebase' && firebaseData) {
            debugLog("useUserDataLoader", "Firebase data loaded:", firebaseData);
            
            const mergedData = mergeUserData(localData, firebaseData);
            const validatedData = ensureValidUserData(mergedData, currentUser.uid);
            
            setUserData(validatedData);
            setDataSource('firebase');
            saveUserData(validatedData);
          } else if (source === 'timeout' && !localData) {
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData);
            setDataSource('local');
            
            toast.warning("Kullanıcı verileriniz bulunamadı. Yeni profil oluşturuldu.");
          }
        } catch (error) {
          if (!isActive) return; // Component unmounted
          
          handleFirebaseConnectionError(error, "useUserDataLoader");
          
          if (!localData) {
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData);
            setDataSource('local');
          }
        }
        
        setLoading(false);
      } catch (error) {
        if (!isActive) return; // Component unmounted
        
        errorLog("useUserDataLoader", "Critical error loading user data:", error);
        
        const localData = loadLocalUserData();
        const emptyData = createDefaultUserData(currentUser?.uid);
        
        if (localData) {
          emptyData.balance = localData.balance || 0;
          emptyData.miningRate = localData.miningRate || 0.1;
        }
        
        setUserData(emptyData);
        saveUserData(emptyData);
        setDataSource('local');
        setLoading(false);
        
        toast.error("Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    loadData();

    return () => {
      isActive = false; // Cleanup
    };
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  return { userData, loading, dataSource };
}
