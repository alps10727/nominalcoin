
export interface CapacitorInterface {
  getPlatform(): string;
  isPluginAvailable(name: string): boolean;
}

declare global {
  interface Window {
    Capacitor?: CapacitorInterface;
  }
}
