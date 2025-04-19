
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { generateDeterministicCode } from "@/utils/referral/generateReferralCode";
import { supabase } from "@/integrations/supabase/client";

export const useReferralCode = (
  currentUser: any | null,
  setReferralCode: (code: string) => void
) => {
  useEffect(() => {
    if (!currentUser) return;
    
    const getOrCreateReferralCode = async () => {
      // Try to get from userData first
      if (currentUser?.user_metadata?.referralCode) {
        setReferralCode(currentUser.user_metadata.referralCode);
        return;
      }
      
      // Try to get from localStorage next
      const storedCode = localStorage.getItem('userReferralCode');
      if (storedCode) {
        setReferralCode(storedCode);
        return;
      }
      
      // If no code is available, generate a deterministic one based on user ID
      const deterministicCode = generateDeterministicCode(currentUser.id);
      setReferralCode(deterministicCode);
      localStorage.setItem('userReferralCode', deterministicCode);
      
      // Update the code in Supabase
      await supabase
        .from('profiles')
        .update({ referral_code: deterministicCode })
        .eq('id', currentUser.id);
    };
    
    getOrCreateReferralCode();
  }, [currentUser, setReferralCode]);
};
