
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

/**
 * Generate a deterministic referral code based on user ID
 * This ensures the same user always gets the same referral code
 */
export function generateDeterministicCode(userId: string): string {
  // Use only clearly distinguishable characters (no 0, O, 1, I)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  // Create a deterministic but distributed hash from the userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  // Ensure hash is positive
  hash = Math.abs(hash);
  
  // Generate 6 characters based on the hash
  let code = '';
  for (let i = 0; i < 6; i++) {
    // Use modulo to get a value within the chars array length
    const index = (hash + i * 7919) % chars.length; // Using prime numbers to distribute
    code += chars.charAt(Math.abs(index));
  }
  
  return code;
}
