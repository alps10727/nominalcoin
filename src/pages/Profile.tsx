
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser, userData, updateUserData, isOffline } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Update local state when userData changes
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      debugLog("Profile", "userData updated:", userData);
    }
  }, [userData]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      debugLog("Profile", "Logging out...");
      
      // Clear local storage first
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('fcMinerUserData') || 
          key === 'userReferralCode' ||
          key.includes('supabase') ||
          key.includes('sb-')
        )) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
          debugLog("Profile", `Removed item: ${key}`);
        } catch (e) {
          // Ignore errors
        }
      });
      
      // Use the logout function from AuthContext
      await logout();
      navigate("/sign-in", { replace: true });
      toast.success(t("auth.logoutSuccess"));
      
    } catch (error) {
      setError("Çıkış yapılamadı: " + (error as Error).message);
      toast.error(t("auth.logoutFailed") + ": " + (error as Error).message);
      
      // Force hard logout if normal logout fails
      try {
        debugLog("Profile", "Forcing hard logout...");
        localStorage.clear(); // Clear everything as a last resort
        window.location.href = "/sign-in"; // Hard redirect
      } catch (e) {
        errorLog("Profile", "Even hard logout failed:", e);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Force reload the current page
      debugLog("Profile", "Refreshing page...");
      await supabase.auth.refreshSession();
      window.location.reload();
    } catch (error) {
      toast.error(t("auth.refreshError"));
      errorLog("Profile", "Refresh error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async () => {
    if (!updateUserData) return;
    
    setIsSaving(true);
    
    try {
      await updateUserData({
        name,
      });
      
      toast.success(t("profile.updateSuccess"));
    } catch (error) {
      toast.error(t("profile.updateError"));
      errorLog("Profile", "Profile update error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleRefresh}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("profile.refresh")}
        </Button>
      </div>
      
      {isOffline && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
          {t("app.offlineMode")}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-navy-900/90 to-navy-950/90">
          <CardHeader>
            <CardTitle>{t("profile.information")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <ProfileAvatar 
              initialAvatarUrl={avatarUrl || undefined} 
              onAvatarChange={setAvatarUrl}
              size="lg"
            />
            
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("profile.name")}</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("profile.namePlaceholder")}
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t("profile.email")}</Label>
                <Input 
                  value={currentUser?.email || ""} 
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t("profile.userId")}</Label>
                <Input 
                  value={currentUser?.id || ""} 
                  disabled
                  className="bg-gray-100 dark:bg-gray-800 font-mono text-sm"
                />
              </div>
              
              <Button 
                onClick={handleSaveProfile} 
                className="w-full"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent" />
                    {t("profile.saving")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("profile.saveProfile")}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
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
      </div>
    </div>
  );
};

export default Profile;
