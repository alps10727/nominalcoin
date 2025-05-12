
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLog, errorLog } from "@/utils/debugUtils";
import ProfileInformationCard from "@/components/profile/cards/ProfileInformationCard";
import AccountManagementCard from "@/components/profile/cards/AccountManagementCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRound, Shield, Settings } from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser, userData, isOffline } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
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
      
      await logout();
      navigate("/sign-in", { replace: true });
      toast.success(t("auth.logoutSuccess"));
      
    } catch (error) {
      toast.error(t("auth.logoutFailed") + ": " + (error as Error).message);
      
      try {
        debugLog("Profile", "Forcing hard logout...");
        localStorage.clear();
        window.location.href = "/sign-in";
      } catch (e) {
        errorLog("Profile", "Even hard logout failed:", e);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t("profile.title")}
        </h1>
        {isOffline && (
          <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-2 px-4 rounded-full text-sm flex items-center">
            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
            {t("app.offlineMode")}
          </div>
        )}
      </div>
      
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {t("profile.personal")}
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t("profile.account")}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {t("profile.settings")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-4 animate-fade-in">
          <ProfileInformationCard
            name={name}
            setName={setName}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            currentUser={currentUser}
          />
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 animate-fade-in">
          <AccountManagementCard
            currentUser={currentUser}
            userData={userData}
            loading={loading}
            handleLogout={handleLogout}
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">{t("profile.comingSoon")}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t("profile.settingsDescription")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
