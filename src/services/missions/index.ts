
/**
 * Missions service index file - exports all mission-related functionality
 */

// Export the individual functionality
export { fetchMissions } from './fetchMissions';
export { claimMissionReward } from './claimMissionReward';
export { updateMissionProgress } from './updateMissionProgress';
export { activateMiningBoost } from './activateMiningBoost';
export { getDefaultMissions } from './missionDefaults';

// Re-export the constants
export { COOLDOWN_TIMES } from '@/constants/missionConstants';
