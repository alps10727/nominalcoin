
import { UserData } from "@/types/storage";
import { debugLog } from "@/utils/debugUtils";

export function useSupabaseDataMerger() {
  const mergeUserData = (localData: UserData | null, supabaseData: UserData | null): UserData => {
    if (!supabaseData) return localData || { balance: 0, miningRate: 0.003, lastSaved: Date.now() };
    if (!localData) return supabaseData;

    // Detect suspicious manipulation
    const isLocalBalanceSuspicious = localData && supabaseData && (
      localData.balance > supabaseData.balance * 1.5 ||
      localData.balance > supabaseData.balance + 10 ||
      localData.balance > 1000 && supabaseData.balance < 100
    );
    
    const wasSupabaseUpdatedAfterLocal = supabaseData.lastSaved > (localData.lastSaved || 0);
    
    let finalBalance = 0;
    if (isLocalBalanceSuspicious) {
      finalBalance = supabaseData.balance;
      debugLog("useSupabaseDataMerger", "Suspicious local balance detected, using server value", 
        { local: localData.balance, supabase: supabaseData.balance });
    } else if (wasSupabaseUpdatedAfterLocal) {
      finalBalance = supabaseData.balance;
    } else {
      finalBalance = Math.max(localData.balance || 0, supabaseData.balance || 0);
    }

    const result: UserData = {
      ...supabaseData,
      balance: finalBalance,
      miningRate: supabaseData.miningRate || localData.miningRate || 0.003,
      lastSaved: Math.max(supabaseData.lastSaved || 0, localData.lastSaved || 0)
    };

    debugLog("useSupabaseDataMerger", "Data merged:", {
      localBalance: localData.balance,
      supabaseBalance: supabaseData.balance,
      resultBalance: result.balance,
      localLastSaved: new Date(localData.lastSaved || 0).toLocaleString(),
      supabaseLastSaved: new Date(supabaseData.lastSaved || 0).toLocaleString(),
      isLocalBalanceSuspicious,
      wasSupabaseUpdatedAfterLocal
    });

    return result;
  };

  return { mergeUserData };
}
