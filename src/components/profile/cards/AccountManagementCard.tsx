
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, CheckCircle, Shield, Clock, RefreshCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "sonner";

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
  const [syncLoading, setSyncLoading] = useState(false);
  
  const handleSync = () => {
    setSyncLoading(true);
    
    setTimeout(() => {
      setSyncLoading(false);
      toast.success(t("profile.syncComplete"));
    }, 1500);
  };
  
  return (
    <Card className="bg-gradient-to-br from-navy-900/90 to-navy-950/90 overflow-hidden border-navy-800">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"></div>
      <CardHeader className="relative z-10">
        <CardTitle>{t("profile.accountManagement")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">{t("profile.userInfo")}</h3>
          
          <div className="rounded-md bg-navy-800/50 p-4 border border-navy-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">{t("profile.email")}</span>
              <span className="text-white font-medium">{currentUser?.email}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">{t("profile.accountStatus")}</span>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1.5 text-green-500" />
                <span className="text-green-400">{t("profile.active")}</span>
              </div>
            </div>
          </div>
          
          {userData?.isAdmin && (
            <div className="mt-2 bg-amber-600/20 text-amber-400 px-3 py-2 rounded-md flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              {t("profile.admin")}
            </div>
          )}
          
          <div className="rounded-md bg-navy-800/50 p-4 border border-navy-700 flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-gray-300">{t("profile.lastSync")}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSync} 
              disabled={syncLoading}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
            >
              <RefreshCcw className={`w-3.5 h-3.5 mr-1.5 ${syncLoading ? 'animate-spin' : ''}`} />
              {t("profile.sync")}
            </Button>
          </div>
        </div>
        
        <Separator className="bg-navy-700" />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">{t("profile.actions")}</h3>
          
          <Button 
            variant="destructive" 
            onClick={handleLogout} 
            disabled={loading}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("auth.logout")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountManagementCard;
