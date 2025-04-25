
import { debugLog, errorLog } from "@/utils/debugUtils";

export class AdMobErrorHandler {
  private static readonly MAX_RETRY_COUNT = 3;
  private static readonly RETRY_DELAY = 5000;
  private retryCount = 0;

  constructor(private context: string = 'AdMob') {}

  handleAdLoadError(error: any, retryCallback?: () => void): void {
    const errorMessage = error?.message || 'Unknown error';
    const errorCode = error?.code || 'unknown';
    
    errorLog(this.context, `Ad failed to load with error code: ${errorCode}, message: ${errorMessage}`, null);
    
    if (retryCallback && this.retryCount < AdMobErrorHandler.MAX_RETRY_COUNT) {
      this.retryCount++;
      const delay = AdMobErrorHandler.RETRY_DELAY * Math.pow(2, this.retryCount - 1);
      debugLog(this.context, `Will retry loading ad in ${delay}ms (attempt ${this.retryCount})`);
      setTimeout(retryCallback, delay);
    }
  }

  resetRetryCount(): void {
    this.retryCount = 0;
  }

  getRetryCount(): number {
    return this.retryCount;
  }
}
