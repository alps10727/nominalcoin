
import { useEffect } from "react";
import { Badge } from "@/types/tasks";
import { UserData } from "@/utils/storage";
import { debugLog } from "@/utils/debugUtils";

/**
 * Calculates and updates badge progress based on user data
 */
export function useBadgeProgress(
  badges: Badge[],
  setBadges: React.Dispatch<React.SetStateAction<Badge[]>>,
  userData: UserData | null
) {
  useEffect(() => {
    if (!userData) return;
    
    // Rozetleri güncelle
    const updatedBadges = [...badges];
    
    // İlk madenci rozeti: Herhangi bir madencilik yapıldıysa
    updatedBadges[0] = {
      ...updatedBadges[0],
      earned: userData.balance > 0,
      progress: userData.balance > 0 ? 100 : 0
    };
    
    // Madencilik profesyoneli: Bakiyeye göre ilerleme
    updatedBadges[1] = {
      ...updatedBadges[1],
      earned: userData.balance >= 50,
      progress: Math.min(Math.floor((userData.balance / 50) * 100), 100)
    };
    
    // Sosyal ağ uzmanı: Referans sayısına göre
    updatedBadges[2] = {
      ...updatedBadges[2],
      earned: (userData.referralCount || 0) >= 5,
      progress: Math.min(Math.floor(((userData.referralCount || 0) / 5) * 100), 100)
    };
    
    // Yükseltme uzmanı: Yükseltme sayısına göre
    const upgradeCount = userData.upgrades?.length || 0;
    updatedBadges[3] = {
      ...updatedBadges[3],
      earned: upgradeCount >= 3,
      progress: Math.min(Math.floor((upgradeCount / 3) * 100), 100)
    };
    
    setBadges(updatedBadges);
    
    debugLog("useBadgeProgress", "Badge progress updated based on user data");
  }, [userData, setBadges, badges]);
}
