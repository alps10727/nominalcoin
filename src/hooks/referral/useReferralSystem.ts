
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { getUserReferralInfo, initializeReferralCode, applyReferralCode } from "@/services/referral/referralService";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Referans sistemi için özel hook
 */
export function useReferralSystem(currentUser: User | null) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referrals, setReferrals] = useState<string[]>([]);
  const [invitedBy, setInvitedBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  // Referans bilgilerini yükle
  useEffect(() => {
    const loadReferralInfo = async () => {
      if (!currentUser) {
        resetState();
        return;
      }

      setLoading(true);
      try {
        const info = await getUserReferralInfo(currentUser.uid);
        
        if (info) {
          setReferralCode(info.referralCode);
          setReferrals(info.referrals || []);
          setInvitedBy(info.invitedBy);
        } else {
          // Referans kodu yoksa yeni bir tane oluştur
          await createNewReferralCode();
        }
      } catch (error) {
        errorLog("useReferralSystem", "Error loading referral info:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReferralInfo();
  }, [currentUser]);

  // Referans kodunu sıfırla
  const resetState = () => {
    setReferralCode("");
    setReferrals([]);
    setInvitedBy(null);
  };

  // Yeni bir referans kodu oluştur
  const createNewReferralCode = async () => {
    if (!currentUser) return;
    
    try {
      const newCode = await initializeReferralCode(currentUser.uid);
      if (newCode) {
        setReferralCode(newCode);
        return newCode;
      }
    } catch (error) {
      errorLog("useReferralSystem", "Error creating referral code:", error);
    }
    return null;
  };

  // Referans kodunu uygula
  const applyCode = async (code: string) => {
    if (!currentUser || !code) return false;

    setApplying(true);
    try {
      const success = await applyReferralCode(currentUser.uid, code);
      if (success) {
        // Bilgileri güncelle
        const updatedInfo = await getUserReferralInfo(currentUser.uid);
        if (updatedInfo) {
          setInvitedBy(updatedInfo.invitedBy);
        }
      }
      return success;
    } catch (error) {
      errorLog("useReferralSystem", "Error applying referral code:", error);
      return false;
    } finally {
      setApplying(false);
    }
  };

  // Referans kodundan bonus hesapla
  const calculateBonus = () => {
    return (referrals.length * 0.003).toFixed(3);
  };

  return {
    referralCode,
    referrals,
    invitedBy,
    loading,
    applying,
    referralCount: referrals.length,
    bonus: calculateBonus(),
    applyCode,
    createNewReferralCode
  };
}
