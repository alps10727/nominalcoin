
import { getDocument } from "../db/document";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Helper function to get Firebase document with strict timeout
 */
export async function getDocumentWithTimeout(collection: string, id: string, timeoutMs: number): Promise<any> {
  return new Promise((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      reject(new Error(`Firebase veri yükleme zaman aşımı (${timeoutMs}ms)`));
    }, timeoutMs);
    
    // Try to get document
    getDocument(collection, id)
      .then(data => {
        clearTimeout(timeoutId);
        resolve(data);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        reject(err);
      });
  });
}
