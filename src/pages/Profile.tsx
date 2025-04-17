
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePoolSystem } from "@/hooks/usePoolSystem";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Settings, Users, Database } from "lucide-react";
import CreatePoolForm from "@/components/pools/CreatePoolForm";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser, userData } = useAuth();
  const { currentPool } = usePoolSystem();

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

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-4 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      <Tabs defaultValue="profile" className="mt-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 bg-gray-900/50 border border-gray-800/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-900/30">
            <UserPlus className="h-4 w-4 mr-2" />
            Bilgiler
          </TabsTrigger>
          <TabsTrigger value="createpool" className="data-[state=active]:bg-purple-900/30">
            <Database className="h-4 w-4 mr-2" />
            Havuz Oluştur
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-xl text-indigo-200">Kullanıcı Bilgileri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-gray-400">Kullanıcı ID:</div>
                  <div className="text-gray-200">{currentUser?.uid}</div>
                  
                  <div className="text-gray-400">Email:</div>
                  <div className="text-gray-200">{currentUser?.email}</div>
                  
                  <div className="text-gray-400">Rütbe:</div>
                  <div className="text-purple-300 font-medium">{userData?.miningStats?.rank || "Çaylak"}</div>
                  
                  <div className="text-gray-400">Madencilik Günü:</div>
                  <div className="text-gray-200">{userData?.miningStats?.totalDays || 0} gün</div>
                  
                  <div className="text-gray-400">Mevcut Havuz:</div>
                  <div className="text-cyan-300">{currentPool?.name || "Yok"}</div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleLogout} variant="destructive" className="w-full md:w-auto">
                    Çıkış Yap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="createpool" className="mt-6">
          <CreatePoolForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
