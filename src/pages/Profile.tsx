
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserRound, LogOut, Save, Pencil, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Profile = () => {
  const { currentUser, userData, logout, updateUserData, isOffline } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState("");
  
  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setEditableName(userData.name || "");
      // Get avatarUrl from custom properties using type assertion
      const userDataWithAvatar = userData as any;
      setAvatarUrl(userDataWithAvatar.avatarUrl || null);
    }
  }, [userData]);
  
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/sign-in", { replace: true });
      toast.success(t("auth.logoutSuccess"));
    } catch (error) {
      toast.error(t("auth.logoutFailed"));
    } finally {
      setLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (userData) {
      try {
        // Create an extended data object that includes avatarUrl
        const updatedData = {
          ...userData,
          name: editableName,
        };
        
        // Use type assertion to add avatarUrl to the update object
        const updatedDataWithAvatar = updatedData as any;
        if (avatarUrl) {
          updatedDataWithAvatar.avatarUrl = avatarUrl;
        }
        
        await updateUserData(updatedDataWithAvatar);
        
        setName(editableName);
        setIsEditing(false);
        toast.success(t("profile.updateSuccess"));
      } catch (error) {
        toast.error(t("profile.updateError"));
      }
    }
  };
  
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container max-w-3xl mx-auto p-4 pb-20">
        <h1 className="text-2xl font-medium mb-6 text-center">
          {t("profile.title")}
          {isOffline && (
            <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded-full">
              {t("app.offlineMode")}
            </span>
          )}
        </h1>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-4 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center">
                <UserRound className="w-5 h-5 mr-2" />
                {t("profile.information")}
              </CardTitle>
              {!isEditing ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="h-8"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {t("profile.edit")}
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setEditableName(name);
                      setIsEditing(false);
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t("profile.cancel")}
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t("profile.save")}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center md:w-1/3">
                <ProfileAvatar 
                  initialAvatarUrl={avatarUrl || undefined} 
                  onAvatarChange={setAvatarUrl}
                  size="lg"
                />
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("profile.name")}</Label>
                  {isEditing ? (
                    <Input 
                      id="name" 
                      value={editableName} 
                      onChange={(e) => setEditableName(e.target.value)}
                      placeholder={t("profile.namePlaceholder")}
                      className="bg-background"
                    />
                  ) : (
                    <div className="p-2 px-3 rounded-md bg-muted/50">
                      {name || t("profile.namePlaceholder")}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t("profile.email")}</Label>
                  <div className="p-2 px-3 rounded-md bg-muted/50 text-muted-foreground">
                    {currentUser?.email || ""}
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <Button 
                    variant="destructive" 
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {userData?.isAdmin && (
          <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-3 rounded-md flex items-center justify-center">
            <span className="font-medium">{t("profile.admin")}</span>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default Profile;
