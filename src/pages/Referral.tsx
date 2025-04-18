
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { debugLog } from "@/utils/debugUtils";
import ReferralHeader from "@/components/referral/ReferralHeader";
import ReferralStats from "@/components/referral/ReferralStats";
import ReferralCodeCard from "@/components/referral/ReferralCodeCard";
import ReferralBenefits from "@/components/referral/ReferralBenefits";
import ReferralList from "@/components/referral/ReferralList";
import { supabase } from "@/integrations/supabase/client";
import { generateDeterministicCode } from "@/utils/referral/generateReferralCode";

const Referral = () => {
  const { userData, currentUser, updateUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState<string>('');
  
  const referralCount = userData?.referralCount || 0;
  const referrals = userData?.referrals || [];
  
  // Load the referral code from userData, localStorage or generate it deterministically
  useEffect(() => {
    if (!currentUser) return;
    
    // Define a function to get or create the referral code
    const getOrCreateReferralCode = async () => {
      // Try to get from userData first
      if (userData?.referralCode) {
        setReferralCode(userData.referralCode);
        return;
      }
      
      // Try to get from localStorage next
      const storedCode = localStorage.getItem('userReferralCode');
      if (storedCode) {
        setReferralCode(storedCode);
        
        // If we have userData but no referralCode in it, update userData
        if (userData && updateUserData) {
          await updateUserData({
            ...userData,
            referralCode: storedCode
          });
        }
        return;
      }
      
      // If no code is available, generate a deterministic one based on user ID
      const deterministicCode = generateDeterministicCode(currentUser.id);
      setReferralCode(deterministicCode);
      localStorage.setItem('userReferralCode', deterministicCode);
      
      // Update userData with the new code
      if (userData && updateUserData) {
        await updateUserData({
          ...userData,
          referralCode: deterministicCode
        });
      }
      
      // Also update the code in Supabase
      if (currentUser && currentUser.id) {
        await supabase
          .from('profiles')
          .update({ referral_code: deterministicCode })
          .eq('id', currentUser.id);
      }
    };
    
    getOrCreateReferralCode();
  }, [currentUser, userData?.referralCode]);
  
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast.loading("Referans bilgileri yükleniyor...");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals')
        .eq('id', currentUser.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        if (updateUserData) {
          // Only update the code if one is returned and it's not empty
          const newCode = data.referral_code || referralCode;
          
          // Store referral code in localStorage for persistence
          if (newCode) {
            localStorage.setItem('userReferralCode', newCode);
            setReferralCode(newCode);
          }
          
          await updateUserData({
            ...userData,
            referralCode: newCode,
            referralCount: data.referral_count || 0,
            referrals: data.referrals || [],
            miningRate: userData?.miningRate || 0.003
          });
          
          toast.success("Referans bilgileri güncellendi");
        }
      }
    } catch (error) {
      toast.error("Verileri güncellerken bir hata oluştu");
      debugLog("Referral", "Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
      toast.dismiss();
    }
  };
  
  // Load data when component mounts
  useEffect(() => {
    if (currentUser && currentUser.id) {
      refreshUserData();
    } else {
      setIsLoading(false);
    }
  }, [currentUser?.id]);
  
  if (isLoading && !referralCode) {
    return (
      <div className="container max-w-md px-4 py-8 mx-auto text-center">
        <p className="text-gray-400">Referans bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md px-4 py-8 mx-auto space-y-6">
      <ReferralHeader onRefresh={refreshUserData} isRefreshing={isRefreshing} />
      <ReferralStats referralCount={referralCount} />
      <ReferralCodeCard referralCode={referralCode} />
      <ReferralBenefits />
      <ReferralList referrals={referrals} />
    </div>
  );
};

export default Referral;
