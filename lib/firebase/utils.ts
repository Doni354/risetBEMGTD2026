import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  DocumentData,
} from 'firebase/firestore';
import { db } from './config';

/**
 * COST OPTIMIZATION: Batch operations to reduce Firestore reads/writes
 * Spark Plan: 50K reads/day, 20K writes/day
 */

export async function getDocument<T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  } catch (error) {
    console.error(`[Firebase] Error getting document:`, error);
    return null;
  }
}

export async function getDocuments<T extends DocumentData>(
  collectionName: string,
  queryConstraints: any[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as T));
  } catch (error) {
    console.error(`[Firebase] Error getting documents:`, error);
    return [];
  }
}

export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error(`[Firebase] Error setting document:`, error);
    return false;
  }
}

export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  docId: string,
  data: T
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error(`[Firebase] Error updating document:`, error);
    return false;
  }
}

/**
 * Get paginated documents (cost-efficient pagination)
 */
export async function getPaginatedDocuments<T extends DocumentData>(
  collectionName: string,
  pageSize: number = 10,
  queryConstraints: any[] = []
): Promise<{ documents: T[]; hasMore: boolean }> {
  try {
    // Add +1 to limit to determine if there are more documents
    const q = query(
      collection(db, collectionName),
      ...queryConstraints,
      limit(pageSize + 1)
    );

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs
      .slice(0, pageSize)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as T));

    const hasMore = querySnapshot.docs.length > pageSize;

    return { documents, hasMore };
  } catch (error) {
    console.error(`[Firebase] Error getting paginated documents:`, error);
    return { documents: [], hasMore: false };
  }
}
