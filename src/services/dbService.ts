
import { db } from "@/config/firebase";
import { collection, doc, getDoc, setDoc, DocumentData, deleteDoc } from "firebase/firestore";
import { debugLog, errorLog } from "@/utils/debugUtils";

/**
 * Get a document from a collection
 * @param collectionName Collection name
 * @param documentId Document ID
 * @returns Document data or null if not found
 */
export async function getDocument(collectionName: string, documentId: string): Promise<DocumentData | null> {
  try {
    debugLog("dbService", `Getting document: ${collectionName}/${documentId}`);
    
    const documentRef = doc(db, collectionName, documentId);
    const documentSnap = await getDoc(documentRef);
    
    if (documentSnap.exists()) {
      debugLog("dbService", `Document found: ${collectionName}/${documentId}`);
      return documentSnap.data();
    } else {
      debugLog("dbService", `Document not found: ${collectionName}/${documentId}`);
      return null;
    }
  } catch (error) {
    errorLog("dbService", `Error getting document: ${collectionName}/${documentId}`, error);
    throw error;
  }
}

/**
 * Save a document to a collection
 * @param collectionName Collection name
 * @param documentId Document ID
 * @param data Document data
 * @param merge Whether to merge with existing data (default: false)
 */
export async function saveDocument(collectionName: string, documentId: string, data: DocumentData, merge: boolean = false): Promise<void> {
  try {
    debugLog("dbService", `Saving document: ${collectionName}/${documentId}`, { merge });
    
    const documentRef = doc(db, collectionName, documentId);
    await setDoc(documentRef, data, { merge });
    
    debugLog("dbService", `Document saved: ${collectionName}/${documentId}`);
  } catch (error) {
    errorLog("dbService", `Error saving document: ${collectionName}/${documentId}`, error);
    throw error;
  }
}

/**
 * Delete a document from a collection
 * @param collectionName Collection name
 * @param documentId Document ID
 */
export async function deleteDocument(collectionName: string, documentId: string): Promise<void> {
  try {
    debugLog("dbService", `Deleting document: ${collectionName}/${documentId}`);
    
    const documentRef = doc(db, collectionName, documentId);
    await deleteDoc(documentRef);
    
    debugLog("dbService", `Document deleted: ${collectionName}/${documentId}`);
  } catch (error) {
    errorLog("dbService", `Error deleting document: ${collectionName}/${documentId}`, error);
    throw error;
  }
}

/**
 * Get a reference to a collection
 * @param collectionName Collection name
 * @returns Collection reference
 */
export function getCollectionRef(collectionName: string) {
  return collection(db, collectionName);
}
