
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('profile.logout_success'));
      navigate('/sign-in');
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t('profile.logout_error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-blue-950 dark:from-navy-950 dark:to-blue-950 flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">{t('profile.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-navy-900 text-gray-100 dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-5 w-5 text-teal-400" />
              {t('profile.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-400">{t('profile.email')}</span>
              <span className="font-medium">{currentUser?.email}</span>
            </div>
            
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-400">{t('profile.user_id')}</span>
              <span className="font-medium text-xs text-teal-400 font-mono">
                {currentUser?.uid}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-none shadow-lg bg-navy-900 text-gray-100 dark:bg-navy-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-teal-400" />
              {t('profile.security')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full bg-red-800 hover:bg-red-700"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('profile.logout')}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;
