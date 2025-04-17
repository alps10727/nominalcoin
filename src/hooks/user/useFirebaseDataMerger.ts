
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

export function useFirebaseDataMerger() {
  const mergeUserData = (localData: UserData | null, firebaseData: UserData | null): UserData => {
    if (!firebaseData) {
      return localData || {
        userId: 'local-user',
        balance: 0,
        miningRate: 0.003,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: 0,
        miningPeriod: 21600,
        miningSession: 0
      };
    }
    
    if (!localData) return firebaseData;

    // Şüpheli manipülasyon tespiti
    const isLocalBalanceSuspicious = localData && firebaseData && (
      localData.balance > firebaseData.balance * 1.5 ||
      localData.balance > firebaseData.balance + 10 ||
      localData.balance > 1000 && firebaseData.balance < 100
    );
    
    const wasFirebaseUpdatedAfterLocal = firebaseData.lastSaved > (localData.lastSaved || 0);
    
    let finalBalance = 0;
    if (isLocalBalanceSuspicious) {
      finalBalance = firebaseData.balance;
      debugLog("useFirebaseDataMerger", "Şüpheli yerel bakiye tespit edildi, sunucu değeri kullanılıyor", 
        { local: localData.balance, firebase: firebaseData.balance });
    } else if (wasFirebaseUpdatedAfterLocal) {
      finalBalance = firebaseData.balance;
    } else {
      finalBalance = Math.max(localData.balance || 0, firebaseData.balance || 0);
    }

    const result: UserData = {
      ...firebaseData,
      balance: finalBalance,
      miningRate: firebaseData.miningRate || localData.miningRate || 0.003,
      lastSaved: Math.max(firebaseData.lastSaved || 0, localData.lastSaved || 0)
    };

    debugLog("useFirebaseDataMerger", "Veriler birleştirildi:", {
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

  return { mergeUserData };
}
