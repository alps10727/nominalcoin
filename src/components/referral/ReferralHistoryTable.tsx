
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HistoryIcon, MessageCirclePlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { getUserReferralTransactions } from "@/services/multiLevelReferralService";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface ReferralTransaction {
  id: string;
  referredId: string; // Değiştirildi: referredUserId -> referredId
  bonusLevel: string;
  bonusRate: number;
  bonus: number; // Eklendi: bonus değeri
  miningRateIncrease?: number; // Opsiyonel yapıldı
  timestamp: { toDate: () => Date };
  description: string;
}

export const ReferralHistoryTable = () => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<ReferralTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      if (currentUser?.uid) {
        try {
          setLoading(true);
          const data = await getUserReferralTransactions(currentUser.uid);
          setTransactions(data as ReferralTransaction[]);
        } catch (error) {
          console.error("Referans işlemleri yüklenirken hata:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTransactions();
  }, [currentUser?.uid]);

  if (loading) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100 mt-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-20">
            <div className="animate-pulse text-gray-400">Yükleniyor...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100 mt-6">
        <CardContent className="p-6 text-center">
          <div className="mb-4 flex justify-center">
            <HistoryIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-200">{t('referral.noTransactions', 'Henüz Referans Ödülü Kazanmadınız')}</h3>
          <p className="mt-2 text-gray-400 text-sm">
            {t('referral.inviteMore', 'Daha fazla arkadaşınızı davet ederek ödüller kazanın!')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100 mt-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center">
          <HistoryIcon className="h-4 w-4 mr-2 text-purple-400" />
          {t('referral.bonusHistory', 'Referans Ödül Geçmişi')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-navy-700">
              <TableHead className="text-gray-300">{t('referral.user', 'Kullanıcı')}</TableHead>
              <TableHead className="text-gray-300">{t('referral.bonusType', 'Ödül')}</TableHead>
              <TableHead className="text-gray-300 text-right">{t('referral.increase', 'Artış')}</TableHead>
              <TableHead className="text-gray-300 text-right">{t('referral.when', 'Ne Zaman')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-b border-navy-700/50">
                <TableCell className="py-2">
                  <div className="flex items-center">
                    <MessageCirclePlus className="h-4 w-4 mr-2 text-blue-400" />
                    <span className="text-gray-200 text-sm">{tx.referredId.substring(0, 6)}...</span>
                  </div>
                </TableCell>
                <TableCell className="py-2 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tx.bonusLevel === 'direct' 
                      ? 'bg-green-900/30 text-green-300' 
                      : 'bg-blue-900/30 text-blue-300'
                  }`}>
                    {tx.bonusLevel === 'direct' 
                      ? t('referral.directBonus', 'Doğrudan') 
                      : t('referral.indirectBonus', 'Dolaylı')} 
                    {tx.bonusRate && ` (${tx.bonusRate * 100}%)`}
                  </span>
                </TableCell>
                <TableCell className="py-2 text-right font-mono text-green-400">
                  +{(tx.miningRateIncrease || tx.bonus).toFixed(3)}
                </TableCell>
                <TableCell className="py-2 text-right text-gray-400 text-xs">
                  {formatDistanceToNow(tx.timestamp.toDate(), { addSuffix: true, locale: tr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
