
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit, 
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  OrderByDirection,
  Query
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

export interface PaginationResult<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
}

export async function fetchPaginatedData<T>(
  collectionName: string,
  pageSize: number,
  startAfterDoc: QueryDocumentSnapshot | null = null,
  orderByField: string = "createdAt",
  direction: OrderByDirection = "desc"
): Promise<PaginationResult<T>> {
  try {
    debugLog("paginatedDataService", `Fetching ${pageSize} items from ${collectionName}`);

    const collectionRef = collection(db, collectionName);
    let q: Query<DocumentData>;
    
    if (startAfterDoc) {
      q = query(
        collectionRef,
        orderBy(orderByField, direction),
        startAfter(startAfterDoc),
        limit(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        orderBy(orderByField, direction),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const items: T[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as T);
    });

    const lastDoc = querySnapshot.docs.length > 0 
      ? querySnapshot.docs[querySnapshot.docs.length - 1] 
      : null;
    
    // Check if there are more items
    let hasMore = false;
    if (lastDoc) {
      const nextQuery = query(
        collectionRef,
        orderBy(orderByField, direction),
        startAfter(lastDoc),
        limit(1)
      );
      const nextSnapshot = await getDocs(nextQuery);
      hasMore = !nextSnapshot.empty;
    }

    debugLog(
      "paginatedDataService", 
      `Fetched ${items.length} items, hasMore: ${hasMore}`
    );
    
    return { items, lastDoc, hasMore };
  } catch (error) {
    errorLog("paginatedDataService", "Error fetching paginated data:", error);
    return { items: [], lastDoc: null, hasMore: false };
  }
}
