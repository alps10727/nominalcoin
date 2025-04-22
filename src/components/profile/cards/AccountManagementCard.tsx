
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AccountManagementCardProps {
  currentUser: any;
  userData: any;
  loading: boolean;
  handleLogout: () => Promise<void>;
}

const AccountManagementCard = ({
  currentUser,
  userData,
  loading,
  handleLogout
}: AccountManagementCardProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-gradient-to-br from-navy-900/90 to-navy-950/90">
      <CardHeader>
        <CardTitle>{t("profile.accountManagement")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">{t("profile.userInfo")}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("profile.email")}: {currentUser?.email}
          </p>
          {userData?.isAdmin && (
            <div className="mt-2 bg-amber-600/20 text-amber-400 px-2 py-1 rounded-md inline-block">
              {t("profile.admin")}
            </div>
          )}
        </div>
        
        <Button 
          variant="destructive" 
          onClick={handleLogout} 
          disabled={loading}
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t("auth.logout")}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountManagementCard;
