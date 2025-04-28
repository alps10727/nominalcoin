
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/types/storage";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { saveUserData as saveUserDataToLocal } from "@/utils/storage";
import { toast } from "sonner";

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
        .select('balance, id')
        .eq('id', userId)
        .maybeSingle();
      
      if (fetchError) {
        errorLog("saveUserDataService", "Error checking existing user data:", fetchError);
      }
      
      if (!fetchError && existingData && existingData.balance > userData.balance) {
        // Eğer sunucudaki bakiye daha yüksekse, sunucudaki değeri kullan
        // Bu şekilde veriler senkron olmadığında bakiye kaybı olmaz
        debugLog("saveUserDataService", `Using higher balance from server: ${existingData.balance} vs ${userData.balance}`);
        userData.balance = existingData.balance;
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
      balance: profileData.balance // Güncellenmiş bakiye varsa onu da yerel depolamaya kaydet
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
