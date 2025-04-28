
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateDeterministicCode } from "@/utils/referral/generateReferralCode";
import { toast } from "sonner";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";

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
          referralCode: localUserData?.referralCode,
          referralCount: localUserData?.referralCount,
          miningRate: localUserData?.miningRate
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
    
    // Check referral audit as backup for referral data
    const verifyReferrals = async (userId: string, profileData: any) => {
      // Only verify if referrals seem missing
      if (profileData && (
          !profileData.referral_count || 
          profileData.referral_count === 0 || 
          !profileData.referrals || 
          profileData.referrals.length === 0
        )) {
        debugLog("userDataLoaderService", "Checking referral audit for lost referrals");
        
        const { data: auditData, error: auditError } = await supabase
          .from('referral_audit')
          .select('invitee_id')
          .eq('referrer_id', userId);
          
        if (!auditError && auditData && auditData.length > 0) {
          // Found referrals in audit log
          const referralCount = auditData.length;
          const referrals = auditData.map(entry => entry.invitee_id);
          
          debugLog("userDataLoaderService", "Found referrals in audit:", referralCount);
          
          // Calculate mining rate with referrals
          const baseRate = 0.003;
          const referralBonus = referralCount * REFERRAL_BONUS_RATE;
          const miningRate = parseFloat((baseRate + referralBonus).toFixed(4));
          
          // Update profile with recovered data
          try {
            await supabase
              .from('profiles')
              .update({
                referral_count: referralCount,
                referrals: referrals,
                mining_rate: miningRate
              })
              .eq('id', userId);
              
            debugLog("userDataLoaderService", "Updated profile with recovered referral data");
            
            // Update the data object directly
            profileData.referral_count = referralCount;
            profileData.referrals = referrals;
            profileData.mining_rate = miningRate;
            
            toast.success("Referans verileriniz kurtarıldı");
          } catch (updateError) {
            errorLog("userDataLoaderService", "Failed to update profile with recovered referrals:", updateError);
          }
        }
      }
      
      return profileData;
    };
    
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
    
    // Verify and potentially fix referral data
    const checkedData = await verifyReferrals(userId, data);
    
    debugLog("userDataLoaderService", "Successfully loaded data from Supabase:", { 
      userId,
      balance: checkedData.balance,
      name: checkedData.name,
      email: checkedData.email, 
      referralCode: checkedData.referral_code,
      referralCount: checkedData.referral_count,
      referrals: checkedData.referrals ? checkedData.referrals.length : 0,
      miningRate: checkedData.mining_rate
    });
    
    // Get or generate a stable referral code
    let referralCode = checkedData.referral_code;
    
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
    
    // Check if mining rate is correct based on referral count
    const expectedReferralBonus = (checkedData.referral_count || 0) * REFERRAL_BONUS_RATE;
    const baseRate = 0.003;
    const expectedMiningRate = parseFloat((baseRate + expectedReferralBonus).toFixed(4));
    
    // If mining rate is incorrect, fix it
    if (checkedData.mining_rate !== expectedMiningRate && checkedData.referral_count > 0) {
      debugLog("userDataLoaderService", 
        `Mining rate incorrect. Expected: ${expectedMiningRate}, Found: ${checkedData.mining_rate}`);
      
      // Update mining rate
      try {
        await supabase
          .from('profiles')
          .update({ mining_rate: expectedMiningRate })
          .eq('id', userId);
          
        checkedData.mining_rate = expectedMiningRate;
        debugLog("userDataLoaderService", "Mining rate corrected to:", expectedMiningRate);
        toast.success("Kazım hızı güncellendi");
      } catch (err) {
        errorLog("userDataLoaderService", "Error updating mining rate:", err);
      }
    }
    
    // Map Supabase profile data to our UserData interface
    const userData: UserData = {
      userId: checkedData.id,
      balance: checkedData.balance || 0,
      miningRate: checkedData.mining_rate || 0.003,
      lastSaved: checkedData.last_saved || Date.now(),
      miningActive: checkedData.mining_active || false,
      miningTime: checkedData.mining_time || 0,
      miningSession: checkedData.mining_session || 0,
      miningPeriod: checkedData.mining_period || 21600,
      miningEndTime: checkedData.mining_end_time,
      miningStartTime: checkedData.mining_start_time,
      progress: checkedData.progress || 0,
      name: checkedData.name || "",
      emailAddress: checkedData.email,
      isAdmin: checkedData.is_admin || false,
      referralCode: referralCode,
      referralCount: checkedData.referral_count || 0,
      referrals: checkedData.referrals || [],
      invitedBy: checkedData.invited_by
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
