import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, query, updateDoc, arrayUnion, increment, where, setDoc, Timestamp } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";
import { toast } from "sonner";
import { calculateMiningRate } from "@/utils/miningCalculator";

/**
 * Referans kodu ile kullanıcı bul - Toleranslı hale getirildi
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    // Boş referans kodu için erken dön
    if (!referralCode) {
      debugLog("referralService", "Boş referans kodu, arama yapılmadı");
      return [];
    }
    
    // Kodu standartlaştır (boşlukları temizle ve büyük harfe çevir)
    const standardizedCode = referralCode.trim().toUpperCase();
    
    debugLog("referralService", "Referans kodu ile kullanıcı aranıyor:", standardizedCode);
    
    // Firestore'da referralCode alanı ile eşleşen kullanıcıları ara
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", standardizedCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds: string[] = [];
      querySnapshot.forEach((doc) => {
        userIds.push(doc.id);
      });
      
      debugLog("referralService", `${userIds.length} kullanıcı bulundu referral kodu ile:`, standardizedCode);
      return userIds;
    }
    
    debugLog("referralService", "Referans kodu ile kullanıcı bulunamadı:", standardizedCode);
    return [];
  } catch (error) {
    errorLog("referralService", "Referans kodu ile kullanıcı arama hatası:", error);
    return [];
  }
}

/**
 * Referans veren kullanıcının bilgilerini güncelle ve ödül ver
 * @param referrerId Referans veren kullanıcının ID'si
 * @param newUserId Yeni kaydolan kullanıcının ID'si
 * @param rewardRate Ödül oranı (varsayılan: 1 - tam ödül)
 */
export async function updateReferrerInfo(
  referrerId: string, 
  newUserId: string, 
  rewardRate: number = 1
): Promise<void> {
  try {
    if (!referrerId || !newUserId) {
      debugLog("referralService", "Geçersiz referrer veya user ID, güncelleme yapılmadı", { referrerId, newUserId });
      return;
    }
    
    debugLog("referralService", "Referans veren kullanıcı bilgileri güncelleniyor", { 
      referrerId, 
      newUserId
    });
    
    const userRef = doc(db, "users", referrerId);
    
    // Önce kullanıcı verilerini al
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      errorLog("referralService", "Referans veren kullanıcı bulunamadı", { referrerId });
      throw new Error("Referans veren kullanıcı bulunamadı");
    }
    
    const userData = userDoc.data() as UserData;
    
    // Önce kontrol et - bu kullanıcıya daha önce bu referans için ödül verilmiş mi?
    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef, 
      where("userId", "==", referrerId), 
      where("referredUserId", "==", newUserId), 
      where("isReferralBonus", "==", true)
    );
    const existingBonuses = await getDocs(q);
    
    if (!existingBonuses.empty) {
      debugLog("referralService", "Bu referans için zaten ödül verilmiş, işlem atlanıyor", { 
        referrerId, 
        newUserId 
      });
      return; // İşlemi durdur, tekrarlı ödül verme
    }
    
    // Referrals dizisine yeni kullanıcıyı ekle ve referralCount'u arttır
    const updatedReferralCount = (userData.referralCount || 0) + 1;
    
    // Aynı kullanıcıyı birden fazla kez eklememek için kontrol
    const currentReferrals = userData.referrals || [];
    if (!currentReferrals.includes(newUserId)) {
      await updateDoc(userRef, {
        referrals: arrayUnion(newUserId),
        referralCount: updatedReferralCount
      });
      
      debugLog("referralService", `Referral sayısı güncellendi: ${updatedReferralCount}`, { referrerId });
    } else {
      debugLog("referralService", "Bu kullanıcı zaten referral listesinde var, güncelleme yapılmadı", { 
        referrerId, 
        newUserId 
      });
      return;
    }
    
    // Yeni mining rate hesapla
    const updatedUserData = {
      ...userData,
      referralCount: updatedReferralCount
    };
    
    // Mining rate'i güncelle
    const newMiningRate = calculateMiningRate(updatedUserData);
    
    await updateDoc(userRef, {
      miningRate: newMiningRate
    });
    
    debugLog("referralService", `Referans veren kullanıcının madencilik hızı güncellendi: ${newMiningRate}`, { 
      referrerId, 
      newRate: newMiningRate
    });
    
    // Ödülü kaydet (transactions tablosuna)
    const transactionId = `refbonus_${referrerId}_${newUserId}_${Date.now()}`;
    await setDoc(doc(db, "transactions", transactionId), {
      userId: referrerId,
      referredUserId: newUserId,
      type: "referral_bonus",
      isReferralBonus: true,
      bonusLevel: "direct",
      bonusRate: 1,
      miningRateIncrease: newMiningRate - (userData.miningRate || 0),
      timestamp: Timestamp.now(),
      description: "Doğrudan referans ödülü"
    });
    
    debugLog("referralService", "Referral bonus işlemi kaydedildi", { transactionId });
    
    // Ödül bildirimini göster
    toast.success("Referans ödülü kazandınız! Madencilik hızınız artırıldı.");
    
    debugLog("referralService", "Referans veren kullanıcı bilgileri güncellendi");
  } catch (error) {
    errorLog("referralService", "Referans veren kullanıcı bilgilerini güncelleme hatası:", error);
    throw error;
  }
}
