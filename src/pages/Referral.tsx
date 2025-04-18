
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

const Referral = () => {
  const { userData, currentUser, updateUserData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const referralCode = userData?.referralCode || '';
  const referralCount = userData?.referralCount || 0;
  const referrals = userData?.referrals || [];
  
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast.loading("Referans bilgileri yükleniyor...");
      
      // Supabase'den referans bilgilerini yükle
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
          await updateUserData({
            referralCode: data.referral_code || referralCode,
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
      toast.dismiss();
    }
  };
  
  useEffect(() => {
    if (currentUser && currentUser.id) {
      refreshUserData();
    }
  }, [currentUser]);

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
