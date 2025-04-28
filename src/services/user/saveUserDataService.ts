
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { saveUserData as saveUserDataToLocal } from "@/utils/storage";
import { toast } from "sonner";
import { REFERRAL_BONUS_RATE } from "@/utils/referral/bonusCalculator";

/**
 * Save user data to Supabase
 */
export async function saveUserDataToSupabase(userId: string, userData: UserData): Promise<boolean> {
  if (!userId || !userData) {
    errorLog("saveUserDataService", "Invalid parameters:", { userId, userData });
    return false;
  }

  try {
    debugLog("saveUserDataService", "Saving user data to Supabase:", { 
      id: userId, 
      balance: userData.balance,
      miningActive: userData.miningActive,
      referralCount: userData.referralCount,
      name: userData.name || ""
    });

    // Get the referral code from userData or localStorage
    const referralCode = userData.referralCode || localStorage.getItem('userReferralCode') || "";
    
    // Mevcut veriyi önce kontrol et
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('profiles')
        .select('balance, id, referral_count, referrals, mining_rate')
        .eq('id', userId)
        .maybeSingle();
      
      if (fetchError) {
        errorLog("saveUserDataService", "Error checking existing user data:", fetchError);
      }
      
      if (!fetchError && existingData) {
        // Ensure referral count data is preserved
        if ((existingData.referral_count || 0) > (userData.referralCount || 0)) {
          debugLog("saveUserDataService", 
            `Using higher referral count from server: ${existingData.referral_count} vs ${userData.referralCount}`);
          userData.referralCount = existingData.referral_count;
          userData.referrals = existingData.referrals || [];
          
          // Recalculate mining rate based on restored referrals
          const baseRate = 0.003;
          const referralBonus = userData.referralCount * REFERRAL_BONUS_RATE;
          userData.miningRate = parseFloat((baseRate + referralBonus).toFixed(4));
          
          debugLog("saveUserDataService", `Mining rate restored to: ${userData.miningRate} based on ${userData.referralCount} referrals`);
        }
        
        // Protect balance from decreasing unexpectedly
        if (existingData.balance > userData.balance) {
          debugLog("saveUserDataService", `Using higher balance from server: ${existingData.balance} vs ${userData.balance}`);
          userData.balance = existingData.balance;
        }
      }
    } catch (error) {
      errorLog("saveUserDataService", "Error checking existing balance:", error);
      // Continue with the save operation
    }
    
    // Prepare data for Supabase profiles table
    const profileData = {
      id: userId,
      name: userData.name || "",
      email: userData.emailAddress || "",
      balance: userData.balance,
      mining_rate: userData.miningRate || 0.003,
      last_saved: userData.lastSaved || Date.now(),
      mining_active: userData.miningActive || false,
      mining_time: userData.miningTime,
      mining_session: userData.miningSession || 0,
      mining_period: userData.miningPeriod || 21600,
      mining_end_time: userData.miningEndTime,
      mining_start_time: userData.miningStartTime,
      progress: userData.progress || 0,
      is_admin: userData.isAdmin || false,
      referral_code: referralCode,
      referral_count: userData.referralCount || 0,
      referrals: userData.referrals || [],
      invited_by: userData.invitedBy || null
    };
    
    // Save to local storage first for offline support
    saveUserDataToLocal({
      ...userData,
      balance: profileData.balance, // Güncellenmiş bakiye varsa onu da yerel depolamaya kaydet
      referralCount: profileData.referral_count,
      referrals: profileData.referrals
    });
    
    // Check if user already exists
    try {
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      if (checkError && !checkError.message.includes('No rows found')) {
        errorLog("saveUserDataService", "Error checking existing user:", checkError);
        toast.error("Kullanıcı verileri kontrol edilirken hata oluştu");
        return false;
      }
      
      let result;
      
      // Update or insert based on whether user exists
      if (existingUser) {
        // Update existing user
        debugLog("saveUserDataService", "Updating existing user profile", userId);
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId);
      } else {
        // Insert new user
        debugLog("saveUserDataService", "Creating new user profile", userId);
        result = await supabase
          .from('profiles')
          .insert([profileData]);
      }
      
      if (result.error) {
        errorLog("saveUserDataService", "Error saving user data:", result.error);
        toast.error("Kullanıcı verileri kaydedilemedi: " + result.error.message);
        return false;
      }
      
      debugLog("saveUserDataService", "User data saved successfully!");
    } catch (error) {
      errorLog("saveUserDataService", "Database error in user data save:", error);
      toast.error("Veritabanı hatası: Kullanıcı verileri kaydedilemedi");
      return false;
    }
    
    // Store referral code in localStorage for persistence
    if (referralCode) {
      localStorage.setItem('userReferralCode', referralCode);
    }
    
    debugLog("saveUserDataService", "User data saved successfully with balance:", userData.balance);
    return true;
  } catch (error) {
    errorLog("saveUserDataService", "Error in saveUserDataToSupabase:", error);
    toast.error("Kullanıcı verileri kaydedilirken beklenmeyen bir hata oluştu");
    return false;
  }
}

// For backward compatibility
export const saveUserDataToFirebase = saveUserDataToSupabase;
