
/**
 * Generates a random 6-character alphanumeric referral code
 * Format: 3 letters + 3 numbers (e.g., ABC123)
 */
export function generateReferralCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing I and O
  const numbers = '123456789'; // Removed confusing 0
  
  let code = '';
  
  // Generate 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
}
