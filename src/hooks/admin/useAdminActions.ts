
import { db } from '@/config/firebase';
import { doc, setDoc, updateDoc, getDoc, collection, getDocs, writeBatch, query, where } from 'firebase/firestore';
import { UserData } from '@/utils/storage';
import { toast } from 'sonner';

export interface AdminMessage {
  subject: string;
  message: string;
  to: "all" | string[];
  sentAt: number;
}

export function useAdminActions() {
  // Kullanıcı bakiyesini güncelleme
  const updateUserBalance = async (userId: string, newBalance: number) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error("Kullanıcı bulunamadı");
      }
      
      await updateDoc(userRef, {
        balance: newBalance,
        lastSaved: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error("Bakiye güncellenirken hata:", error);
      throw error;
    }
  };
  
  // Kullanıcılara mesaj gönderme
  const sendMessage = async (messageData: AdminMessage) => {
    try {
      const { to, subject, message, sentAt } = messageData;
      
      // Tüm kullanıcılara gönder
      if (to === "all") {
        const usersRef = collection(db, "users");
        const usersSnapshot = await getDocs(usersRef);
        
        // Mesajları toplu olarak kaydet
        const batch = writeBatch(db);
        const messageId = `admin_msg_${Date.now()}`;
        
        usersSnapshot.forEach(userDoc => {
          const userId = userDoc.id;
          const userMessageRef = doc(db, `users/${userId}/messages`, messageId);
          
          batch.set(userMessageRef, {
            subject,
            message,
            sentAt,
            isRead: false,
            isAdminMessage: true
          });
        });
        
        await batch.commit();
        return true;
      } 
      // Belirli kullanıcılara gönder
      else {
        const batch = writeBatch(db);
        const messageId = `admin_msg_${Date.now()}`;
        
        // E-posta adreslerine göre kullanıcıları bul
        for (const email of to) {
          const usersQuery = query(collection(db, "users"), where("emailAddress", "==", email));
          const matchingUsers = await getDocs(usersQuery);
          
          if (matchingUsers.empty) {
            console.warn(`${email} adresine sahip kullanıcı bulunamadı.`);
            continue;
          }
          
          matchingUsers.forEach(userDoc => {
            const userId = userDoc.id;
            const userMessageRef = doc(db, `users/${userId}/messages`, messageId);
            
            batch.set(userMessageRef, {
              subject,
              message,
              sentAt,
              isRead: false,
              isAdminMessage: true
            });
          });
        }
        
        await batch.commit();
        return true;
      }
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
      throw error;
    }
  };
  
  // Referans istatistiklerini getir
  const getReferralStats = async () => {
    try {
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      
      const stats: any[] = [];
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        
        // Sadece gerekli alanları al
        stats.push({
          userId: doc.id,
          emailAddress: userData.emailAddress || null,
          referrals: userData.referrals || [],
          referralCount: userData.referralCount || 0,
          referralCode: userData.referralCode || null
        });
      });
      
      return stats;
    } catch (error) {
      console.error("Referans istatistikleri alınırken hata:", error);
      throw error;
    }
  };

  return {
    updateUserBalance,
    sendMessage,
    getReferralStats
  };
}
