
/**
 * Generates a random 6-character alphanumeric referral code
 * Uses only uppercase letters (excluding I and O) and digits (excluding 0 and 1)
 * to avoid confusion
 */
export function generateReferralCode(): string {
  // Use only clearly distinguishable characters (no 0, O, 1, I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  let code = '';
  
  // Generate 6 random characters
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}
