import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { Button } from "@/components/ui/button";

// EmulatorSwitch bileşenini içe aktar
import EmulatorSwitch from "@/components/settings/EmulatorSwitch";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Profil</h1>
      
      <div>
        <p>Kullanıcı ID: {currentUser?.uid}</p>
        <p>Email: {currentUser?.email}</p>
        <Button onClick={handleLogout} disabled={loading}>
          Çıkış Yap
        </Button>
      </div>
      
      {/* Geliştirici ayarları bölümü */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Geliştirici Ayarları</h2>
          <EmulatorSwitch />
        </div>
      )}
    </div>
  );
};

export default Profile;
