
/**
 * Debug log utility
 */
export function debugLog(context: string, message: string, data?: any): void {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${context}] ${message}`, data || '');
  }
}

/**
 * Error log utility
 */
export function errorLog(context: string, message: string, error?: any): void {
  console.error(`[${context}] ${message}`, error || '');
}
