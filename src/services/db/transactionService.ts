
import { 
  runTransaction,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Atomik işlemler için transaction API'si
 * Tutarlılık gerektiren işlemler için idealdir
 */
export async function runAtomicTransaction<T>(
  callback: (transaction: any) => Promise<T>
): Promise<T> {
  try {
    return await runTransaction(db, callback);
  } catch (error) {
    errorLog("dbService", "Transaction hatası:", error);
    throw error;
  }
}
