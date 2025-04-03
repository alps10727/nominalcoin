
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { loadUserData, saveUserData } from "@/utils/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface UserDataState {
  userData: any | null;
  loading: boolean;
  dataSource: 'firebase' | 'local' | null;
}

export function useUserDataLoader(
  currentUser: User | null,
  authInitialized: boolean
): UserDataState {
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'firebase' | 'local' | null>(null);
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let userDataTimeoutId: NodeJS.Timeout;
    let isActive = true; // Belleği sızıntısı önleyici

    const loadData = async () => {
      // Eğer kullanıcı yoksa veya auth başlatılmamışsa, veri yüklemeye çalışma
      if (!authInitialized) return;
      
      if (!currentUser) {
        setUserData(null);
        setLoading(false);
        setDataSource(null);
        return;
      }

      try {
        // Hızlı yükleme için önce yerel verileri kontrol et
        const localData = loadUserData();
        if (localData) {
          setUserData(localData);
          setDataSource('local');
          debugLog("useUserDataLoader", "Yerel depodan kullanıcı verileri yüklendi:", localData);
          
          // Firebase verileri yüklenene kadar geçici olarak yerel verileri göster
          // Yükleme durumunu etkin tut - Firebase verileri yüklenecek
          debugLog("useUserDataLoader", "Firebase'den veri yükleniyor...");
        }
        
        // Firebase'den veri yüklemeyi dene
        try {
          // Firebase zaman aşımı (10 saniye)
          const timeoutPromise = new Promise((_, reject) => {
            userDataTimeoutId = setTimeout(() => {
              reject(new Error("Firebase veri yükleme zaman aşımı"));
            }, 10000);
          });
          
          // Firebase veri yükleme işlemi
          const firebaseDataPromise = loadUserDataFromFirebase(currentUser.uid);
          
          // Hangisi önce tamamlanırsa
          const firebaseData = await Promise.race([firebaseDataPromise, timeoutPromise]);
          clearTimeout(userDataTimeoutId);
          
          if (isActive) {
            if (firebaseData) {
              debugLog("useUserDataLoader", "Firebase'den kullanıcı verileri yüklendi:", firebaseData);
              setUserData(firebaseData);
              setDataSource('firebase');
              
              // Yerel depoya da kaydet
              saveUserData(firebaseData);
            } else if (!localData) {
              // Firebase ve yerel veri yoksa, boş veri oluştur
              const emptyData = {
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
            
            // Eğer yerel veri yoksa ve Firebase hatası varsa, boş veri oluştur
            if (!localData) {
              const emptyData = {
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
            
            // Firebase bağlantı hatası bildir
            toast.error("Firebase'e bağlanırken hata oluştu. Verileriniz yerel olarak kaydedilecek.");
          }
        }
      } catch (error) {
        if (isActive) {
          errorLog("useUserDataLoader", "Kullanıcı verileri yüklenirken kritik hata:", error);
          
          // Kritik hata durumunda boş veri oluştur
          const emptyData = {
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
