
import { User } from "firebase/auth";
import { toast } from "sonner";
import { clearUserData } from "@/utils/storage";
import { QueryCacheManager } from "@/services/db";
import { useFirebaseDataLoader } from "@/hooks/user/useFirebaseDataLoader";
import { debugLog } from "@/utils/debugUtils";
import { useInitialUserData } from "./useInitialUserData";
import { useOfflineManager } from "./useOfflineManager";
import { usePeriodicSync } from "./usePeriodicSync";
import { useCacheCleanup } from "./useCacheCleanup";

export interface UserDataState {
  userData: UserData | null;
  loading: boolean;
  dataSource: 'firebase' | 'cache' | 'local' | null;
}

export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const {
    userData,
    setUserData,
    loading,
    setLoading,
    dataSource,
    setDataSource,
    errorOccurred,
    setErrorOccurred,
    loadAttempt,
    setLoadAttempt,
    lastLoadedUserId,
    setLastLoadedUserId,
    isInitialized,
    setIsInitialized
  } = useInitialUserData();

  const { networkAvailable } = useOfflineManager();
  const { loadFirebaseUserData } = useFirebaseDataLoader();

  // Use specialized hooks for different responsibilities
  usePeriodicSync(currentUser, networkAvailable, loadFirebaseUserData, setUserData);
  useCacheCleanup();

  useEffect(() => {
    const loadUserData = async () => {
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setDataSource(null);
        return;
      }

      // Kullanıcı değiştiğinde verileri temizle
      if (lastLoadedUserId && lastLoadedUserId !== currentUser.uid) {
        debugLog("useUserDataLoader", "Kullanıcı değişti, veriler temizleniyor", 
          { lastUser: lastLoadedUserId, newUser: currentUser.uid });
        clearUserData();
        QueryCacheManager.invalidate(new RegExp(`^userData_${lastLoadedUserId}`));
        setUserData(null);
      }

      setLastLoadedUserId(currentUser.uid);

      // Load from Firebase if network is available
      if (networkAvailable) {
        try {
          const { data: firebaseData, source } = await loadFirebaseUserData(currentUser.uid);
          if (firebaseData) {
            setUserData(firebaseData);
            setDataSource(source as 'firebase' | 'cache' | 'local');
            debugLog("useUserDataLoader", `Veriler ${source} kaynağından yüklendi:`, firebaseData);
          }
        } catch (error) {
          setErrorOccurred(true);
          toast.error("Veri yüklenirken bir hata oluştu");
        }
      }

      setLoading(false);
    };

    loadUserData();
  }, [currentUser, authInitialized, errorOccurred, loadAttempt, lastLoadedUserId, networkAvailable]);

  // Initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized]);

  return { userData, loading, dataSource };
}
