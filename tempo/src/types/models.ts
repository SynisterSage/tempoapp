/**
 * Tempo Golf - Type Definitions
 * Based on database schema and API models
 */

// ========== User Types ==========

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  handicapIndex: number;
  profilePhotoUrl?: string;
  preferredTees: TeeType;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserBag {
  id: string;
  userId: string;
  clubType: ClubType;
  clubName?: string;
  carryDistance: number;
  totalDistance: number;
  createdAt: string;
}

export type ClubType = 
  | 'driver' 
  | '3w' | '5w' | '7w'
  | '2i' | '3i' | '4i' | '5i' | '6i' | '7i' | '8i' | '9i'
  | 'pw' | 'aw' | 'sw' | 'lw'
  | 'putter';

// ========== Course Types ==========

export interface Course {
  id: string;
  name: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  holes: number;
  par: number;
  slope?: number;
  courseRating?: number;
  photoUrl?: string;
  externalId?: string;
  isVerified: boolean;
}

export interface TeeMarker {
  id: string;
  courseId: string;
  holeNumber: number;
  teeType: TeeType;
  latitude: number;
  longitude: number;
  yards: number;
  handicap: number;
}

export type TeeType = 'black' | 'blue' | 'white' | 'red' | 'gold';

export interface Hole {
  holeNumber: number;
  par: number;
  handicap: number;
  yards: number;
  hazards?: Hazard[];
}

export interface Hazard {
  type: 'water' | 'bunker' | 'ob' | 'tree';
  latitude: number;
  longitude: number;
  radius: number;
}

// ========== Round Types ==========

export interface Round {
  id: string;
  userId: string;
  courseId: string;
  datePlayed: string;
  grossScore?: number;
  netScore?: number;
  handicapAtPlay: number;
  holesPlayed: number;
  scoringMethod: ScoringMethod;
  teeType: TeeType;
  weatherConditions?: WeatherConditions;
  completed: boolean;
  scores: Score[];
  shots: Shot[];
}

export type ScoringMethod = 'stroke' | 'match' | 'scramble' | 'stableford';

export interface Score {
  id: string;
  roundId: string;
  holeNumber: number;
  strokes: number;
  putts: number;
  fairwayHit: boolean;
  greenInRegulation: boolean;
  penalties: number;
}

export interface Shot {
  id: string;
  roundId: string;
  holeNumber: number;
  shotNumber: number;
  clubUsed?: ClubType;
  startLatitude: number;
  startLongitude: number;
  endLatitude?: number;
  endLongitude?: number;
  distance?: number;
  shotType: ShotType;
  lie?: LieType;
  createdAt: string;
}

export type ShotType = 'tee' | 'fairway' | 'rough' | 'bunker' | 'green' | 'penalty';
export type LieType = 'fairway' | 'rough_light' | 'rough_heavy' | 'sand' | 'hardpan';

// ========== Weather Types ==========

export interface WeatherConditions {
  tempF: number;
  windMph: number;
  windDirection: string;
  humidity: number;
  conditions: string;
}

// ========== Stats Types ==========

export interface UserStats {
  totalRounds: number;
  averageScore: number;
  lowestScore: number;
  currentHandicap: number;
  fairwayAccuracy: number; // Percentage
  greenInRegulation: number; // Percentage
  averagePutts: number;
  strokesGained: StrokesGained;
}

export interface StrokesGained {
  offTee: number;
  approach: number;
  aroundGreen: number;
  putting: number;
  total: number;
}

// ========== Practice Types ==========

export interface PracticeSession {
  id: string;
  userId: string;
  date: string;
  duration: number; // minutes
  sessionType: 'range' | 'putting' | 'short_game' | 'simulator';
  clubs: ClubType[];
  shots: number;
  notes?: string;
}

export interface Drill {
  id: string;
  name: string;
  description: string;
  category: 'driving' | 'approach' | 'short_game' | 'putting';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  instructions: string[];
}

// ========== AI Recommendations ==========

export interface AIRecommendation {
  id: string;
  userId: string;
  roundId?: string;
  recommendationType: 'drill' | 'strategy' | 'club_selection';
  title: string;
  description: string;
  priority: number;
  createdAt: string;
}

// ========== Navigation Types ==========

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp?: number;
}

export interface Distance {
  yards: number;
  meters: number;
}
