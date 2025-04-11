
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
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
 * Yeni bir kullanıcı kaydolduğunda tüm üst referans zincirine ödül verir
 */
export async function rewardMultiLevelReferrers(newUserId: string, directReferrerId: string): Promise<void> {
  try {
    if (!newUserId || !directReferrerId) {
      debugLog("multiLevelReferralService", "Geçersiz kullanıcı veya referans ID'si");
      return;
    }
    
    // Önce doğrudan referans veren kullanıcıya ödül ver (mevcut sistem)
    await updateReferrerInfo(directReferrerId, newUserId);
    
    // Sonra üst seviye referansları bul (doğrudan referans verenin referans verenleri)
    const upperReferrers = await getAllReferrers(directReferrerId);
    
    // Farklı komisyon oranları ile üst seviye referanslara ödül ver
    for (let i = 0; i < upperReferrers.length; i++) {
      const referrerId = upperReferrers[i];
      
      // İlk seviye için tam ödül zaten verildi, burada ikinci seviye ve sonrası için daha düşük oranlar
      const isSecondLevel = i === 0; // doğrudan referans verenin referans vereni
      const isThirdLevel = i === 1; // 3. seviye referans
      
      // Seviyeye göre farklı ödüller ver
      if (isSecondLevel) {
        // İkinci seviye için ödül (örneğin: %50 oranında)
        await updateMultiLevelReferrerInfo(referrerId, newUserId, 0.5);
      } else if (isThirdLevel) {
        // Üçüncü seviye için ödül (örneğin: %25 oranında)
        await updateMultiLevelReferrerInfo(referrerId, newUserId, 0.25);
      }
      // Diğer seviyeler için farklı oranlar ekleyebilirsiniz
    }
  } catch (error) {
    errorLog("multiLevelReferralService", "Çok seviyeli referans ödüllerinde hata:", error);
  }
}

/**
 * Belirli bir oran ile referans veren kullanıcıyı ödüllendirir
 */
async function updateMultiLevelReferrerInfo(
  referrerId: string, 
  newUserId: string, 
  rewardRate: number = 0.5
): Promise<void> {
  try {
    if (!referrerId || !newUserId) {
      return;
    }
    
    debugLog("multiLevelReferralService", `Üst seviye referans ödülü: ${referrerId}, oran: ${rewardRate}`);
    
    const userRef = doc(db, "users", referrerId);
    
    // Önce kullanıcı verilerini al
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return;
    }
    
    // Verilerle işlem yap, ancak doğrudan referanslara ekleme yapma
    // Bunun yerine alternatif bir liste tutabilirsiniz
    // Örneğin: indirectReferrals listesine ekleyebilirsiniz
  } catch (error) {
    errorLog("multiLevelReferralService", "Üst seviye referans güncellerken hata:", error);
  }
}

