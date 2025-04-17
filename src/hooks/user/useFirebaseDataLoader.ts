
import { UserData } from "@/types/storage";
import { useSupabaseLoader } from "./useSupabaseLoader";
import { useSupabaseDataMerger } from "./useSupabaseDataMerger";
import { handleSupabaseConnectionError } from "@/utils/supabaseErrorHandler";

export function useFirebaseDataLoader() {
  const { loadSupabaseUserData } = useSupabaseLoader();
  const { mergeUserData } = useSupabaseDataMerger();

  return {
    loadFirebaseUserData: loadSupabaseUserData, // For backward compatibility
    handleFirebaseError: handleSupabaseConnectionError, // For backward compatibility
    mergeUserData
  };
}
