
import { useState, useCallback } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { UserData } from '@/utils/storage';
import { toast } from 'sonner';

export function useAdminUsers(initialLimit = 20) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (limitCount = initialLimit) => {
    setLoading(true);
    try {
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
      
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      toast.error("Kullanıcılar yüklenemedi: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  const searchUsers = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Boş arama terimi için varsayılan kullanıcıları getir
      return fetchUsers();
    }
    
    setLoading(true);
    try {
      // Önce e-posta ile ara
      const emailQuery = query(
        collection(db, 'users'),
        where('emailAddress', '>=', searchTerm),
        where('emailAddress', '<=', searchTerm + '\uf8ff'),
        limit(20)
      );
      
      const emailSnapshot = await getDocs(emailQuery);
      const searchResults: UserData[] = [];
      
      emailSnapshot.forEach((doc) => {
        searchResults.push({
          userId: doc.id,
          ...doc.data()
        } as UserData);
      });
      
      setUsers(searchResults);
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      toast.error("Arama yapılırken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);
  
  // İlk yükleme ve yenileme işlevi
  const refreshUsers = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);
  
  // İlk yüklemede kullanıcıları getir
  useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return { 
    users, 
    loading, 
    searchUsers, 
    refreshUsers 
  };
}
