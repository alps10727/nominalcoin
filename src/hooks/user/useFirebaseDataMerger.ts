
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";

export function useFirebaseDataMerger() {
  const mergeUserData = (localData: UserData | null, firebaseData: UserData | null): UserData => {
    // Create a default UserData if both sources are missing
    if (!firebaseData && !localData) {
      return {
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
    
    // If only one source exists, return it with validation
    if (!firebaseData && localData) {
      return ensureValidUserData(localData);
    }
    
    if (firebaseData && !localData) {
      return ensureValidUserData(firebaseData);
    }

    // Both sources exist, merge them
    const localDataValid = localData as UserData;
    const firebaseDataValid = firebaseData as UserData;
    
    // Şüpheli manipülasyon tespiti
    const isLocalBalanceSuspicious = (
      localDataValid.balance > firebaseDataValid.balance * 1.5 ||
      localDataValid.balance > firebaseDataValid.balance + 10 ||
      localDataValid.balance > 1000 && firebaseDataValid.balance < 100
    );
    
    const wasFirebaseUpdatedAfterLocal = firebaseDataValid.lastSaved > (localDataValid.lastSaved || 0);
    
    let finalBalance = 0;
    if (isLocalBalanceSuspicious) {
      finalBalance = firebaseDataValid.balance;
      debugLog("useFirebaseDataMerger", "Şüpheli yerel bakiye tespit edildi, sunucu değeri kullanılıyor", 
        { local: localDataValid.balance, firebase: firebaseDataValid.balance });
    } else if (wasFirebaseUpdatedAfterLocal) {
      finalBalance = firebaseDataValid.balance;
    } else {
      finalBalance = Math.max(localDataValid.balance || 0, firebaseDataValid.balance || 0);
    }

    const result: UserData = {
      ...firebaseDataValid,
      balance: finalBalance,
      miningRate: firebaseDataValid.miningRate || localDataValid.miningRate || 0.003,
      lastSaved: Math.max(firebaseDataValid.lastSaved || 0, localDataValid.lastSaved || 0),
      // Ensure all required fields are present
      userId: firebaseDataValid.userId || localDataValid.userId || 'local-user',
      miningActive: firebaseDataValid.miningActive !== undefined ? firebaseDataValid.miningActive : localDataValid.miningActive || false,
      miningTime: firebaseDataValid.miningTime !== undefined ? firebaseDataValid.miningTime : localDataValid.miningTime || 0,
      miningPeriod: firebaseDataValid.miningPeriod || localDataValid.miningPeriod || 21600,
      miningSession: firebaseDataValid.miningSession || localDataValid.miningSession || 0
    };

    debugLog("useFirebaseDataMerger", "Veriler birleştirildi:", {
      localBalance: localDataValid.balance,
      firebaseBalance: firebaseDataValid.balance,
      resultBalance: result.balance,
      localLastSaved: new Date(localDataValid.lastSaved || 0).toLocaleString(),
      firebaseLastSaved: new Date(firebaseDataValid.lastSaved || 0).toLocaleString(),
      isLocalBalanceSuspicious,
      wasFirebaseUpdatedAfterLocal
    });

    return result;
  };

  // Helper function to ensure valid UserData
  const ensureValidUserData = (userData: any): UserData => {
    return {
      userId: userData.userId || 'local-user',
      balance: userData.balance || 0,
      miningRate: userData.miningRate || 0.003,
      lastSaved: userData.lastSaved || Date.now(),
      miningActive: userData.miningActive !== undefined ? userData.miningActive : false,
      miningTime: userData.miningTime !== undefined ? userData.miningTime : 0,
      miningPeriod: userData.miningPeriod || 21600,
      miningSession: userData.miningSession || 0,
      miningEndTime: userData.miningEndTime,
      miningStartTime: userData.miningStartTime,
      progress: userData.progress,
      // Copy additional fields
      name: userData.name,
      emailAddress: userData.emailAddress,
      isAdmin: userData.isAdmin,
      tasks: userData.tasks,
      upgrades: userData.upgrades,
    };
  };

  return { mergeUserData };
}
