import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";
import { UserData } from "@/types/storage";
import { runAtomicTransaction } from "@/services/db/transactionService";
import { saveUserData } from "@/utils/storageOperations";

/**
 * Yeni bir kullanıcı için benzersiz referans kodu oluşturur
 * @param userId Kullanıcı ID'si
 * @returns Benzersiz referans kodu
 */
export function generateReferralCode(userId: string): string {
  // Basit bir referans kodu oluşturma - kullanıcı ID'sinden ve zaman damgasından oluşan bir karışım
  const timestamp = Date.now().toString(36);
  const userIdPart = userId.substring(0, 5);
  const randomPart = Math.random().toString(36).substring(2, 5);
  
  return `${userIdPart}${randomPart}${timestamp.substring(timestamp.length - 3)}`.toUpperCase();
}

/**
 * Kullanıcının referans kodunu veya davet edilenlerini alır
 * @param userId Kullanıcı ID'si
 * @returns Kullanıcının referral bilgileri
 */
export async function getUserReferralInfo(userId: string): Promise<{ 
  referralCode: string,
  referrals: string[],
  invitedBy: string | null
} | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        referralCode: userData.referralCode || "",
        referrals: userData.referrals || [],
        invitedBy: userData.invitedBy || null
      };
    }
    return null;
  } catch (error) {
    errorLog("referralService", "Error getting referral info:", error);
    return null;
  }
}

/**
 * Referans kodu ile kullanıcı bulur
 * @param referralCode Referans kodu
 * @returns Kullanıcı ID'si veya null
 */
export async function findUserByReferralCode(referralCode: string): Promise<string | null> {
  try {
    // Tüm kullanıcılar üzerinde sorgu yapmak yerine referansKodu alanını indeksleyerek arama yapmalıyız
    // Bu sorgu performansı artıracaktır
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", referralCode));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].id;
    }
    return null;
  } catch (error) {
    errorLog("referralService", "Error finding user by referral code:", error);
    return null;
  }
}

/**
 * Referans kodunu kullanarak davet eden kullanıcıyı belirler ve ödül verir
 * @param currentUserId Davet edilen kullanıcı ID'si
 * @param referralCode Referans kodu
 * @returns İşlem sonucu
 */
export async function applyReferralCode(currentUserId: string, referralCode: string): Promise<boolean> {
  try {
    debugLog("referralService", "Referans kodu uygulanıyor:", { currentUserId, referralCode });
    
    // Kullanıcının daha önce referral kullanıp kullanmadığını kontrol et
    const currentUserDoc = await getDoc(doc(db, "users", currentUserId));
    if (currentUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      if (currentUserData.invitedBy) {
        toast.error("Zaten bir referans kodu kullandınız.");
        return false;
      }
    }
    
    // Referral kodunu kullanan kullanıcıyı bul
    const inviterUserId = await findUserByReferralCode(referralCode);
    
    // Referral kodu geçersizse
    if (!inviterUserId) {
      toast.error("Geçersiz referans kodu.");
      return false;
    }
    
    // Kullanıcı kendisini referans edemez
    if (inviterUserId === currentUserId) {
      toast.error("Kendi referans kodunuzu kullanamazsınız.");
      return false;
    }

    // Atomik işlem olarak hem davet eden hem davet edilen kullanıcıyı güncelle
    await runAtomicTransaction(async (transaction) => {
      const inviterRef = doc(db, "users", inviterUserId);
      const currentUserRef = doc(db, "users", currentUserId);
      
      // Davetçi kullanıcı verisini al
      const inviterDoc = await transaction.get(inviterRef);
      const currentUserDoc = await transaction.get(currentUserRef);
      
      if (!inviterDoc.exists() || !currentUserDoc.exists()) {
        throw new Error("Kullanıcı bulunamadı.");
      }
      
      const inviterData = inviterDoc.data();
      const currentUserData = currentUserDoc.data();
      
      // Madencilik hızını artır (0.003 artış)
      const updatedMiningRate = (inviterData.miningRate || 0.003) + 0.003;
      
      // Davetçiyi güncelle
      transaction.update(inviterRef, {
        miningRate: updatedMiningRate,
        referrals: arrayUnion(currentUserId),
        referralCount: (inviterData.referralCount || 0) + 1
      });
      
      // Davet edilen kullanıcıyı güncelle
      transaction.update(currentUserRef, {
        invitedBy: inviterUserId,
        // Davet edilene de bonus ver (0.001 artış)
        miningRate: (currentUserData?.miningRate || 0.003) + 0.001
      });
      
      // Davetçi UI güncellemesi için yerel veriyi güncelle
      try {
        const localInviterData = {
          ...inviterData,
          miningRate: updatedMiningRate,
          referralCount: (inviterData.referralCount || 0) + 1,
          referrals: [...(inviterData.referrals || []), currentUserId]
        };
        saveUserData(localInviterData, inviterUserId);
      } catch (error) {
        console.error("Yerel veri güncelleme hatası:", error);
      }
    });

    toast.success("Referans kodu başarıyla uygulandı! Her ikiniz de bonus kazandınız.");
    return true;
  } catch (error) {
    errorLog("referralService", "Referans kodu uygulama hatası:", error);
    toast.error("Referans kodu uygulanırken bir hata oluştu.");
    return false;
  }
}

/**
 * Kullanıcı için referans kodunu başlatır veya yeniden oluşturur
 * @param userId Kullanıcı ID'si
 * @returns Yeni referans kodu
 */
export async function initializeReferralCode(userId: string): Promise<string | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // Zaten referans kodu varsa onu döndür
      if (userData.referralCode) {
        return userData.referralCode;
      }
      
      // Yeni referans kodu oluştur
      const referralCode = generateReferralCode(userId);
      
      // Veritabanına kaydet
      await updateDoc(doc(db, "users", userId), {
        referralCode: referralCode
      });
      
      return referralCode;
    }
    
    return null;
  } catch (error) {
    errorLog("referralService", "Referans kodu başlatma hatası:", error);
    return null;
  }
}

// Import eksik fonksiyonları
import { collection, query, getDocs, where } from "firebase/firestore";
