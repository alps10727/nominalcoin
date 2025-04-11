
// Re-export from refactored modules to maintain backward compatibility
import { loadUserDataFromFirebase } from "./user/userDataLoaderService";
import { createDefaultUserData, validateUserData } from "./user/userDataValidator";

export { 
  loadUserDataFromFirebase,
  createDefaultUserData,
  validateUserData
};

// Re-export the UserData type for consumers of this module
export type { UserData } from "@/utils/storage";
