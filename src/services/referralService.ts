
import { db } from "@/config/firebase";
import { collection, doc, getDoc, getDocs, query, updateDoc, arrayUnion, increment, where } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { UserData } from "@/utils/storage";
import { toast } from "sonner";
import { calculateMiningRate } from "@/utils/miningCalculator";

/**
 * Referans kodu ile kullanıcı bul
 */
export async function findUsersByReferralCode(referralCode: string): Promise<string[]> {
  try {
    debugLog("referralService", "Referans kodu ile kullanıcı aranıyor:", referralCode);
    
    // Firestore'da referralCode alanı ile eşleşen kullanıcıları ara
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", referralCode));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userIds: string[] = [];
      querySnapshot.forEach((doc) => {
        userIds.push(doc.id);
      });
      
      debugLog("referralService", `${userIds.length} kullanıcı bulundu referral kodu ile:`, referralCode);
      return userIds;
    }
    
    debugLog("referralService", "Referans kodu ile kullanıcı bulunamadı:", referralCode);
    return [];
  } catch (error) {
    errorLog("referralService", "Referans kodu ile kullanıcı arama hatası:", error);
    return [];
  }
}

/**
 * Referans veren kullanıcının bilgilerini güncelle
 */
export async function updateReferrerInfo(referrerId: string, newUserId: string): Promise<void> {
  try {
    debugLog("referralService", "Referans veren kullanıcı bilgileri güncelleniyor");
    
    const userRef = doc(db, "users", referrerId);
    
    // Önce kullanıcı verilerini al
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      throw new Error("Referans veren kullanıcı bulunamadı");
    }
    
    const userData = userDoc.data() as UserData;
    
    // Referrals dizisine yeni kullanıcıyı ekle ve referralCount'u arttır
    const updatedReferralCount = (userData.referralCount || 0) + 1;
    
    await updateDoc(userRef, {
      referrals: arrayUnion(newUserId),
      referralCount: updatedReferralCount
    });
    
    // Yeni mining rate hesapla
    const updatedUserData = {
      ...userData,
      referralCount: updatedReferralCount
    };
    
    const newMiningRate = calculateMiningRate(updatedUserData);
    
    // Mining rate'i güncelle
    await updateDoc(userRef, {
      miningRate: newMiningRate
    });
    
    toast.success("Referans ödülü kazandınız! Madencilik hızınız artırıldı.");
    debugLog("referralService", `Referans veren kullanıcının madencilik hızı güncellendi: ${newMiningRate}`);
    
    debugLog("referralService", "Referans veren kullanıcı bilgileri güncellendi");
  } catch (error) {
    errorLog("referralService", "Referans veren kullanıcı bilgilerini güncelleme hatası:", error);
    throw error;
  }
}
