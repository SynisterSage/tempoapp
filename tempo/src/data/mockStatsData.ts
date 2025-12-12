/**
 * Mock Stats Data
 * Easy to switch between mock data and API calls
 * Update these objects to test different states
 */

import { UserStats, StrokesGained } from '../types/models';

// ========== Scoring Correlations Data ==========
export interface ScoringCorrelationDataPoint {
  name: string;
  score: number;
  gir: number; // Green in Regulation percentage
}

export const mockScoringCorrelations: ScoringCorrelationDataPoint[] = [
  { name: 'Torrey', score: 78, gir: 55 },
  { name: 'Pebble', score: 84, gir: 67 },
  { name: 'Spanish', score: 81, gir: 44 },
];

// ========== User Stats ==========
export const mockStrokesGained: StrokesGained = {
  offTee: 2.1,
  approach: -0.3,
  aroundGreen: 1.5,
  putting: -1.2,
  total: 2.1,
};

export const mockUserStats: UserStats = {
  totalRounds: 42,
  averageScore: 85.6,
  lowestScore: 79,
  currentHandicap: 12.5,
  fairwayAccuracy: 68,
  greenInRegulation: 62,
  averagePutts: 28.5,
  strokesGained: mockStrokesGained,
};

// ========== Recent Rounds ==========
export interface RecentRound {
  id: string;
  courseName: string;
  score: number;
  par: number;
  date: Date;
  daysAgo: number;
}

export const mockRecentRounds: RecentRound[] = [
  {
    id: 'round-1',
    courseName: 'Pebble Creek',
    score: 84,
    par: 72,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    daysAgo: 2,
  },
  {
    id: 'round-2',
    courseName: 'Torrey Pines',
    score: 78,
    par: 72,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    daysAgo: 7,
  },
  {
    id: 'round-3',
    courseName: 'Spanish Hills',
    score: 81,
    par: 72,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    daysAgo: 14,
  },
];

// ========== Helper Functions ==========
import { fetchDataFromSource, isUsingMockData } from '../services/dataSourceConfig';

export const STATS_CONFIG = {
  USE_MOCK_DATA: isUsingMockData(),
};

// Main function to get all stats data
export const getStatsData = async () => {
  const statsData = {
    userStats: mockUserStats,
    recentRounds: mockRecentRounds,
    scoringCorrelations: mockScoringCorrelations,
  };

  // Use the universal data fetcher
  return fetchDataFromSource('stats', statsData, '/api/stats');
};
