
import { useState } from "react";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import SignInCard from "./SignInCard";

const SignInContainer = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login, isOffline } = useSupabaseAuth();

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setLoading(true);
    
    try {
      console.log("Giriş işlemi başlatılıyor:", email);
      
      // Supabase ile giriş yap
      const success = await login(email, password);
      setLoading(false);
      
      if (!success) {
        setError("Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.");
        return false;
      }
      
      return success;
    } catch (error) {
      console.error("Giriş hatası:", error);
      const errorMessage = (error as Error).message;
      setLoading(false);
      setError("Giriş yapılamadı: " + errorMessage);
      return false;
    }
  };

  return (
    <SignInCard 
      onSubmit={handleSignIn}
      error={error}
      loading={loading}
      isOffline={isOffline}
    />
  );
};

export default SignInContainer;
