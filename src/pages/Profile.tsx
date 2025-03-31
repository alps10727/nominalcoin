
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
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-5 max-w-3xl mx-auto w-full pb-24 md:pb-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-100 to-purple-200 bg-clip-text text-transparent">{t('profile.title')}</h1>
        </div>

        <Card className="mb-6 border-none shadow-lg bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-gray-100 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-indigo-100">
              <div className="p-2 rounded-lg bg-indigo-700/30 backdrop-blur-sm border border-indigo-500/30">
                <User className="h-5 w-5 text-indigo-300" />
              </div>
              {t('profile.account')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-indigo-400">{t('profile.email')}</span>
              <span className="font-medium text-white">{currentUser?.email}</span>
            </div>
            
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-indigo-400">{t('profile.user_id')}</span>
              <span className="font-medium text-xs text-indigo-300 font-mono bg-indigo-950/50 p-2 rounded-md border border-indigo-800/50">
                {currentUser?.uid}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-none shadow-lg bg-gradient-to-br from-indigo-900/80 to-purple-900/80 text-gray-100 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-indigo-100">
              <div className="p-2 rounded-lg bg-indigo-700/30 backdrop-blur-sm border border-indigo-500/30">
                <Shield className="h-5 w-5 text-indigo-300" />
              </div>
              {t('profile.security')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              className="w-full bg-red-800/80 hover:bg-red-700/90 border border-red-700/50"
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
