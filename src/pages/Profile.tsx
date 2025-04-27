import React, { useState, useEffect } from 'react';
import { useAdMob } from '@/hooks/useAdMob';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileInformationCard from "@/components/profile/cards/ProfileInformationCard";
import AccountManagementCard from "@/components/profile/cards/AccountManagementCard";

const Profile = () => {
  const { showBannerAd } = useAdMob();

  useEffect(() => {
    showBannerAd();
  }, [showBannerAd]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser, userData, isOffline } = useAuth();
  const { t } = useLanguage();
  
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
      </div>
      
      {isOffline && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4 flex items-center">
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
          {t("app.offlineMode")}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInformationCard
          name={name}
          setName={setName}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
          currentUser={currentUser}
        />
        
        <AccountManagementCard
          currentUser={currentUser}
          userData={userData}
          loading={loading}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default Profile;
