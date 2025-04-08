
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { validateReferralCode, createReferralLink } from "@/utils/referralUtils";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { ReferredUsersTable } from "@/components/referral/ReferredUsersTable";

// Mock data for demonstrating the referral list
// In real implementation, this would come from Firebase
interface ReferredUser {
  id: string;
  name: string;
  joinDate: string;
}

const Referral = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { userData } = useAuth();
  
  // Generate a referral code if the user doesn't have one
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);

  useEffect(() => {
    if (userData) {
      // Use user's referral code if available
      const code = userData.referralCode || "LOADING...";
      setReferralCode(code);
      setReferralLink(createReferralLink(code));
      
      // Set referral count
      setReferralCount(userData.referralCount || 0);
      
      // In a real app, we'd fetch the referred users from Firebase
      // For now, we'll use mock data based on the user's referral count
      const mockReferredUsers: ReferredUser[] = [];
      if (userData.referrals && Array.isArray(userData.referrals)) {
        userData.referrals.forEach((userId, index) => {
          mockReferredUsers.push({
            id: userId,
            name: `Kullanıcı ${index + 1}`,
            joinDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toLocaleDateString()
          });
        });
      }
      setReferredUsers(mockReferredUsers);
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('referral.title')}</h1>
          <p className="text-gray-300 mt-2">{t('referral.subtitle', 'Arkadaşlarınızı davet edin ve ödüller kazanın')}</p>
        </div>

        <ReferralCodeCard 
          referralCode={referralCode} 
          referralLink={referralLink} 
        />

        <div className="grid grid-cols-1 gap-4 mb-6">
          <ReferralStatsCard referralCount={referralCount} />
        </div>

        <ReferredUsersTable 
          referredUsers={referredUsers} 
          referralCount={referralCount} 
        />
      </main>
    </div>
  );
};

export default Referral;
