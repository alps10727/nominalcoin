
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { createCustomReferralCode } from "@/services/referralService";
import { useAuth } from "@/contexts/AuthContext";
import { ReferralCodeDisplay } from "./ReferralCodeDisplay";
import { CustomCodeForm } from "./CustomCodeForm";
import { ReferralBonus } from "./ReferralBonus";

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
  const [isEditing, setIsEditing] = useState(false);
  
  // Display the custom code if available, otherwise display the auto-generated code
  const displayReferralCode = customReferralCode || referralCode;

  const handleCreateCustomCode = async (newCustomCode: string) => {
    if (!newCustomCode || !currentUser) return;
    
    // Create the custom code
    const success = await createCustomReferralCode(currentUser.uid, newCustomCode);
    if (success) {
      setIsEditing(false);
      // Refresh the page to see the changes
      window.location.reload();
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
            <CustomCodeForm 
              onCancel={() => setIsEditing(false)} 
              onCreateCode={handleCreateCustomCode} 
            />
          ) : (
            <ReferralCodeDisplay 
              displayReferralCode={displayReferralCode} 
              onEdit={() => setIsEditing(true)} 
            />
          )}

          <ReferralBonus />
        </div>
      </CardContent>
    </Card>
  );
};
