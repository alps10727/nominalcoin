
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

/**
 * Timer utility for performance tracking
 */
export class Timer {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  start(): void {
    this.startTime = performance.now();
  }

  stop(): number {
    const endTime = performance.now();
    const duration = endTime - this.startTime;
    debugLog("Timer", `${this.name} completed in ${duration.toFixed(2)}ms`);
    return duration;
  }
}
