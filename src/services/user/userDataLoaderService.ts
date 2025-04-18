
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateDeterministicCode } from "@/utils/referral/generateReferralCode";

/**
 * Load user data from Supabase
 */
export async function loadUserDataFromSupabase(userId: string): Promise<UserData | null> {
  try {
    debugLog("userDataLoaderService", "Loading user data from Supabase:", userId);
    
    // Önce yüksek öncelikle yerel depolama kontrolü yap
    const localStorageKey = `fcMinerUserData_${userId}_v1.0`;
    const localData = localStorage.getItem(localStorageKey);
    let localUserData: UserData | null = null;
    
    if (localData) {
      try {
        localUserData = JSON.parse(localData);
        debugLog("userDataLoaderService", "Found local data first:", { balance: localUserData?.balance });
      } catch (e) {
        errorLog("userDataLoaderService", "Error parsing local data:", e);
      }
    }
    
    // Supabase'den verileri yükle
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      errorLog("userDataLoaderService", "Error loading user data:", error);
      
      // Hata durumunda yerel veriyi kullan
      if (localUserData) {
        debugLog("userDataLoaderService", "Using local data due to Supabase error");
        return localUserData;
      }
      return null;
    }
    
    if (!data) {
      debugLog("userDataLoaderService", "No user data found for:", userId);
      
      // Veri bulunamadıysa yerel veriyi kullan
      if (localUserData) {
        debugLog("userDataLoaderService", "Using local data because no server data found");
        return localUserData;
      }
      return null;
    }
    
    // Get or generate a stable referral code
    let referralCode = data.referral_code;
    
    // If no code in database, check localStorage
    if (!referralCode) {
      referralCode = localStorage.getItem('userReferralCode') || null;
    }
    
    // If still no code, generate a deterministic one and save it
    if (!referralCode) {
      referralCode = generateDeterministicCode(userId);
      
      // Save to localStorage
      localStorage.setItem('userReferralCode', referralCode);
      
      // Also update in database
      try {
        await supabase
          .from('profiles')
          .update({ referral_code: referralCode })
          .eq('id', userId);
      } catch (err) {
        errorLog("userDataLoaderService", "Error updating referral code:", err);
      }
    }
    
    // Map Supabase profile data to our UserData interface
    const userData: UserData = {
      userId: data.id,
      balance: data.balance || 0,
      miningRate: data.mining_rate || 0.003,
      lastSaved: data.last_saved || Date.now(),
      miningActive: data.mining_active || false,
      miningTime: data.mining_time || 0,
      miningSession: data.mining_session || 0,
      miningPeriod: data.mining_period || 21600,
      miningEndTime: data.mining_end_time,
      miningStartTime: data.mining_start_time,
      progress: data.progress || 0,
      name: data.name || "",
      emailAddress: data.email,
      isAdmin: data.is_admin || false,
      referralCode: referralCode,
      referralCount: data.referral_count || 0,
      referrals: data.referrals || [],
      invitedBy: data.invited_by
    };
    
    // Bakiye karşılaştırması - yerel veri varsa ve bakiye daha yüksekse onu kullan
    if (localUserData && typeof localUserData.balance === 'number' && 
        localUserData.balance > userData.balance) {
      debugLog("userDataLoaderService", 
        `Using higher balance from local storage: ${localUserData.balance} vs ${userData.balance}`);
      userData.balance = localUserData.balance;
      
      // Sunucuya da daha yüksek bakiyeyi gönder
      try {
        await supabase
          .from('profiles')
          .update({ balance: userData.balance })
          .eq('id', userId);
      } catch (err) {
        errorLog("userDataLoaderService", "Error updating balance with higher local value:", err);
      }
    }
    
    // Save the referral code to localStorage for persistence
    if (userData.referralCode) {
      localStorage.setItem('userReferralCode', userData.referralCode);
    }
    
    // Son kullanıcı verilerini yerel olarak da sakla
    localStorage.setItem(localStorageKey, JSON.stringify(userData));
    
    debugLog("userDataLoaderService", "User data loaded successfully with balance:", userData.balance);
    return userData;
  } catch (error) {
    errorLog("userDataLoaderService", "Error in loadUserDataFromSupabase:", error);
    
    // Hata durumunda yerel verileri dene
    try {
      const localStorageKey = `fcMinerUserData_${userId}_v1.0`;
      const localData = localStorage.getItem(localStorageKey);
      
      if (localData) {
        const userData = JSON.parse(localData) as UserData;
        debugLog("userDataLoaderService", "Fallback to local storage after error:", userData.balance);
        return userData;
      }
    } catch (e) {
      errorLog("userDataLoaderService", "Error parsing local fallback data:", e);
    }
    
    return null;
  }
}

export type { UserData };
