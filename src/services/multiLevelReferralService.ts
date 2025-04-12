
import { db } from "@/config/firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/types/storage";
import { updateReferrerInfo } from "./referralService";

/**
 * Kullanıcının doğrudan referans veren kullanıcısını bulur
 * @param userId Kullanıcı ID
 */
export async function getDirectReferrer(userId: string): Promise<string | null> {
  try {
    if (!userId) {
      debugLog("referralService", "Geçersiz kullanıcı ID");
      return null;
    }
    
    // Kullanıcı bilgilerini al
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (!userDoc.exists()) {
      debugLog("referralService", `Kullanıcı bulunamadı: ${userId}`);
      return null;
    }
    
    const userData = userDoc.data() as UserData;
    
    // Doğrudan referans veren kullanıcı ID'sini döndür
    return userData.referredBy || null;
  } catch (error) {
    errorLog("referralService", "Referans veren kullanıcı arama hatası:", error);
    return null;
  }
}

/**
 * Bu referans için daha önce ödül verilip verilmediğini kontrol et
 */
export async function hasExistingReferralBonus(referrerId: string, newUserId: string): Promise<boolean> {
  try {
    // referralTransactions tablosunda arama yap (yeni koleksiyon adı)
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(
      transactionsRef, 
      where("referrerId", "==", referrerId),
      where("referredId", "==", newUserId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    errorLog("referralService", "Referans ödül kontrolünde hata:", error);
    return false; // Hata durumunda false dön, böylece ödül işlemi devam edebilir
  }
}

/**
 * Yeni bir kullanıcı kaydolduğunda SADECE doğrudan referans veren kullanıcıya ödül verir
 * Önceki çok seviyeli (multi-level) ödül sistemi kaldırıldı
 * Küçük/büyük harf farkına duyarsız hale getirildi
 */
export async function rewardDirectReferrer(newUserId: string): Promise<void> {
  try {
    if (!newUserId) {
      debugLog("referralService", "Geçersiz kullanıcı ID'si");
      return;
    }
    
    // Doğrudan referans veren kullanıcıyı bul
    const directReferrerId = await getDirectReferrer(newUserId);
    
    if (!directReferrerId) {
      debugLog("referralService", "Bu kullanıcının referans veren kullanıcısı yok:", newUserId);
      return;
    }
    
    debugLog("referralService", `Doğrudan referans veren kullanıcı bulundu: ${directReferrerId}`);
    
    // Önce doğrudan referans veren kullanıcıya ödül verip vermemeyi kontrol et
    const hasBonus = await hasExistingReferralBonus(directReferrerId, newUserId);
    if (hasBonus) {
      debugLog("referralService", "Doğrudan referans için zaten ödül verilmiş:", {
        referrerId: directReferrerId,
        newUserId
      });
      return;
    }
    
    // Sadece doğrudan referans veren kullanıcıya ödül ver - tam ödül oranı (1.0)
    await updateReferrerInfo(directReferrerId, newUserId);
    
    debugLog("referralService", `Doğrudan referans veren kullanıcıya ödül verildi: ${directReferrerId}`);
  } catch (error) {
    errorLog("referralService", "Referans ödüllerinde hata:", error);
  }
}

/**
 * Kullanıcının referans geçmişini gösterir - işlem kayıtlarından
 * @param userId Kullanıcı ID
 */
export async function getUserReferralTransactions(userId: string): Promise<any[]> {
  try {
    if (!userId) return [];
    
    // Kullanıcının referans işlemleri - referralTransactions koleksiyonundan
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(
      transactionsRef,
      where("referrerId", "==", userId)
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
