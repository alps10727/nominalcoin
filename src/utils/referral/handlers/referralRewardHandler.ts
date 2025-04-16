
import { doc, updateDoc, getDoc, increment, DocumentData, arrayUnion, runTransaction } from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { REFERRAL_BONUS_RATE } from "../bonusCalculator";

/**
 * Referans eden kullanıcının istatistiklerini günceller ve ödül verir
 * @param ownerId Referans kodunun sahibi
 * @param newUserId Yeni kullanıcı ID'si
 * @param userData Referans eden kullanıcının mevcut verileri
 * @returns İşlem başarılı oldu mu?
 */
export async function updateReferrerStats(
  ownerId: string,
  newUserId: string,
  userData?: DocumentData
): Promise<boolean> {
  try {
    // Giriş parametrelerini doğrula
    if (!ownerId || !newUserId) {
      errorLog("referralRewardHandler", "Geçersiz parametreler", { ownerId, newUserId });
      return false;
    }
    
    debugLog("referralRewardHandler", "Referans eden kullanıcı istatistikleri güncelleniyor", { ownerId, newUserId });
    
    // Referans eden kullanıcının belgesine referans
    const userRef = doc(db, "users", ownerId);
    
    // Transaction kullanarak tutarlı güncelleme yap
    return await runTransaction(db, async (transaction) => {
      // Güncel verileri al
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        errorLog("referralRewardHandler", "Referans eden kullanıcı belgesi bulunamadı", { ownerId });
        return false;
      }
      
      const currentData = userDoc.data();
      
      // Geçerli değerleri al veya varsayılanları kullan
      const currentReferrals = Array.isArray(currentData.referrals) ? currentData.referrals : [];
      const currentMiningRate = currentData.miningRate || 0.003;
      const currentReferralCount = currentData.referralCount || 0;
      
      // Kullanıcı zaten referanslar listesindeyse tekrar ekleme
      if (currentReferrals.includes(newUserId)) {
        debugLog("referralRewardHandler", "Kullanıcı zaten referanslar listesinde, atlanıyor", { newUserId });
        return true; // Zaten işlenmiş
      }
      
      // Referans bonusu ile yeni madencilik oranı hesapla (4 ondalık basamağa yuvarla)
      const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4));
      
      debugLog("referralRewardHandler", "Referans eden kullanıcı belgesi güncelleniyor", {
        referralCount: currentReferralCount + 1,
        oldMiningRate: currentMiningRate,
        newMiningRate: newMiningRate
      });
      
      // Kullanıcı belgesini güncelle
      transaction.update(userRef, {
        referralCount: increment(1),
        referrals: arrayUnion(newUserId),
        miningRate: newMiningRate,
        lastReferral: new Date() // Son referans zamanı ekle
      });
      
      debugLog("referralRewardHandler", "Referans eden kullanıcı istatistikleri başarıyla güncellendi", { 
        ownerId, 
        newMiningRate, 
        referralCount: currentReferralCount + 1 
      });
      
      return true;
    });
  } catch (error) {
    errorLog("referralRewardHandler", "Referans eden kullanıcı istatistikleri güncelleme hatası:", error);
    
    // Bir kez daha dene
    try {
      debugLog("referralRewardHandler", "Güncelleme yeniden deneniyor...");
      const userRef = doc(db, "users", ownerId);
      
      // Güncel verileri al
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return false;
      }
      
      const currentData = userDoc.data();
      const currentReferrals = Array.isArray(currentData.referrals) ? currentData.referrals : [];
      
      // Kullanıcı zaten referanslar listesindeyse tekrar ekleme
      if (currentReferrals.includes(newUserId)) {
        return true; // Zaten işlenmiş
      }
      
      // Referans bonusu ile yeni madencilik oranı hesapla
      const currentMiningRate = currentData.miningRate || 0.003;
      const newMiningRate = parseFloat((currentMiningRate + REFERRAL_BONUS_RATE).toFixed(4));
      
      // Kullanıcı belgesini güncelle
      await updateDoc(userRef, {
        referralCount: increment(1),
        referrals: arrayUnion(newUserId),
        miningRate: newMiningRate,
        lastReferral: new Date()
      });
      
      return true;
    } catch (retryError) {
      errorLog("referralRewardHandler", "Yeniden deneme başarısız:", retryError);
      return false;
    }
  }
}
