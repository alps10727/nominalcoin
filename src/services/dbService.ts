
import { db } from "@/config/firebase";
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp,
  enableIndexedDbPersistence
} from "firebase/firestore";

// Offline çalışma için persistence etkinleştir
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore offline persistence etkinleştirildi");
    })
    .catch((err) => {
      console.error("Offline persistence hatası:", err);
    });
} catch (error) {
  console.error("Persistence hatası:", error);
}

/**
 * Firestore'dan belge yükleme
 */
export async function getDocument(collection: string, id: string): Promise<any | null> {
  try {
    console.log(`${collection}/${id} belgesi yükleniyor...`);
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(`${collection}/${id} belgesi başarıyla yüklendi`);
      return docSnap.data();
    }
    console.log(`${collection}/${id} belgesi bulunamadı`);
    return null;
  } catch (err) {
    console.error(`${collection}/${id} yükleme hatası:`, err);
    // Offline hatası için özel işleme
    if ((err as any)?.code === 'unavailable') {
      console.log("Cihaz çevrimdışı, offline mod etkinleştiriliyor");
      return null;
    }
    throw err;
  }
}

/**
 * Firestore'a belge kaydetme
 */
export async function saveDocument(collection: string, id: string, data: any, options = { merge: true }): Promise<void> {
  try {
    console.log(`${collection}/${id} belgesi kaydediliyor...`);
    
    // Son güncelleme zamanını ekle
    const dataWithTimestamp = {
      ...data,
      lastSaved: serverTimestamp(),
    };
    
    const docRef = doc(db, collection, id);
    await setDoc(docRef, dataWithTimestamp, options);
    console.log(`${collection}/${id} belgesi başarıyla kaydedildi`);
  } catch (err) {
    console.error(`${collection}/${id} kaydetme hatası:`, err);
    // Offline hatası için kullanıcıya anlamlı geri bildirim
    if ((err as any)?.code === 'unavailable') {
      console.log("Cihaz çevrimdışı, veriler daha sonra kaydedilecek");
    }
    throw err;
  }
}
