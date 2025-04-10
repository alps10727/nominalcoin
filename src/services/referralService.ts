
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc, arrayUnion, increment } from "firebase/firestore";
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
    // Not: Bu basit bir implementasyon, büyük veritabanlarında daha gelişmiş bir sorgu gerekebilir
    
    const userRef = doc(db, "users", referralCode);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Doküman varsa, kullanıcı ID'sini döndür
      return [userDoc.id];
    }
    
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
