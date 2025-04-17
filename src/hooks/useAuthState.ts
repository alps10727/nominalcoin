
import { useState, useEffect } from "react";
import { UserData } from "@/types/storage";

export interface AuthState {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  isOffline: boolean;
  dataSource: 'storage' | 'local' | null;
}

/**
 * Authentication state hook with local storage integration
 */
export function useAuthState(): AuthState {
  // Network availability monitor
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(navigator.onLine);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>({
    balance: 100,
    miningRate: 0.003,
    lastSaved: Date.now()
  });
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'storage' | 'local' | null>('local');
  
  // Setup online/offline event listeners
  useEffect(() => {
    const handleOnline = () => setIsNetworkAvailable(true);
    const handleOffline = () => setIsNetworkAvailable(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Simulating user initialization
  useEffect(() => {
    setLoading(true);
    
    // Simulate authentication check
    setTimeout(() => {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
      
      setLoading(false);
    }, 500);
  }, []);

  return { 
    currentUser, 
    userData, 
    loading,
    isOffline: !isNetworkAvailable,
    dataSource
  };
}

// User type definition
export interface User {
  uid: string;
  email: string | null;
}
