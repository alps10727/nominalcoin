
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, UserPlus, Zap, Edit } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { REFERRAL_BONUS_RATE } from "@/utils/miningCalculator";
import { formatReferralCodeForDisplay } from "@/utils/referralUtils";
import { Input } from "@/components/ui/input";
import { createCustomReferralCode } from "@/services/referralService";
import { useAuth } from "@/contexts/AuthContext";

interface ReferralCodeCardProps {
  referralCode: string;
  referralLink?: string;
  customReferralCode?: string;
}

export const ReferralCodeCard = ({ 
  referralCode, 
  referralLink,
  customReferralCode
}: ReferralCodeCardProps) => {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const [showCopied, setShowCopied] = useState<'code' | 'link' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newCustomCode, setNewCustomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format the code for display (with dashes)
  const displayCode = formatReferralCodeForDisplay(referralCode);
  
  // Özel referans kodu veya normal referans kodunu göster
  const displayReferralCode = customReferralCode || displayCode;

  const copyToClipboard = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowCopied(type);
        setTimeout(() => setShowCopied(null), 2000);
        toast.success(t('referral.copied'), {
          description: text,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast.error(t('referral.copyFailed', 'Kopyalama başarısız oldu'));
      });
  };
  
  const handleCreateCustomCode = async () => {
    if (!newCustomCode || !currentUser) return;
    
    setIsCreating(true);
    setError(null);
    
    try {
      // Kodu doğrula
      if (newCustomCode.length < 4 || newCustomCode.length > 12) {
        setError("Referans kodu 4-12 karakter arasında olmalıdır");
        setIsCreating(false);
        return;
      }
      
      // Sadece harf ve rakam içermelidir
      if (!/^[A-Za-z0-9]+$/.test(newCustomCode)) {
        setError("Referans kodu sadece harf ve rakamlardan oluşmalıdır");
        setIsCreating(false);
        return;
      }
      
      const success = await createCustomReferralCode(currentUser.uid, newCustomCode);
      if (success) {
        setIsEditing(false);
        // Sayfayı yenile - değişikliği görmek için
        window.location.reload();
      }
    } catch (err) {
      console.error("Özel kod oluşturma hatası:", err);
      setError("Özel kod oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
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
          {isEditing ? (
            <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Özel referans kodunuzu oluşturun
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                  placeholder="Örn: FRIENDBONUS"
                  className="bg-navy-900/70 border-purple-500/30 text-white"
                  maxLength={12}
                />
                <Button
                  variant="outline"
                  disabled={isCreating || !newCustomCode}
                  onClick={handleCreateCustomCode}
                  className="whitespace-nowrap border border-purple-500/30"
                >
                  {isCreating ? "Oluşturuluyor..." : "Kaydet"}
                </Button>
              </div>
              {error && (
                <p className="text-xs text-red-400 mt-2">
                  {error}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                4-12 karakter arasında, sadece harf ve rakam içerebilir. Hepsi büyük harfe dönüştürülecektir.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                className="mt-2 text-gray-400 hover:text-white text-xs"
              >
                İptal
              </Button>
            </div>
          ) : (
            <div className="bg-navy-800/50 rounded-lg p-4 border border-purple-500/30 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('referral.code')}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs flex items-center text-purple-400 hover:text-purple-300"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Özel kod oluştur
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center flex-grow">
                  <div className="font-mono text-2xl md:text-2xl tracking-widest font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 py-2">
                    {displayReferralCode || "KOD OLUŞTUR"}
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="ml-3 h-10 w-10 text-gray-300 hover:text-white hover:bg-purple-700/20 border border-purple-500/30"
                  onClick={() => displayReferralCode && copyToClipboard(displayReferralCode, 'code')}
                  disabled={!displayReferralCode}
                >
                  {showCopied === 'code' ? 
                    <CheckCircle className="h-4 w-4 text-green-400" /> : 
                    <Copy className="h-4 w-4" />
                  }
                </Button>
              </div>
              <div className="animate-pulse mt-2 flex justify-center">
                <div className="text-xs text-purple-300/80">
                  {!displayReferralCode ? (
                    "Henüz referans kodunuz yok, özel kod oluşturabilirsiniz" 
                  ) : showCopied === 'code' ? (
                    t('referral.codeCopied', 'Kod kopyalandı!') 
                  ) : (
                    t('referral.tapToCopy', 'Kopyalamak için tıklayın')
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-6 text-gray-300">
            <p className="flex items-center justify-center mb-2">
              <Zap className="h-4 w-4 mr-1 text-yellow-400" />
              Her referans için <span className="text-green-400 font-bold mx-1">+{REFERRAL_BONUS_RATE}</span> mining hızı
            </p>
            <p className="text-xs text-gray-400">
              Her bir kullanıcı için yalnızca bir kez ödül alırsınız. Tekrarlı bonuslar verilmez.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
