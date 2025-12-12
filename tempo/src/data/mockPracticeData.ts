/**
 * Mock Practice Data
 * Easy to change mock data for the Practice screen
 * Update these objects to test different states
 */

import { PracticeSession, Drill, AIRecommendation } from '../types/models';

// ========== AI Coach Insight ==========
export const mockCoachInsight: AIRecommendation = {
  id: 'insight-001',
  userId: 'user-123',
  roundId: 'round-456',
  recommendationType: 'drill',
  title: 'AI Coach Insight',
  description:
    'Hi Chris, I analyzed your round at Torrey Pines. You\'re losing strokes off the tee due to a slice miss pattern (avg 15y Right).',
  priority: 1,
  createdAt: new Date().toISOString(),
};

// ========== Training Tools ==========
export const mockTrainingTools = [
  {
    id: 'tool-001',
    name: 'Tempo Rhythm Check',
    description: 'Track swing tempo and rhythm',
    category: 'driving' as const,
    icon: '⊙', // Target/Bullseye icon representation
    duration: 10,
    color: '#6366F1', // Indigo
  },
  {
    id: 'tool-002',
    name: 'Range Mode',
    description: 'Track carry distances & dispersion',
    category: 'driving' as const,
    icon: '📡', // Wifi/Range icon representation
    duration: null,
    color: '#7C3AED', // Violet
  },
  {
    id: 'tool-003',
    name: 'Swing Replay',
    description: 'Slow-Motion analysis AI',
    category: 'approach' as const,
    icon: '⟳', // Refresh/Replay icon representation
    duration: null,
    color: '#EC4899', // Pink
  },
];

// ========== Active Drills ==========
export const mockActiveDrills: Drill[] = [
  {
    id: 'drill-001',
    name: 'Slice Miss Pattern Fix',
    description: 'Focused drill to eliminate your slice tendency',
    category: 'driving',
    difficulty: 'intermediate',
    estimatedTime: 15,
    instructions: [
      'Take 10 shots focusing on swing plane',
      'Feel the inside-out swing path',
      'Track ball flight dispersion',
      'Record video for analysis',
      'Review footage with coach insights',
    ],
  },
  {
    id: 'drill-002',
    name: 'Tempo Consistency',
    description: 'Build consistent swing tempo',
    category: 'driving',
    difficulty: 'beginner',
    estimatedTime: 10,
    instructions: [
      'Use metronome at 90 BPM',
      'Complete 3 sets of 5 shots each',
      'Focus on backswing tempo',
      'Record rhythm consistency metrics',
    ],
  },
  {
    id: 'drill-003',
    name: 'Approach Shot Distance Control',
    description: 'Master 150-200 yard approaches',
    category: 'approach',
    difficulty: 'intermediate',
    estimatedTime: 20,
    instructions: [
      'Hit 5 shots at 150 yards',
      'Hit 5 shots at 175 yards',
      'Hit 5 shots at 200 yards',
      'Log accuracy within ±5 yards',
      'Track consistency across sets',
    ],
  },
];

// ========== Recent Practice Sessions ==========
export const mockPracticeSessions: PracticeSession[] = [
  {
    id: 'session-001',
    userId: 'user-123',
    date: '2025-12-11',
    duration: 45,
    sessionType: 'range',
    clubs: ['driver', '3w', '5w', '5i', '7i', '9i'],
    shots: 180,
    notes: 'Worked on slice pattern, 75% success rate',
  },
  {
    id: 'session-002',
    userId: 'user-123',
    date: '2025-12-09',
    duration: 30,
    sessionType: 'short_game',
    clubs: ['sw', 'pw'],
    shots: 60,
    notes: 'Chipping practice near greens',
  },
  {
    id: 'session-003',
    userId: 'user-123',
    date: '2025-12-07',
    duration: 60,
    sessionType: 'putting',
    clubs: ['putter'],
    shots: 100,
    notes: 'Long range putting drills, 3-putt reduction focus',
  },
];

// ========== Next Recommended Drill ==========
export const mockNextRecommendedDrill: Drill = {
  id: 'drill-recommended-001',
  name: 'Tempo Rhythm Check',
  description: 'Driving • 10 min',
  category: 'driving',
  difficulty: 'beginner',
  estimatedTime: 10,
  instructions: ['Start drill', 'Practice swing tempo consistency'],
};

// ========== Practice Stats ==========
export const mockPracticeStats = {
  totalSessionsThisMonth: 12,
  totalHoursThisMonth: 8.5,
  favoriteDrill: 'Slice Miss Pattern Fix',
  lastSessionDate: '2025-12-11',
  avgSessionDuration: 38,
  completedDrills: 8,
  inProgressDrills: 3,
};

// ========== All Available Drills Library ==========
export const mockDrillLibrary: Drill[] = [
  ...mockActiveDrills,
  {
    id: 'drill-004',
    name: 'Putting Arc Alignment',
    description: 'Perfect your putting stroke arc',
    category: 'putting',
    difficulty: 'beginner',
    estimatedTime: 15,
    instructions: [
      'Use alignment guide on mat',
      'Practice 20 putts straight',
      'Move drill to slight angles',
      'Progress to breaking putts',
    ],
  },
  {
    id: 'drill-005',
    name: 'Bunker Escape Mastery',
    description: 'Master sand shots from various lies',
    category: 'short_game',
    difficulty: 'advanced',
    estimatedTime: 25,
    instructions: [
      'Start with basic bunker setup',
      'Practice 5 shots from even lie',
      'Move to uphill/downhill lies',
      'Focus on distance control',
      'Track escape rate percentage',
    ],
  },
];
