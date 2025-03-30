
/**
 * Enhanced logging utility to help with debugging
 */
export const debugLog = (context: string, message: string, data?: any) => {
  console.log(`[${context}] ${message}`, data !== undefined ? data : '');
};

/**
 * Log an error with additional context
 */
export const errorLog = (context: string, message: string, error?: any) => {
  console.error(`[${context}] ERROR: ${message}`, error !== undefined ? error : '');
};

/**
 * Simple timer utility to measure performance
 */
export class Timer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  stop() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    console.log(`[Timer] ${this.name} completed in ${duration.toFixed(2)}ms`);
    return duration;
  }
}
