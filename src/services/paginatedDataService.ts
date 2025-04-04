
import { db } from "@/config/firebase";
import { 
  collection, 
  query, 
  getDocs, 
  limit, 
  startAfter, 
  orderBy,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { toast } from "sonner";

export interface PaginationResult<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

/**
 * Firestore'dan sayfalandırılmış veri çekme
 * @param collectionName Koleksiyon adı
 * @param pageSize Sayfa başına öğe sayısı
 * @param startAfterDoc Başlangıç belgesi (ilk sayfa için null)
 * @param orderByField Sıralama alanı
 * @param direction Sıralama yönü
 */
export async function fetchPaginatedData<T>(
  collectionName: string,
  pageSize: number = 10,
  startAfterDoc: QueryDocumentSnapshot | null = null,
  orderByField: string = "lastSaved",
  direction: 'asc' | 'desc' = 'desc'
): Promise<PaginationResult<T>> {
  try {
    debugLog("paginatedDataService", `${collectionName} koleksiyonundan sayfalandırılmış veri çekiliyor`, {
      pageSize,
      orderByField,
      direction,
      isNextPage: !!startAfterDoc
    });

    // Sorgu oluştur
    let dataQuery = query(
      collection(db, collectionName),
      orderBy(orderByField, direction),
      limit(pageSize + 1) // Bir sonraki sayfanın varlığını kontrol etmek için bir fazla öğe iste
    );

    // Eğer başlangıç belgesi verilmişse (sonraki sayfa), sorguyu güncelle
    if (startAfterDoc) {
      dataQuery = query(
        collection(db, collectionName),
        orderBy(orderByField, direction),
        startAfter(startAfterDoc),
        limit(pageSize + 1)
      );
    }

    // Sorguyu çalıştır
    const querySnapshot = await getDocs(dataQuery);
    
    // Sonuçları işle
    const items: T[] = [];
    let lastVisible: QueryDocumentSnapshot | null = null;
    let hasMore = false;

    // İstenen sayfa boyutundan fazla sonuç geldi mi kontrol et (bir sonraki sayfa var demektir)
    if (querySnapshot.docs.length > pageSize) {
      hasMore = true;
      // Son öğeyi listeden çıkar (bir sonraki sayfa için)
      querySnapshot.docs.pop();
    }

    // Sonuçları doldur
    querySnapshot.docs.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as T);
      lastVisible = doc; // Son görünen belgeyi takip et (sonraki sayfa için)
    });

    debugLog("paginatedDataService", `${items.length} öğe başarıyla yüklendi, daha fazla veri var mı: ${hasMore}`);
    
    return {
      items,
      lastDoc: lastVisible,
      hasMore
    };
  } catch (err) {
    errorLog("paginatedDataService", `${collectionName} verileri yüklenirken hata:`, err);
    
    // Çevrimdışı durumu kontrol et
    if ((err as any)?.code === 'unavailable' || (err as Error).message.includes('zaman aşımı')) {
      toast.warning("Sunucuya bağlanılamadı, çevrimdışı moddasınız.");
    } else {
      toast.error("Veri yüklenirken bir hata oluştu");
    }

    return {
      items: [],
      lastDoc: null,
      hasMore: false
    };
  }
}
