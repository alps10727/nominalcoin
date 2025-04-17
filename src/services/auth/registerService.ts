
import { supabase } from "@/integrations/supabase/client";
import { UserRegistrationData, AuthResponse } from "./types";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { createReferralCodeForUser } from "@/utils/referral";
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
    
    // Create user in Supabase
    const { data: { user }, error } = await supabase.auth.signUp({
      email, 
      password,
      options: {
        data: {
          name: userData.name || "",
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
    
    // Generate referral code for new user
    const userReferralCode = await createReferralCodeForUser(user.id);
    
    // Default user data
    const defaultUserData = {
      name: userData.name || "",
      emailAddress: email,
      userId: user.id,
      balance: 0,
      miningRate: 0.003,
      lastSaved: Date.now(),
      miningActive: false,
      isAdmin: false,
      referralCode: userReferralCode,
      referralCount: 0,
      referrals: [],
      invitedBy: referralValid && referrerUserId ? referrerUserId : null
    };
    
    // Save user data to Supabase
    const { error: profileError } = await supabase
      .from('users')
      .insert([defaultUserData]);
      
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
