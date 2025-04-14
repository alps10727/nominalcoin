
/**
 * Generate a suggested referral code for the user
 */
export function generateSuggestedCode(): string {
  // Generate a code in the format 3 letters + 3 numbers
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excluding I and O for readability
  let lettersPart = '';
  for (let i = 0; i < 3; i++) {
    lettersPart += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 3 random digits
  const digits = '0123456789';
  let digitsPart = '';
  for (let i = 0; i < 3; i++) {
    digitsPart += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  
  // Combine letters and digits
  return lettersPart + digitsPart;
}

