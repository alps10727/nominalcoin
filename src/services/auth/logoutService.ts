
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    debugLog("authService", "User logged out successfully");
  } catch (error) {
    errorLog("authService", "Logout error:", error);
    throw error;
  }
}
