
import { supabase } from "@/integrations/supabase/client";
import { UserRegistrationData, AuthResponse } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { generateReferralCode } from "@/utils/referral/generateReferralCode";
import { checkReferralCode, processReferralCode } from "@/utils/referral";
import { toast } from "sonner";

export async function registerUser(
  email: string, 
  password: string, 
  userData: UserRegistrationData = {}
): Promise<any> {
  try {
    debugLog("authService", "Registering user...", { email });
    
    // Validate referral code if provided
    let referralValid = false;
    let referrerUserId = null;
    let referralCode = userData.referralCode ? userData.referralCode.toUpperCase() : "";
    
    if (referralCode && referralCode.length > 0) {
      try {
        debugLog("authService", "Checking referral code", { code: referralCode });
        const { valid, ownerId } = await checkReferralCode(referralCode);
        referralValid = valid;
        referrerUserId = ownerId;
        debugLog("authService", "Referral code check result", { valid, ownerId });
      } catch (err) {
        errorLog("authService", "Error checking referral code:", err);
      }
    }
    
    // Generate a unique referral code for the new user
    const userReferralCode = generateReferralCode();
    debugLog("authService", "Generated referral code for new user", { userReferralCode });
    
    // Create user in Supabase
    const { data: { user }, error } = await supabase.auth.signUp({
      email, 
      password,
      options: {
        data: {
          name: userData.name || "",
          referral_code: userReferralCode
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (!user) {
      throw new Error("User registration failed: No user data returned");
    }
    
    debugLog("authService", "User created in Supabase Auth", { userId: user.id });
    
    // Default user data
    const profileData = {
      id: user.id,
      name: userData.name || "",
      email: email,
      balance: 0,
      mining_rate: 0.003,
      last_saved: Date.now(),
      mining_active: false,
      is_admin: false,
      referral_code: userReferralCode,
      referral_count: 0,
      referrals: [],
      invited_by: referralValid && referrerUserId ? referrerUserId : null
    };
    
    // Save user data to Supabase
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([profileData]);
      
    if (profileError) {
      errorLog("authService", "Error saving user data to Supabase:", profileError);
    }
    
    // Process referral reward if valid
    if (referralValid && referrerUserId) {
      try {
        debugLog("authService", "Processing referral reward", { code: referralCode, referrerId: referrerUserId });
        
        // Process the referral with a small delay to ensure database consistency
        setTimeout(async () => {
          const success = await processReferralCode(referralCode, user.id);
          
          if (success) {
            debugLog("authService", "Referral successfully processed");
            toast.success("Referans kodunu kullandığınız için 10 NC Token kazandınız!");
          } else {
            errorLog("authService", "Failed to process referral reward");
            // Retry once after a short delay
            setTimeout(async () => {
              const retrySuccess = await processReferralCode(referralCode, user.id);
              debugLog("authService", "Referral retry result:", retrySuccess);
            }, 2000);
          }
        }, 1000);
        
      } catch (rewardErr) {
        errorLog("authService", "Error processing referral reward:", rewardErr);
      }
    }
    
    return user;
  } catch (error) {
    errorLog("authService", "Registration error:", error);
    throw error;
  }
}
