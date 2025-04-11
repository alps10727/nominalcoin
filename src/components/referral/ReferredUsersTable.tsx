
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { debugLog } from "@/utils/debugUtils";

interface ReferredUser {
  id: string;
  name: string;
  joinDate: string;
}

interface ReferredUsersTableProps {
  referredUsers: ReferredUser[];
  referralCount: number;
}

// Bağımsız komponent kullanımı için prop desteği
export const ReferredUsersTable = ({ 
  referredUsers: propReferredUsers, 
  referralCount: propReferralCount 
}: ReferredUsersTableProps) => {
  const { t } = useLanguage();
  const { userData } = useAuth();
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>(propReferredUsers || []);
  const [referralCount, setReferralCount] = useState(propReferralCount || 0);
  
  // Props veya context'ten veri al
  useEffect(() => {
    if (propReferredUsers && propReferredUsers.length > 0) {
      setReferredUsers(propReferredUsers);
    } else if (userData && userData.referrals && userData.referrals.length > 0) {
      // Auth context'ten gerçek veri al
      const userReferrals: ReferredUser[] = userData.referrals.map((userId) => {
        // Referans verilen kullanıcı ID'si var, gerçek adını kullan veya varsayılan bir ad ata
        return {
          id: userId,
          // Gerçek kullanıcı adını veya ID'nin kısa versiyonunu göster
          name: userId.substring(0, 8), // Kullanıcı ID'sinin ilk 8 karakteri
          joinDate: new Date().toLocaleDateString() // Gerçek tarih verisi yoksa mevcut tarih
        };
      });
      
      setReferredUsers(userReferrals);
      debugLog("ReferredUsersTable", "Kullanıcının davet ettiği kişiler:", userReferrals);
    }
    
    // Referral sayısını belirle
    const actualCount = propReferralCount > 0 
      ? propReferralCount 
      : userData?.referralCount || 0;
    
    setReferralCount(actualCount);
  }, [propReferredUsers, propReferralCount, userData, t]);

  if (referralCount === 0) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <UserPlus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-200">{t('referral.noReferrals', 'Henüz Davet Ettiğiniz Kullanıcı Yok')}</h3>
          <p className="mt-2 text-gray-400 text-sm">
            {t('referral.shareNow', 'Arkadaşlarınızı davet ederek ödüller kazanmaya başlayın!')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t('referral.referredUsers', 'Davet Ettiğiniz Kullanıcılar')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-navy-700">
              <TableHead className="text-gray-300">{t('referral.userName', 'Kullanıcı')}</TableHead>
              <TableHead className="text-gray-300 text-right">{t('referral.joinDate', 'Katılım Tarihi')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {referredUsers.map((user) => (
              <TableRow key={user.id} className="border-b border-navy-700/50">
                <TableCell className="py-2 font-medium text-gray-200">{user.name}</TableCell>
                <TableCell className="py-2 text-right text-gray-400">{user.joinDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
