/**
 * Tempo Golf - Calculation Utilities
 * Golf-specific calculations: scoring, handicap, distance, strokes gained
 */

import { GPSCoordinate } from '../types/models';

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @returns Distance in yards
 */
export function calculateDistance(
  point1: GPSCoordinate,
  point2: GPSCoordinate
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const meters = R * c;
  const yards = meters * 1.09361; // Convert to yards

  return Math.round(yards);
}

/**
 * Convert yards to meters
 */
export function yardsToMeters(yards: number): number {
  return Math.round(yards * 0.9144);
}

/**
 * Convert meters to yards
 */
export function metersToYards(meters: number): number {
  return Math.round(meters * 1.09361);
}

/**
 * Calculate net score from gross score and handicap
 */
export function calculateNetScore(grossScore: number, handicap: number): number {
  return grossScore - Math.round(handicap);
}

/**
 * Calculate playing handicap based on course rating and slope
 */
export function calculatePlayingHandicap(
  handicapIndex: number,
  courseSlope: number,
  coursePar: number = 72
): number {
  const slopeRating = courseSlope || 113; // Default slope rating
  return Math.round((handicapIndex * slopeRating) / 113);
}

/**
 * Calculate scoring differential for handicap calculation
 */
export function calculateScoringDifferential(
  adjustedGrossScore: number,
  courseRating: number,
  slopeRating: number
): number {
  return ((adjustedGrossScore - courseRating) * 113) / slopeRating;
}

/**
 * Check if score is Green in Regulation (GIR)
 * Par 3: on green in 1 stroke
 * Par 4: on green in 2 strokes
 * Par 5: on green in 3 strokes
 */
export function isGreenInRegulation(
  strokesBeforeGreen: number,
  par: number
): boolean {
  const girStandard = par - 2;
  return strokesBeforeGreen <= girStandard;
}

/**
 * Calculate Fairway Hit percentage
 */
export function calculateFairwayAccuracy(
  fairwaysHit: number,
  totalFairways: number
): number {
  if (totalFairways === 0) return 0;
  return Math.round((fairwaysHit / totalFairways) * 100);
}

/**
 * Calculate GIR percentage
 */
export function calculateGIRPercentage(
  greensHit: number,
  totalHoles: number
): number {
  if (totalHoles === 0) return 0;
  return Math.round((greensHit / totalHoles) * 100);
}

/**
 * Calculate average putts per hole
 */
export function calculateAveragePutts(
  totalPutts: number,
  totalHoles: number
): number {
  if (totalHoles === 0) return 0;
  return parseFloat((totalPutts / totalHoles).toFixed(2));
}

/**
 * Calculate strokes gained (simplified version)
 * Positive = better than baseline, Negative = worse than baseline
 */
export function calculateStrokesGained(
  actualStrokes: number,
  expectedStrokes: number
): number {
  return parseFloat((expectedStrokes - actualStrokes).toFixed(2));
}

/**
 * Get expected strokes for distance (baseline from PGA Tour data)
 */
export function getExpectedStrokes(yards: number, lie: string = 'fairway'): number {
  // Simplified baseline - real implementation would use strokes gained database
  if (lie === 'tee') {
    if (yards >= 450) return 4.5;
    if (yards >= 400) return 4.2;
    if (yards >= 350) return 4.0;
    return 3.8;
  }
  
  if (lie === 'fairway') {
    if (yards >= 200) return 3.5;
    if (yards >= 150) return 3.2;
    if (yards >= 100) return 3.0;
    if (yards >= 50) return 2.8;
    return 2.5;
  }
  
  if (lie === 'green') {
    if (yards >= 30) return 2.5;
    if (yards >= 20) return 2.3;
    if (yards >= 10) return 2.1;
    return 2.0;
  }
  
  return 3.0; // Default
}

/**
 * Calculate bearing/direction between two GPS points
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  start: GPSCoordinate,
  end: GPSCoordinate
): number {
  const φ1 = (start.latitude * Math.PI) / 180;
  const φ2 = (end.latitude * Math.PI) / 180;
  const Δλ = ((end.longitude - start.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const bearing = ((θ * 180) / Math.PI + 360) % 360;

  return Math.round(bearing);
}

/**
 * Get compass direction from bearing
 */
export function getCompassDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Format score relative to par
 */
export function formatScoreToPar(score: number, par: number): string {
  const diff = score - par;
  if (diff === 0) return 'E';
  if (diff > 0) return `+${diff}`;
  return `${diff}`;
}

/**
 * Get score name (Eagle, Birdie, Par, etc.)
 */
export function getScoreName(score: number, par: number): string {
  const diff = score - par;
  
  if (diff <= -3) return 'Albatross';
  if (diff === -2) return 'Eagle';
  if (diff === -1) return 'Birdie';
  if (diff === 0) return 'Par';
  if (diff === 1) return 'Bogey';
  if (diff === 2) return 'Double Bogey';
  if (diff === 3) return 'Triple Bogey';
  return `+${diff}`;
}
