
import { UserData } from "@/utils/storage";
import { loadUserDataFromFirebase } from "@/services/userDataLoader";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";
import { QueryCacheManager } from "@/services/db";

/**
 * Firebase'den veri yükleme için geliştirilmiş kanca
 * Milyonlarca kullanıcı için optimize edilmiş
 */
export function useFirebaseDataLoader() {
  /**
   * Firebase'den kullanıcı verilerini zaman aşımı ile yükler
   */
  const loadFirebaseUserData = async (
    userId: string, 
    timeoutMs: number = 10000
  ): Promise<{ data: UserData | null; source: 'firebase' | 'cache' | 'timeout' }> => {
    try {
      debugLog("useFirebaseDataLoader", "Firebase'den veriler yükleniyor...");
      
      // Önce önbellekte kontrol et
      const cacheKey = `userData_${userId}`;
      const cachedData = QueryCacheManager.get<UserData>(cacheKey);
      
      if (cachedData) {
        debugLog("useFirebaseDataLoader", "Kullanıcı verisi önbellekten yüklendi", userId);
        return { data: cachedData, source: 'cache' };
      }
      
      // Önbellekte yoksa, Firebase'den yükle
      const timeoutPromise = new Promise<{ data: null; source: 'timeout' }>((resolve) => {
        setTimeout(() => {
          resolve({ data: null, source: 'timeout' });
        }, timeoutMs);
      });
      
      const firebasePromise = loadUserDataFromFirebase(userId).then(data => {
        // Başarılı yüklemeyi önbelleğe al (2 dakika TTL)
        if (data) {
          QueryCacheManager.set(cacheKey, data, 120000);
        }
        
        return {
          data,
          source: 'firebase' as const
        };
      });
      
      const result = await Promise.race([firebasePromise, timeoutPromise]);
      
      // Önbellek boyutunu yönet
      QueryCacheManager.manageSize(1000);
      
      return result;
      
    } catch (error) {
      handleFirebaseConnectionError(error, "useFirebaseDataLoader");
      return { data: null, source: 'timeout' };
    }
  };

  /**
   * Yerel ve Firebase verilerini güvenli bir şekilde birleştirir
   * Manipüle edilmiş verileri tespit etmek için gelişmiş kontroller içerir
   */
  const mergeUserData = (localData: UserData | null, firebaseData: UserData | null): UserData => {
    if (!firebaseData) return localData || { balance: 0, miningRate: 0.003, lastSaved: Date.now() };
    if (!localData) return firebaseData;

    // Şüpheli manipülasyon tespiti - daha gelişmiş hile tespiti
    const isLocalBalanceSuspicious = localData && firebaseData && (
      localData.balance > firebaseData.balance * 1.5 && // %50'den fazla yüksekse şüpheli
      localData.balance > firebaseData.balance + 10 || // En az 10 coin farkı varsa
      // Veya aşırı ani artışlar
      localData.balance > 1000 && firebaseData.balance < 100
    ); 
    
    // Son kayıt zamanını kontrol et
    const wasFirebaseUpdatedAfterLocal = firebaseData.lastSaved > (localData.lastSaved || 0);
    
    // Bakiye birleştirme stratejisi
    let finalBalance = 0;
    if (isLocalBalanceSuspicious) {
      // Şüpheli durum: Firebase değerini kullan
      finalBalance = firebaseData.balance;
      debugLog("useFirebaseDataLoader", "Şüpheli yerel bakiye tespit edildi, sunucu değeri kullanılıyor", 
        { local: localData.balance, firebase: firebaseData.balance });
    } else if (wasFirebaseUpdatedAfterLocal) {
      // Firebase daha güncel: Firebase değerini kullan
      finalBalance = firebaseData.balance;
    } else {
      // Yerel veri daha güncel veya şüpheli değil: En büyük değeri kullan
      finalBalance = Math.max(localData.balance || 0, firebaseData.balance || 0);
    }

    // Kritik verileri güvenli şekilde birleştir
    const result: UserData = {
      ...firebaseData,
      balance: finalBalance,
      // Firebase'deki referral bilgilerini her zaman kullan (sunucu tarafında doğrulanıyor)
      referralCode: firebaseData.referralCode || localData.referralCode,
      referralCount: firebaseData.referralCount || localData.referralCount || 0,
      referrals: firebaseData.referrals || localData.referrals || [],
      indirectReferrals: firebaseData.indirectReferrals || localData.indirectReferrals,
      // Firebase'deki mining rate'i kullan (güvenlik için)
      miningRate: firebaseData.miningRate || localData.miningRate || 0.003,
      // En son kayıt zamanını kullan
      lastSaved: Math.max(firebaseData.lastSaved || 0, localData.lastSaved || 0)
    };

    debugLog("useFirebaseDataLoader", "Veriler birleştirildi:", {
      localBalance: localData.balance,
      firebaseBalance: firebaseData.balance,
      resultBalance: result.balance,
      localLastSaved: new Date(localData.lastSaved || 0).toLocaleString(),
      firebaseLastSaved: new Date(firebaseData.lastSaved || 0).toLocaleString(),
      isLocalBalanceSuspicious,
      wasFirebaseUpdatedAfterLocal
    });

    return result;
  };

  return {
    loadFirebaseUserData,
    handleFirebaseError: handleFirebaseConnectionError,
    mergeUserData
  };
}
