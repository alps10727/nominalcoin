
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ReferredUser {
  id: string;
  name: string;
  joinDate: string;
}

interface ReferredUsersTableProps {
  referredUsers: ReferredUser[];
  referralCount: number;
  isLoading?: boolean;
}

export const ReferredUsersTable = ({ referredUsers, referralCount, isLoading = false }: ReferredUsersTableProps) => {
  const { t } = useLanguage();

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{t('referral.referredUsers', 'Davet Ettiğiniz Kullanıcılar')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full bg-navy-800/50" />
            <Skeleton className="h-16 w-full bg-navy-800/50" />
            <Skeleton className="h-16 w-full bg-navy-800/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // No referrals state
  if (referralCount === 0 || referredUsers.length === 0) {
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

  // Referrals exist
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
