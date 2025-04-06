
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { loadUserData } from "@/utils/storage";

interface UseOfflineLoginProps {
  email: string;
  loading: boolean;
}

export const useOfflineLogin = ({ email, loading }: UseOfflineLoginProps) => {
  const [offlineLoginAttempted, setOfflineLoginAttempted] = useState(false);
  const navigate = useNavigate();

  // Recovery mechanism if login takes too long
  useEffect(() => {
    if (!loading) return;
    
    const timeoutId = setTimeout(() => {
      if (loading && !offlineLoginAttempted) {
        console.log("Login timed out, attempting offline mode");
        attemptOfflineLogin();
      }
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [loading, offlineLoginAttempted, email]);

  // Offline login attempt
  const attemptOfflineLogin = async (): Promise<boolean> => {
    setOfflineLoginAttempted(true);
    
    // Check for user data in localStorage
    const localUserData = loadUserData();
    
    if (localUserData && localUserData.emailAddress === email) {
      console.log("Offline login successful");
      toast.success("Offline login successful. Limited features available.");
      navigate("/");
      return true;
    }
    
    return false;
  };

  return { offlineLoginAttempted, attemptOfflineLogin };
};
