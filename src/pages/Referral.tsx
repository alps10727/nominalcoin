
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
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
  
  // Set up realtime subscription for profile changes
  useEffect(() => {
    if (!currentUser) return;
    
    // Enable realtime for profiles table
    const setupRealtime = async () => {
      try {
        await supabase.functions.invoke('enable_realtime', {
          body: { table: 'profiles' }
        }).catch(err => {
          console.warn("Error enabling realtime:", err);
        });
      } catch (error) {
        console.warn("Error enabling realtime:", error);
      }
    };
    
    setupRealtime();
    
    // Subscribe to changes
    const channel = supabase
      .channel('referral-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`
        },
        (payload) => {
          debugLog("Referral", "Profile updated in realtime", payload.new);
          
          if (payload.new) {
            // Update local state with new data
            if (payload.new.referral_count !== undefined || payload.new.referrals !== undefined) {
              refreshUserData();
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser?.id]);
  
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      setIsRefreshing(true);
      toast({
        title: "Referans bilgileri yükleniyor...",
        duration: 3000
      });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('referral_code, referral_count, referrals, balance, mining_rate')
        .eq('id', currentUser.id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        if (updateUserData && userData) {
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
            balance: data.balance !== undefined ? data.balance : userData.balance,
            miningRate: data.mining_rate !== undefined ? data.mining_rate : userData.miningRate
          });
          
          toast({
            title: "Referans bilgileri güncellendi",
            variant: "default",
            duration: 3000
          });
        }
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Verileri güncellerken bir hata oluştu",
        variant: "destructive",
        duration: 5000
      });
      debugLog("Referral", "Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
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
  
  // Set up auto-refresh timer
  useEffect(() => {
    if (!currentUser) return;
    
    // Refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      refreshUserData();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [currentUser]);
  
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
