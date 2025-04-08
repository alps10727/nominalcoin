
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Copy, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { validateReferralCode, createReferralLink } from "@/utils/referralUtils";

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
  const [showCopied, setShowCopied] = useState<'code' | 'link' | null>(null);
  
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

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopied(type);
        setTimeout(() => setShowCopied(null), 2000);
        toast.success(t('referral.copied'), {
          description: type === 'code' ? referralCode : referralLink,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error(t('referral.copyFailed', 'Kopyalama başarısız oldu'));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('referral.title')}</h1>
          <p className="text-gray-300 mt-2">{t('referral.subtitle', 'Arkadaşlarınızı davet edin ve ödüller kazanın')}</p>
        </div>

        <Card className="mb-6 overflow-hidden border-none shadow-lg bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-gray-200">
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2 text-purple-400" />
                {t('referral.yourCode', 'Referans Kodunuz')}
              </div>
            </CardTitle>
            <CardDescription className="text-gray-300">
              {t('referral.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4 space-y-6">
              {/* Enhanced and larger referral code display */}
              <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('referral.code')}
                </label>
                <div className="flex items-center justify-between">
                  <div className="text-center flex-grow">
                    <div className="font-mono text-3xl md:text-4xl tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 py-2">
                      {referralCode}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2 h-12 w-12 text-gray-300 hover:text-white hover:bg-purple-700/20"
                    onClick={() => copyToClipboard(referralCode, 'code')}
                  >
                    {showCopied === 'code' ? 
                      <CheckCircle className="h-5 w-5 text-green-400" /> : 
                      <Copy className="h-5 w-5" />
                    }
                  </Button>
                </div>
                <div className="animate-pulse mt-3 flex justify-center">
                  <div className="text-xs text-purple-300/70">
                    {showCopied === 'code' ? 
                      t('referral.codeCopied', 'Kod kopyalandı!') : 
                      t('referral.tapToCopy', 'Kopyalamak için tıklayın')
                    }
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 text-gray-300">
                <p>{t('referral.reward', "5.0")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="border-none shadow-md bg-gradient-to-br from-darkPurple-900/80 to-navy-950/90 text-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('referral.stats', 'Davet İstatistikleri')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">{referralCount}</p>
                  <p className="text-sm text-gray-400">{t('referral.joined', 'Katılan Arkadaşlar')}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{referralCount * 5} FC</p>
                  <p className="text-sm text-gray-400">{t('referral.earned', 'Kazanılan Ödüller')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {referralCount > 0 && (
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
        )}

        {referralCount === 0 && (
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
        )}
      </main>
    </div>
  );
};

export default Referral;
