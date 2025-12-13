/**
 * Filter Types for Course Search
 * Easily extensible for API integration
 */

export interface CourseFilters {
  holes: number[] | null; // [9, 18] or null for all
  yardageRange: {
    min: number;
    max: number;
  };
  ratingRange: {
    min: number;
    max: number;
  };
  slopeRange: {
    min: number;
    max: number;
  };
  location: string | null; // city name or coordinates later
}

export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  title: string;
  type: 'checkbox' | 'slider' | 'range';
  options?: FilterOption[];
  currentValue?: any;
}

// Mock filter data - ready to replace with API data
export const MOCK_FILTER_OPTIONS = {
  holes: [
    { id: '9', label: '9 Holes', value: 9 },
    { id: '18', label: '18 Holes', value: 18 },
  ],
  locations: [
    { id: 'california', label: 'California', value: 'california' },
    { id: 'nevada', label: 'Nevada', value: 'nevada' },
    { id: 'arizona', label: 'Arizona', value: 'arizona' },
  ],
};

// Default filter ranges
export const DEFAULT_FILTERS: CourseFilters = {
  holes: null,
  yardageRange: {
    min: 5000,
    max: 8000,
  },
  ratingRange: {
    min: 70,
    max: 77,
  },
  slopeRange: {
    min: 120,
    max: 150,
  },
  location: null,
};
