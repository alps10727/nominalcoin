
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileAvatarProps {
  initialAvatarUrl?: string;
  onAvatarChange?: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
}

const ProfileAvatar = ({ 
  initialAvatarUrl, 
  onAvatarChange,
  size = "md" 
}: ProfileAvatarProps) => {
  const { t } = useLanguage();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialAvatarUrl);
  const { uploadUserFile, deleteUserFile, uploading, progress } = useFileUpload();
  const { currentUser, userData } = useAuth();
  
  const name = userData?.name || currentUser?.email || "User";
  const initials = name.substring(0, 2).toUpperCase();
  
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32"
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error(t("profile.validImageError"));
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profile.fileSizeError"));
      return;
    }
    
    try {
      const url = await uploadUserFile(file, 'avatars');
      
      if (url) {
        setAvatarUrl(url);
        if (onAvatarChange) {
          onAvatarChange(url);
        }
      }
    } catch (error) {
      toast.error(t("profile.uploadError"));
    }
  };
  
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    
    try {
      const success = await deleteUserFile(avatarUrl);
      
      if (success) {
        setAvatarUrl(undefined);
        if (onAvatarChange) {
          onAvatarChange(null);
        }
      }
    } catch (error) {
      toast.error(t("profile.deleteError"));
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={`${sizeClasses[size]} ring-2 ring-primary/10`}>
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
        ) : null}
        <AvatarFallback className="bg-primary/5 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {uploading && (
        <div className="w-full max-w-[200px]">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-center mt-1 text-muted-foreground">{progress}%</p>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm" className="relative" disabled={uploading}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="h-4 w-4 mr-1" />
          {t("profile.upload")}
        </Button>
        
        {avatarUrl && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRemoveAvatar}
            disabled={uploading}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("profile.delete")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileAvatar;
