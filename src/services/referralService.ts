
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, query, updateDoc, arrayUnion, increment, where } from "firebase/firestore";
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
 * Referans veren kullanıcının bilgilerini güncelle
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
      newUserId,
      rewardRate
    });
    
    const userRef = doc(db, "users", referrerId);
    
    // Önce kullanıcı verilerini al
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      errorLog("referralService", "Referans veren kullanıcı bulunamadı", { referrerId });
      throw new Error("Referans veren kullanıcı bulunamadı");
    }
    
    const userData = userDoc.data() as UserData;
    
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
    
    // Ödül oranı ile mining rate'i güncelle
    const newMiningRate = calculateMiningRate(updatedUserData) * rewardRate;
    
    // Mining rate'i güncelle
    await updateDoc(userRef, {
      miningRate: newMiningRate
    });
    
    debugLog("referralService", `Referans veren kullanıcının madencilik hızı güncellendi: ${newMiningRate}`, { 
      referrerId, 
      newRate: newMiningRate,
      rewardRate
    });
    
    // Rewardları oranında göster
    if (rewardRate === 1) {
      toast.success("Referans ödülü kazandınız! Madencilik hızınız artırıldı.");
    } else if (rewardRate > 0) {
      toast.success(`İkincil referans ödülü kazandınız! (${rewardRate * 100}%)`);
    }
    
    debugLog("referralService", "Referans veren kullanıcı bilgileri güncellendi");
  } catch (error) {
    errorLog("referralService", "Referans veren kullanıcı bilgilerini güncelleme hatası:", error);
    throw error;
  }
}
