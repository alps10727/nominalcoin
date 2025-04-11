
import { db } from "@/config/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/types/storage";
import { updateReferrerInfo } from "./referralService";

/**
 * Kullanıcının tüm üst referans veren kullanıcılarını bulur
 * A→B→C zincirinde, C kullanıcısı için [B, A] listesi döndürür
 */
export async function getAllReferrers(userId: string, maxLevels = 3): Promise<string[]> {
  try {
    if (!userId) {
      debugLog("multiLevelReferralService", "Geçersiz kullanıcı ID");
      return [];
    }
    
    const referrers: string[] = [];
    let currentUserId = userId;
    let level = 0;
    
    // Zincirleme referansları takip et (maksimum seviyeye kadar)
    while (currentUserId && level < maxLevels) {
      // Kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      
      if (!userDoc.exists()) {
        debugLog("multiLevelReferralService", `Kullanıcı bulunamadı: ${currentUserId}`);
        break;
      }
      
      const userData = userDoc.data() as UserData;
      
      // Referans veren kullanıcı var mı kontrol et
      if (userData.referredBy) {
        referrers.push(userData.referredBy);
        currentUserId = userData.referredBy;
        level++;
      } else {
        // Referans veren kullanıcı yoksa döngüyü sonlandır
        break;
      }
    }
    
    debugLog("multiLevelReferralService", `${userId} için referans verenler:`, referrers);
    return referrers;
  } catch (error) {
    errorLog("multiLevelReferralService", "Referans zincirleri alınırken hata:", error);
    return [];
  }
}

/**
 * Bu referans için daha önce ödül verilip verilmediğini kontrol et
 */
export async function hasExistingReferralBonus(referrerId: string, newUserId: string): Promise<boolean> {
  try {
    // Transactions tablosunda arama yap
    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef, 
      where("userId", "==", referrerId),
      where("referredUserId", "==", newUserId),
      where("isReferralBonus", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    errorLog("multiLevelReferralService", "Referans ödül kontrolünde hata:", error);
    return false; // Hata durumunda false dön, böylece ödül işlemi devam edebilir
  }
}

/**
 * Yeni bir kullanıcı kaydolduğunda tüm üst referans zincirine ödül verir
 */
export async function rewardMultiLevelReferrers(newUserId: string, directReferrerId: string): Promise<void> {
  try {
    if (!newUserId || !directReferrerId) {
      debugLog("multiLevelReferralService", "Geçersiz kullanıcı veya referans ID'si");
      return;
    }
    
    // Önce doğrudan referans veren kullanıcıya ödül verip vermemeyi kontrol et
    const hasDirectBonus = await hasExistingReferralBonus(directReferrerId, newUserId);
    if (!hasDirectBonus) {
      // Daha önce ödül verilmemişse, doğrudan referans veren kullanıcıya ödül ver
      await updateReferrerInfo(directReferrerId, newUserId);
    } else {
      debugLog("multiLevelReferralService", "Doğrudan referans için zaten ödül verilmiş:", {
        referrerId: directReferrerId,
        newUserId
      });
    }
    
    // Sonra üst seviye referansları bul (doğrudan referans verenin referans verenleri)
    const upperReferrers = await getAllReferrers(directReferrerId);
    
    // Farklı komisyon oranları ile üst seviye referanslara ödül ver
    for (let i = 0; i < upperReferrers.length; i++) {
      const referrerId = upperReferrers[i];
      
      // Önce bu referans için daha önce ödül verilmiş mi kontrol et
      const hasBonus = await hasExistingReferralBonus(referrerId, newUserId);
      if (hasBonus) {
        debugLog("multiLevelReferralService", "Bu üst seviye referans için zaten ödül verilmiş:", {
          referrerId,
          newUserId
        });
        continue; // Sonraki referrer'a geç
      }
      
      // İlk seviye için tam ödül zaten verildi, burada ikinci seviye ve sonrası için daha düşük oranlar
      const isSecondLevel = i === 0; // doğrudan referans verenin referans vereni
      const isThirdLevel = i === 1; // 3. seviye referans
      
      // Seviyeye göre farklı ödüller ver
      if (isSecondLevel) {
        // İkinci seviye için ödül (örneğin: %50 oranında)
        await updateReferrerInfo(referrerId, newUserId, 0.5);
      } else if (isThirdLevel) {
        // Üçüncü seviye için ödül (örneğin: %25 oranında)
        await updateReferrerInfo(referrerId, newUserId, 0.25);
      }
    }
  } catch (error) {
    errorLog("multiLevelReferralService", "Çok seviyeli referans ödüllerinde hata:", error);
  }
}

/**
 * Kullanıcının referans geçmişini gösterir - işlem kayıtlarından
 * @param userId Kullanıcı ID
 */
export async function getUserReferralTransactions(userId: string): Promise<any[]> {
  try {
    if (!userId) return [];
    
    // Kullanıcının referans işlemleri
    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userId),
      where("isReferralBonus", "==", true)
    );
    
    const querySnapshot = await getDocs(q);
    const transactions: any[] = [];
    
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return transactions;
  } catch (error) {
    errorLog("multiLevelReferralService", "Referans işlemlerini alma hatası:", error);
    return [];
  }
}
