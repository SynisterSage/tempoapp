/**
 * Home Screen Data Types
 * Structured for easy API integration
 */

export interface CourseCard {
  id: string;
  name: string;
  location: string;
  par: number;
  yardage: number;
  handicap?: number;
  imageUrl?: string; // Will be populated from API
  distance?: number; // Distance in miles from user
  holes: number;
  slope: number;
  rating: number;
}

export interface RoundResult {
  id: string;
  courseId: string;
  courseName: string;
  score: number;
  par: number;
  date: Date;
  holesPlayed: number;
  strokesGained?: number;
}

export interface CaddyTip {
  id: string;
  title: string;
  courseName: string;
  content: string;
  icon?: string;
}

export interface ScoreData {
  index: number;
  trend: 'up' | 'down' | 'stable';
  change: number; // percentage
}

export interface TrainingDrill {
  id: string;
  name: string;
  type: 'driving' | 'chipping' | 'putting' | 'full-swing';
  duration: number; // minutes
  imageUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface HomeScreenData {
  featuredCourse: CourseCard;
  recentActivity: RoundResult[];
  caddyTip: CaddyTip;
  scoreData: ScoreData;
  trainingDrills: TrainingDrill[];
  loading: boolean;
  error: string | null;
}
