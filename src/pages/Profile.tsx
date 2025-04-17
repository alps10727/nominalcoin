
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { Button } from "@/components/ui/button";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, Save } from "lucide-react";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser, userData, updateUserData } = useAuth();
  
  const [name, setName] = useState(userData?.name || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/sign-in");
      toast.success("Çıkış başarılı!");
    } catch (error) {
      setError("Çıkış yapılamadı: " + (error as Error).message);
      toast.error("Çıkış yapılamadı: " + (error as Error).message);
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
        // Diğer profil verileri burada güncellenebilir
      });
      
      toast.success("Profil başarıyla güncellendi");
    } catch (error) {
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-navy-900/90 to-navy-950/90">
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <ProfileAvatar 
              initialAvatarUrl={avatarUrl || undefined} 
              onAvatarChange={setAvatarUrl}
              size="lg"
            />
            
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Adınız</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınızı girin"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  value={currentUser?.email || ""} 
                  disabled
                  className="bg-gray-100 dark:bg-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Kullanıcı ID</Label>
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
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Profili Kaydet
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-navy-900/90 to-navy-950/90">
          <CardHeader>
            <CardTitle>Hesap Yönetimi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Kullanıcı Bilgileri</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Email: {currentUser?.email}
              </p>
              {userData?.isAdmin && (
                <div className="mt-2 bg-amber-600/20 text-amber-400 px-2 py-1 rounded-md inline-block">
                  Admin
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
              Çıkış Yap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
