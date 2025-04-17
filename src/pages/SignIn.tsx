
import { useEffect } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import LoadingScreen from "@/components/dashboard/LoadingScreen";
import SignInContainer from "@/components/auth/SignInContainer";
import { Toaster } from "sonner";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSupabaseAuth();

  // Kullanıcı giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  // Eğer sayfa yükleniyorsa, yükleme ekranını göster
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Toast bildirimleri için Toaster komponenti */}
      <Toaster richColors position="top-center" />
      
      <SignInContainer />
    </div>
  );
};

export default SignIn;
