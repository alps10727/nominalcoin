
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

export function useProfileRealtime(
  currentUser: User | null,
  userData: UserData | null,
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
) {
  useEffect(() => {
    if (!currentUser) return;

    debugLog("useProfileRealtime", "Setting up realtime subscription for profile changes", { userId: currentUser.id });

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
    
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${currentUser.id}`
        },
        (payload) => {
          debugLog("useProfileRealtime", "Profile updated in realtime", payload.new);
          if (payload.new && userData) {
            const updatedData: UserData = {
              ...userData,
              balance: payload.new.balance || userData.balance,
              miningRate: payload.new.mining_rate || userData.miningRate,
              referralCount: payload.new.referral_count || userData.referralCount,
              referrals: payload.new.referrals || userData.referrals,
              invitedBy: payload.new.invited_by || userData.invitedBy,
              name: payload.new.name || userData.name
            };
            
            setUserData(updatedData);
          }
        }
      )
      .subscribe();
    
    return () => {
      debugLog("useProfileRealtime", "Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [currentUser, userData]);
}
