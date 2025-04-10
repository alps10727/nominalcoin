
/**
 * Firebase işlemlerini izlemek için yardımcı debugger
 */
import { db } from "@/config/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { debugLog } from "@/utils/debugUtils";

/**
 * Firestore'dan kullanıcı verisini alıp debug çıktısı göster
 */
export async function debugCheckUserData(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      debugLog("firebaseDebugger", `Kullanıcı bulunamadı: ${userId}`);
      return;
    }
    
    const userData = userDoc.data();
    debugLog("firebaseDebugger", `Kullanıcı verisi:`, {
      userId,
      referralCode: userData.referralCode,
      referralCount: userData.referralCount || 0,
      referrals: userData.referrals || [],
      referredBy: userData.referredBy || null,
      miningRate: userData.miningRate
    });
    
    // Eğer bu kullanıcı başka birisi tarafından davet edildiyse, davet eden kullanıcının verilerine de bak
    if (userData.referredBy) {
      debugLog("firebaseDebugger", `Şu kullanıcı tarafından davet edilmiş: ${userData.referredBy}`);
      await debugCheckUserData(userData.referredBy);
    }
    
    // Eğer kullanıcının davet ettiği kişiler varsa onları da göster
    if (userData.referrals && Array.isArray(userData.referrals) && userData.referrals.length > 0) {
      debugLog("firebaseDebugger", `${userData.referrals.length} kişi davet edilmiş:`, userData.referrals);
    }
    
  } catch (error) {
    debugLog("firebaseDebugger", "Veri kontrol hatası:", error);
  }
}

/**
 * Referans kodu ile kullanıcı ara ve debug çıktısı göster
 */
export async function debugFindUserByReferralCode(referralCode: string): Promise<void> {
  try {
    debugLog("firebaseDebugger", `Referans kodu ile kullanıcı aranıyor: ${referralCode}`);
    
    // Firestore'da referralCode alanına göre sorgula
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("referralCode", "==", referralCode));
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      debugLog("firebaseDebugger", `Referans kodu ile kullanıcı bulunamadı: ${referralCode}`);
      return;
    }
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      debugLog("firebaseDebugger", `Referans kodu ile kullanıcı bulundu:`, {
        userId: doc.id,
        referralCode: userData.referralCode,
        referralCount: userData.referralCount || 0
      });
    });
    
  } catch (error) {
    debugLog("firebaseDebugger", "Referans kodu ile arama hatası:", error);
  }
}
