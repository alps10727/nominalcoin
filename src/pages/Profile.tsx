
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, userData, logout } = useSupabaseAuth();

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
        <p>Kullanıcı ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
        <p>İsim: {userData?.name || "Belirtilmemiş"}</p>
        <Button onClick={handleLogout} disabled={loading} className="mt-4">
          Çıkış Yap
        </Button>
      </div>
    </div>
  );
};

export default Profile;
