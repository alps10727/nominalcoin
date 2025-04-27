
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileAvatar from "../ProfileAvatar";
import { useLanguage } from "@/contexts/LanguageContext";

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
  
  return (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInformationCard;
