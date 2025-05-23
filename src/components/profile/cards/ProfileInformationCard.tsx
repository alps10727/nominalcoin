
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import ProfileAvatar from "../ProfileAvatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Pencil, Save, X } from "lucide-react";

interface ProfileInformationCardProps {
  name: string;
  setName: (name: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  currentUser: any;
}

const ProfileInformationCard = ({
  name,
  setName,
  avatarUrl,
  setAvatarUrl,
  currentUser
}: ProfileInformationCardProps) => {
  const { t } = useLanguage();
  const { updateUserData, userData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editableName, setEditableName] = useState(name);
  
  useEffect(() => {
    setEditableName(name);
  }, [name]);
  
  const handleSave = async () => {
    if (userData) {
      try {
        await updateUserData({
          ...userData,
          name: editableName
        });
        setName(editableName);
        setIsEditing(false);
        toast.success(t("profile.updateSuccess"));
      } catch (error) {
        toast.error(t("profile.updateError"));
      }
    }
  };
  
  const handleCancel = () => {
    setEditableName(name);
    setIsEditing(false);
  };
  
  return (
    <Card className="shadow-md border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{t("profile.information")}</CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel}
                className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSave}
                className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col lg:flex-row lg:items-start gap-8 pt-4">
        <div className="flex flex-col items-center lg:w-1/3">
          <ProfileAvatar 
            initialAvatarUrl={avatarUrl || undefined} 
            onAvatarChange={setAvatarUrl}
            size="lg"
          />
        </div>
        
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t("profile.name")}
            </Label>
            {isEditing ? (
              <Input 
                id="name" 
                value={editableName} 
                onChange={(e) => setEditableName(e.target.value)}
                placeholder={t("profile.namePlaceholder")}
              />
            ) : (
              <div className="p-2 px-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                {name || t("profile.namePlaceholder")}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("profile.email")}
            </Label>
            <div className="p-2 px-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              {currentUser?.email || ""}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userId" className="text-sm font-medium">
              {t("profile.userId")}
            </Label>
            <div className="p-2 px-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-500 dark:text-gray-400 break-all">
              {currentUser?.id || ""}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;
