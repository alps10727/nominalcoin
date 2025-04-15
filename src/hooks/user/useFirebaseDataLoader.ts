
import { UserData } from "@/utils/storage";
import { useFirebaseLoader } from "./useFirebaseLoader";
import { useFirebaseDataMerger } from "./useFirebaseDataMerger";
import { handleFirebaseConnectionError } from "@/utils/firebaseErrorHandler";

export function useFirebaseDataLoader() {
  const { loadFirebaseUserData } = useFirebaseLoader();
  const { mergeUserData } = useFirebaseDataMerger();

  return {
    loadFirebaseUserData,
    handleFirebaseError: handleFirebaseConnectionError,
    mergeUserData
  };
}
