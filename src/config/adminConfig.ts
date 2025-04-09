
/**
 * Admin access credentials and configuration
 * These are used for emergency access even when Firebase is down
 */

export const ADMIN_CREDENTIALS = {
  email: "ncowner0001@gmail.com",
  password: "1069GYSF"
};

export const ADMIN_EMAILS = [
  ADMIN_CREDENTIALS.email
  // Additional admin emails can be added here
];

/**
 * Check if the provided credentials match admin credentials
 * Used for direct admin login without Firebase
 */
export function isAdminCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() && 
         password === ADMIN_CREDENTIALS.password;
}

/**
 * Check if the provided email is in the admin email list
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
