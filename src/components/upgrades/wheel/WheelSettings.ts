
import { WheelPrize } from "@/types/missions";

// Wheel configuration constants
export const WHEEL_SPIN_DURATION = 5000; // Animation duration in ms
export const WHEEL_COOLDOWN_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms

// Default prizes for the wheel
export const DEFAULT_PRIZES: WheelPrize[] = [
  { id: 'nc-1', label: '1 NC', value: 1, type: 'coins' },
  { id: 'nc-5', label: '5 NC', value: 5, type: 'coins' },
  { id: 'nc-10', label: '10 NC', value: 10, type: 'coins' },
  { id: 'nc-50', label: '50 NC', value: 50, type: 'coins' },
  { id: 'rate-001', label: '+0.001', value: 0.001, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'rate-003', label: '+0.003', value: 0.003, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'rate-005', label: '+0.005', value: 0.005, type: 'mining_rate', duration: 24 * 60 * 60 * 1000 },
  { id: 'nc-2', label: '2 NC', value: 2, type: 'coins' },
];
