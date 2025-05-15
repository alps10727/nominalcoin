
export interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
  isNativePlatform(): boolean;
}

declare global {
  interface Window {
    Capacitor?: CapacitorInterface;
  }
}
