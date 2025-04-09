
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs, orderBy, limit, getDoc, doc } from 'firebase/firestore';
import { UserData } from '@/utils/storage';
import { toast } from 'sonner';
import { debugLog } from '@/utils/debugUtils';

export function useAdminUsers(initialLimit = 20) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tüm kullanıcıları getir - iyileştirilmiş hata yönetimi ile
  const fetchUsers = useCallback(async (limitCount = initialLimit) => {
    setLoading(true);
    setError(null);
    
    try {
      debugLog("useAdminUsers", "Fetching all users...");
      
      // Firebase'in doğrudan koleksiyon sorgusunda izin sorunları var
      // Önce admin doc'u kontrol edip ardından simüle edilmiş kullanıcı verileri döndürelim
      
      // Admin erişimini kontrol et
      const isAdmin = localStorage.getItem('isAdminSession') === 'true';
      
      if (!isAdmin) {
        throw new Error("Admin yetkisi bulunmamaktadır");
      }
      
      try {
        // Gerçek veriler için deneme
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
      } catch (err) {
        console.error("Firebase veri yükleme hatası:", err);
        
        // Firebase izin hatası, demo veriler ile işlem yap
        const demoUsers: UserData[] = [
          {
            userId: 'demo001',
            emailAddress: 'demo@example.com',
            balance: 125.75,
            miningRate: 0.05,
            lastSaved: Date.now() - 3600000
          },
          {
            userId: 'demo002',
            emailAddress: 'user@example.com',
            balance: 348.20,
            miningRate: 0.08,
            lastSaved: Date.now() - 7200000
          },
          {
            userId: 'admin001',
            emailAddress: 'admin@example.com',
            balance: 1000.00,
            miningRate: 0.15,
            lastSaved: Date.now(),
            isAdmin: true
          }
        ];
        
        setUsers(demoUsers);
        setError("Firebase erişim hatası - Demo veriler gösteriliyor");
      }
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      setError((error as Error).message);
      toast.error("Kullanıcılar yüklenemedi: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [initialLimit]);

  // Kullanıcı arama - istemci tarafı filtreleme ile
  const searchUsers = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      // Boş arama terimi için varsayılan kullanıcıları getir
      return fetchUsers();
    }
    
    setLoading(true);
    setError(null);
    
    try {
      debugLog("useAdminUsers", `Searching users with term: ${searchTerm}`);
      
      // Admin erişimini kontrol et
      const isAdmin = localStorage.getItem('isAdminSession') === 'true';
      
      if (!isAdmin) {
        throw new Error("Admin yetkisi bulunmamaktadır");
      }
      
      try {
        // Gerçek Firebase sorgusu deneme
        // Önce tüm kullanıcıları al ve istemci tarafında filtrele
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('lastSaved', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        
        const searchResults: UserData[] = [];
        
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
      } catch (err) {
        console.error("Firebase arama hatası:", err);
        
        // Demo verilerle ara
        const demoUsers: UserData[] = [
          {
            userId: 'demo001',
            emailAddress: 'demo@example.com',
            balance: 125.75,
            miningRate: 0.05,
            lastSaved: Date.now() - 3600000
          },
          {
            userId: 'demo002',
            emailAddress: 'user@example.com',
            balance: 348.20,
            miningRate: 0.08,
            lastSaved: Date.now() - 7200000
          },
          {
            userId: 'admin001',
            emailAddress: 'admin@example.com',
            balance: 1000.00,
            miningRate: 0.15,
            lastSaved: Date.now(),
            isAdmin: true
          }
        ];
        
        // Demo verilerde ara
        const filteredUsers = demoUsers.filter(user => 
          user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        setUsers(filteredUsers);
        setError("Firebase erişim hatası - Demo arama sonuçları gösteriliyor");
      }
    } catch (error) {
      console.error("Kullanıcı arama hatası:", error);
      setError((error as Error).message);
      toast.error("Arama yapılırken hata oluştu: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);
  
  // Kullanıcıları yenilemek için fonksiyon
  const refreshUsers = useCallback(() => {
    return fetchUsers();
  }, [fetchUsers]);
  
  // Bileşen yüklendiğinde kullanıcıları getir
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
