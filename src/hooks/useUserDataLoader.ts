
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { UserData, saveUserData, clearUserData } from "@/utils/storage";
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
  const [lastLoadedUserId, setLastLoadedUserId] = useState<string | null>(null);

  const { loadLocalUserData, ensureReferralData, createDefaultUserData } = useLocalDataLoader();
  const { loadFirebaseUserData, mergeUserData } = useFirebaseDataLoader();
  const { ensureValidUserData } = useUserDataValidator();

  useEffect(() => {
    let isActive = true; // Memory leak önleme için
    
    const loadData = async () => {
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
        setUserData(null);
      }
      
      // Güncel kullanıcı ID'sini kaydet
      setLastLoadedUserId(currentUser.uid);

      try {
        // Mevcut kullanıcının yerel verilerini yükle
        let localData = loadLocalUserData();
        
        // Farklı kullanıcı kontrolü
        if (localData && localData.userId && localData.userId !== currentUser.uid) {
          debugLog("useUserDataLoader", "Farklı kullanıcıya ait yerel veri temizleniyor", 
            { storedId: localData.userId, currentId: currentUser.uid });
          clearUserData();
          localData = null;
        }
        
        // Referans kodunu kontrol et ve gerekirse oluştur
        localData = ensureReferralData(localData, currentUser.uid);
        
        if (localData) {
          // Geçici olarak yerel veriyi kullan (hız için)
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan veriler yüklendi:", localData);
        }
        
        try {
          // Firebase'den verileri yüklemeyi dene
          const { data: firebaseData, source } = await loadFirebaseUserData(currentUser.uid);
          
          if (!isActive) return; // Component unmounted
          
          if (source === 'firebase' && firebaseData) {
            debugLog("useUserDataLoader", "Firebase verileri yüklendi:", firebaseData);
            
            // Yerel ve Firebase verilerini karşılaştır ve akıllı birleştirme yap
            // Bu işlem, manipüle edilmiş localStorage verilerini tespit edecek
            const mergedData = mergeUserData(localData, firebaseData);
            const validatedData = ensureValidUserData(mergedData, currentUser.uid);
            
            // Firebase ve yerel depo arasında uyuşmazlık varsa bildirim göster
            if (localData && Math.abs(localData.balance - firebaseData.balance) > 0.1) {
              if (localData.balance > firebaseData.balance * 1.2) { // %20'den fazla fark varsa şüpheli
                toast.warning("Hesap bakiyesinde tutarsızlık tespit edildi. Doğru değer kullanılıyor.");
                debugLog("useUserDataLoader", "Şüpheli bakiye farkı tespit edildi", 
                  { local: localData.balance, server: firebaseData.balance });
              }
            }
            
            setUserData(validatedData);
            setDataSource('firebase');
            saveUserData(validatedData, currentUser.uid);
          } else if (source === 'timeout' && !localData) {
            // Firebase'e erişilemedi ve yerel veri de yoksa, yeni veri oluştur
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData, currentUser.uid);
            setDataSource('local');
            
            toast.warning("Kullanıcı verileriniz bulunamadı. Yeni profil oluşturuldu.");
          }
        } catch (error) {
          if (!isActive) return; // Component unmounted
          
          handleFirebaseConnectionError(error, "useUserDataLoader");
          
          if (!localData) {
            const emptyData = createDefaultUserData(currentUser.uid);
            setUserData(emptyData);
            saveUserData(emptyData, currentUser.uid);
            setDataSource('local');
          }
        }
        
        setLoading(false);
      } catch (error) {
        if (!isActive) return; // Component unmounted
        
        errorLog("useUserDataLoader", "Kullanıcı verileri yüklenirken kritik hata:", error);
        
        const emptyData = createDefaultUserData(currentUser?.uid);
        
        setUserData(emptyData);
        saveUserData(emptyData, currentUser?.uid);
        setDataSource('local');
        setLoading(false);
        
        toast.error("Veri yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    };

    loadData();

    return () => {
      isActive = false; // Temizleme
    };
  }, [currentUser, authInitialized, errorOccurred, loadAttempt]);

  return { userData, loading, dataSource };
}
