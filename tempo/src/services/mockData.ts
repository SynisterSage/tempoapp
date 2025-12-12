/**
 * Mock Data Service
 * Provides mock data for development
 * Replace with actual API calls in services/api.ts
 */

import { HomeScreenData, CourseCard, RoundResult, CaddyTip, TrainingDrill } from '../types/home';

export const mockCourse: CourseCard = {
  id: 'torrey-pines',
  name: 'Torrey Pines',
  location: 'San Diego, CA',
  par: 72,
  yardage: 7258,
  handicap: 76,
  distance: 2.3,
  holes: 18,
  slope: 143,
  rating: 75.9,
};

export const mockRecentActivity: RoundResult[] = [
  {
    id: 'round-1',
    courseId: 'pebble-creek',
    courseName: 'Pebble Creek',
    score: 84,
    par: 72,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    holesPlayed: 18,
    strokesGained: 2.3,
  },
  {
    id: 'round-2',
    courseId: 'arcola-cc',
    courseName: 'Arcola CC',
    score: 87,
    par: 72,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    holesPlayed: 18,
    strokesGained: -1.5,
  },
  {
    id: 'round-3',
    courseId: 'burlington',
    courseName: 'Burlington',
    score: 85,
    par: 72,
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    holesPlayed: 18,
    strokesGained: 0.8,
  },
];

export const mockCaddyTip: CaddyTip = {
  id: 'tip-1',
  title: 'Caddy Tip',
  courseName: 'Torrey Pines',
  content: '"Take one less club at Torrey Pines today."',
  icon: 'lightbulb',
};

export const mockTrainingDrills: TrainingDrill[] = [
  {
    id: 'drill-1',
    name: 'Tempo Rhythm Check',
    type: 'driving',
    duration: 10,
    difficulty: 'beginner',
  },
];

export const mockHomeScreenData: HomeScreenData = {
  featuredCourse: mockCourse,
  recentActivity: mockRecentActivity,
  caddyTip: mockCaddyTip,
  scoreData: {
    index: 70,
    trend: 'down',
    change: -0.2,
  },
  trainingDrills: mockTrainingDrills,
  loading: false,
  error: null,
};
