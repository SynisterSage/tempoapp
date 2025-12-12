/**
 * Data Source Configuration
 * Easy switcher between mock data and API
 * 
 * To switch data sources:
 * 1. Change USE_MOCK_DATA to false to use API
 * 2. Or change to true to use mock data
 * 
 * The application will automatically:
 * - Fallback to mock data if API fails
 * - Show a debug banner in development mode
 * - Make API calls to the configured endpoint when mock is disabled
 */

// ========== CONFIGURATION ==========
// Change this to switch between mock and API data
export const USE_MOCK_DATA = true;

// API base URL - configure here or in environment variables
export const API_BASE_URL = 'http://localhost:3000';

// ========== DATA SOURCE HELPER ==========
/**
 * Universal data fetcher that respects the USE_MOCK_DATA setting
 * 
 * Usage in components:
 * ```ts
 * const data = await fetchDataFromSource('stats', mockData, '/api/stats');
 * ```
 */
export async function fetchDataFromSource<T>(
  dataType: 'stats' | 'rounds' | 'user' | string,
  mockData: T,
  apiEndpoint: string
): Promise<T> {
  // If using mock data, return it immediately
  if (USE_MOCK_DATA) {
    console.log(`📊 Using MOCK data for ${dataType}`);
    // Simulate network delay for consistency
    await new Promise((resolve) => setTimeout(() => resolve(null), 300));
    return mockData;
  }

  // Try to fetch from API
  try {
    console.log(`🔌 Fetching from API: ${API_BASE_URL}${apiEndpoint}`);
    const response = await fetch(`${API_BASE_URL}${apiEndpoint}`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${dataType} from API`);
    return data;
  } catch (error) {
    console.warn(
      `⚠️ Failed to fetch ${dataType} from API, falling back to mock data:`,
      error
    );
    // Fallback to mock data on error
    return mockData;
  }
}

/**
 * Check if using mock data (useful for UI indicators)
 */
export function isUsingMockData(): boolean {
  return USE_MOCK_DATA;
}

/**
 * Get current data source name for debugging
 */
export function getDataSourceName(): string {
  return USE_MOCK_DATA ? 'MOCK' : 'API';
}
