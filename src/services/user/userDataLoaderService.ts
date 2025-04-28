
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateDeterministicCode } from "@/utils/referral/generateReferralCode";
import { toast } from "sonner";

/**
 * Load user data from Supabase
 */
export async function loadUserDataFromSupabase(userId: string): Promise<UserData | null> {
  if (!userId) {
    errorLog("userDataLoaderService", "Called with invalid userId");
    return null;
  }

  try {
    debugLog("userDataLoaderService", "Loading user data from Supabase:", userId);
    
    // Önce yüksek öncelikle yerel depolama kontrolü yap
    const localStorageKey = `fcMinerUserData_${userId}_v1.0`;
    const localData = localStorage.getItem(localStorageKey);
    let localUserData: UserData | null = null;
    
    if (localData) {
      try {
        localUserData = JSON.parse(localData);
        debugLog("userDataLoaderService", "Found local data first:", { 
          balance: localUserData?.balance,
          name: localUserData?.name,
          referralCode: localUserData?.referralCode
        });
      } catch (e) {
        errorLog("userDataLoaderService", "Error parsing local data:", e);
      }
    }
    
    // Supabase'den verileri yükle
    debugLog("userDataLoaderService", "Fetching data from Supabase for user:", userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
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
      
      // Eğer kullanıcı verisi yoksa yeni oluştur
      const newUserData = {
        userId,
        balance: 0,
        miningRate: 0.003,
        lastSaved: Date.now(),
        miningActive: false,
        miningTime: 0,
        miningSession: 0,
        miningPeriod: 21600,
        name: "",
        emailAddress: "",
        isAdmin: false,
        referralCode: generateDeterministicCode(userId),
        referralCount: 0,
        referrals: []
      };
      
      debugLog("userDataLoaderService", "Creating new user profile with data:", {
        userId,
        balance: newUserData.balance,
        referralCode: newUserData.referralCode
      });
      
      try {
        // Yeni kullanıcı profili oluştur
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            balance: newUserData.balance,
            mining_rate: newUserData.miningRate,
            last_saved: newUserData.lastSaved,
            mining_active: newUserData.miningActive,
            mining_time: newUserData.miningTime,
            mining_session: newUserData.miningSession,
            mining_period: newUserData.miningPeriod,
            name: newUserData.name,
            email: newUserData.emailAddress,
            is_admin: newUserData.isAdmin,
            referral_code: newUserData.referralCode,
            referral_count: newUserData.referralCount,
            referrals: newUserData.referrals
          }]);
          
        if (insertError) {
          errorLog("userDataLoaderService", "Error creating new user profile:", insertError);
          toast.error("Yeni profil oluşturulurken hata oluştu");
        } else {
          debugLog("userDataLoaderService", "New user profile created successfully!");
          toast.success("Yeni kullanıcı profili oluşturuldu");
        }
      } catch (err) {
        errorLog("userDataLoaderService", "Exception creating new user profile:", err);
      }
      
      // Veri bulunamadıysa yerel veriyi kullan veya yeni oluştur
      if (localUserData) {
        debugLog("userDataLoaderService", "Using local data because no server data found");
        return localUserData;
      }
      
      return newUserData;
    }
    
    debugLog("userDataLoaderService", "Successfully loaded data from Supabase:", { 
      userId,
      balance: data.balance,
      name: data.name,
      email: data.email, 
      referralCode: data.referral_code
    });
    
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
    toast.error("Kullanıcı verileri yüklenirken bir hata oluştu");
    
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
