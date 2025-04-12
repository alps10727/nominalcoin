
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { validateReferralCode, createReferralLink } from "@/utils/referralUtils";
import { ReferralCodeCard } from "@/components/referral/ReferralCodeCard";
import { ReferralStatsCard } from "@/components/referral/ReferralStatsCard";
import { ReferredUsersTable } from "@/components/referral/ReferredUsersTable";
import { ReferralHistoryTable } from "@/components/referral/ReferralHistoryTable";

// Gerçek veri için tipi tanımlıyoruz
interface ReferredUser {
  id: string;
  name: string;
  joinDate: string;
}

const Referral = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { userData } = useAuth();
  
  // Davetiye kodu ve link durumlarını tanımla
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [referralCount, setReferralCount] = useState<number>(0);
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);

  // Kullanıcı verileri değiştiğinde referans bilgilerini güncelle
  useEffect(() => {
    if (userData) {
      // Kullanıcının referans kodunu kullan (varsa)
      const code = userData.referralCode || "";
      setReferralCode(code);
      setReferralLink(createReferralLink(code));
      
      // Referans sayısını ayarla
      setReferralCount(userData.referralCount || 0);
      
      // Referans verilen kullanıcıları ayarla (gerçek veri)
      if (userData.referrals && Array.isArray(userData.referrals)) {
        // userData'dan gerçek referansları al - sadece doğrudan referanslar
        const users: ReferredUser[] = userData.referrals.map((userId) => ({
          id: userId,
          name: userId.substring(0, 8), // Kullanıcı ID'sinin ilk 8 karakteri
          joinDate: new Date().toLocaleDateString() // Gerçek tarih verisi yoksa mevcut tarih
        }));
        setReferredUsers(users);
      }
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
        
        {/* Sadece doğrudan referans bonusu geçmişi */}
        <ReferralHistoryTable />
      </main>
    </div>
  );
};

export default Referral;
