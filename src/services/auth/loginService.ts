
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/firebase";
import { debugLog, errorLog } from "@/utils/debugUtils";
import { AuthResponse } from "./types";

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    debugLog("authService", "User logged in successfully", { email });
    return { user: userCredential.user };
  } catch (error) {
    errorLog("authService", "Login error:", error);
    return { user: null, error: error as Error };
  }
}
