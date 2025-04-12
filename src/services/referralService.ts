
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, query, updateDoc, arrayUnion, increment, where, setDoc, Timestamp } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";
import { toast } from "sonner";
import { calculateMiningRate } from "@/utils/miningCalculator";
import { prepareReferralCodeForStorage } from "@/utils/referralUtils";

/**
 * Referans kodu ile kullanıcı bul - Toleranslı hale getirildi
 * Büyük/küçük harf farkına duyarlı değil
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    // Boş referans kodu için erken dön
    if (!referralCode) {
      debugLog("referralService", "Boş referans kodu, arama yapılmadı");
      return [];
    }
    
    // Kodu standartlaştır (boşlukları temizle, büyük harfe çevir ve tireleri kaldır)
    const storageCode = prepareReferralCodeForStorage(referralCode);
    
    debugLog("referralService", "Referans kodu ile kullanıcı aranıyor:", storageCode);
    
    // Firestore'da referralCode alanı ile eşleşen kullanıcıları ara
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", storageCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds: string[] = [];
      querySnapshot.forEach((doc) => {
        userIds.push(doc.id);
      });
      
      debugLog("referralService", `${userIds.length} kullanıcı bulundu referral kodu ile:`, storageCode);
      return userIds;
    }
    
    debugLog("referralService", "Referans kodu ile kullanıcı bulunamadı:", storageCode);
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
    const transactionsRef = collection(db, "referralTransactions");
    const q = query(
      transactionsRef, 
      where("referrerId", "==", referrerId), 
      where("referredId", "==", newUserId)
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
        referralCount: updatedReferralCount,
        // Her başarılı referans için sabit bir değer ekle (0.5)
        miningRate: increment(0.5)
      });
      
      debugLog("referralService", `Referral sayısı güncellendi: ${updatedReferralCount}, Mining rate +0.5 artırıldı`, { referrerId });
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
    
    // Ödülü kaydet (referralTransactions tablosuna - istek üzerine değiştirildi)
    const transactionId = `refbonus_${referrerId}_${newUserId}_${Date.now()}`;
    await setDoc(doc(db, "referralTransactions", transactionId), {
      referrerId: referrerId,
      referredId: newUserId,
      bonus: 0.5,
      bonusAmount: 0.5, // Yeni alan - geriye dönük uyumluluk için
      timestamp: Timestamp.now(),
      type: "referral_bonus",
      bonusLevel: "direct",
      bonusRate: rewardRate,
      miningRateIncrease: 0.5,
      description: "Doğrudan referans ödülü",
      status: "completed" // Yeni alan - işlem durumu
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
