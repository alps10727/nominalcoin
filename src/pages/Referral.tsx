
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { createReferralLink } from "@/utils/referralUtils";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { ReferredUsersTable } from "@/components/referral/ReferredUsersTable";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

// Define the referral user interface
interface ReferredUser {
  id: string;
  name: string;
  joinDate: string;
}

const Referral = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { userData, currentUser } = useAuth();
  
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch real referrals data from Firestore
  useEffect(() => {
    const fetchReferrals = async () => {
      if (!currentUser || !userData) return;

      try {
        setIsLoading(true);
        debugLog("Referral", "Fetching referral data for user:", currentUser.uid);
        
        // Update referral code from userData
        const code = userData.referralCode || "LOADING...";
        setReferralCode(code);
        setReferralLink(createReferralLink(code));
        
        // Set referral count from userData
        setReferralCount(userData.referralCount || 0);

        // Approach 1: First check if we have referral IDs in userData
        if (userData.referrals && Array.isArray(userData.referrals) && userData.referrals.length > 0) {
          const fetchedUsers: ReferredUser[] = [];
          
          // Fetch each user's data from the users collection
          for (const referredUserId of userData.referrals) {
            try {
              // For now we'll use the ID as the name since we might not have access to the user's profile
              // In a real implementation, you would fetch more details from the user document
              fetchedUsers.push({
                id: referredUserId,
                name: `User ${fetchedUsers.length + 1}`, // Temporary name based on index
                joinDate: new Date().toLocaleDateString() // We don't have the actual join date yet
              });
            } catch (error) {
              errorLog("Referral", `Error fetching referred user ${referredUserId}:`, error);
            }
          }
          
          setReferredUsers(fetchedUsers);
        } 
        // Approach 2: If no referrals in userData, try to fetch from subcollection
        else {
          try {
            debugLog("Referral", "Trying to fetch referrals from subcollection");
            const referralsRef = collection(db, "users", currentUser.uid, "referrals");
            const snapshot = await getDocs(referralsRef);
            
            if (!snapshot.empty) {
              const fetchedUsers: ReferredUser[] = [];
              
              snapshot.forEach(doc => {
                const data = doc.data();
                fetchedUsers.push({
                  id: doc.id,
                  name: data.name || `User ${fetchedUsers.length + 1}`,
                  joinDate: data.joinDate ? new Date(data.joinDate).toLocaleDateString() : new Date().toLocaleDateString()
                });
              });
              
              setReferredUsers(fetchedUsers);
            } else {
              debugLog("Referral", "No referrals found in subcollection");
              setReferredUsers([]);
            }
          } catch (subError) {
            errorLog("Referral", "Error fetching referrals subcollection:", subError);
            toast.error(t('errors.loadFailed', 'Davet verileri yüklenirken hata oluştu'));
          }
        }
      } catch (error) {
        errorLog("Referral", "Error in fetchReferrals:", error);
        toast.error(t('errors.loadFailed', 'Davet verileri yüklenirken hata oluştu'));
        setReferredUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [currentUser, userData, t]);

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
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Referral;
