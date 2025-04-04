
import { QueryDocumentSnapshot } from "firebase/firestore";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  pageSize: number;
}

export interface PaginationControls {
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  loadMore: () => Promise<void>;
}

export interface PaginatedData<T> {
  items: T[];
  lastDoc: QueryDocumentSnapshot | null;
  hasMore: boolean;
  loading: boolean;
  error: Error | null;
}
