
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { UserData } from '@/utils/storage';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

export function useAdminUsers(initialLimit = 20) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users with better error handling
  const fetchUsers = useCallback(async (limitCount = initialLimit) => {
    setLoading(true);
    setError(null);
    
    try {
      debugLog("useAdminUsers", "Fetching all users...");
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('lastSaved', 'desc'), limit(limitCount));
      const querySnapshot = await getDocs(q);
      
      const fetchedUsers: UserData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({
          userId: doc.id,
          ...doc.data()
        } as UserData);
      });
      
      debugLog("useAdminUsers", `Successfully loaded ${fetchedUsers.length} users`);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      setError((error as Error).message);
      toast.error("Kullanıcılar yüklenemedi: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  // Search users with improved error handling
  const searchUsers = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Boş arama terimi için varsayılan kullanıcıları getir
      return fetchUsers();
    }
    
    setLoading(true);
    setError(null);
    
    try {
      debugLog("useAdminUsers", `Searching users with term: ${searchTerm}`);
      
      // Try to use a more permissive query - just get all users and filter client-side
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('emailAddress'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const searchResults: UserData[] = [];
      
      // Client-side filtering for more flexibility
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.emailAddress && 
            userData.emailAddress.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchResults.push({
            userId: doc.id,
            ...userData
          } as UserData);
        }
      });
      
      debugLog("useAdminUsers", `Found ${searchResults.length} matching users`);
      setUsers(searchResults);
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      setError((error as Error).message);
      toast.error("Arama yapılırken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);
  
  // Refresh users function
  const refreshUsers = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);
  
  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return { 
    users, 
    loading,
    error,
    searchUsers, 
    refreshUsers 
  };
}
