
export async function logoutUser(): Promise<void> {
  try {
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}
