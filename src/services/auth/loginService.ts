
interface AuthResponse {
  user: any | null;
  error?: Error;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    console.log("Mock login for:", email);
    
    // Mock successful login
    const mockUser = {
      uid: "user123",
      email
    };
    
    return { user: mockUser };
  } catch (error) {
    console.error("Login error:", error);
    return { user: null, error: error as Error };
  }
}
