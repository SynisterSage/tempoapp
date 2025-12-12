#!/bin/bash

# Stats Page Implementation - Quick Start Guide

## Files Created/Modified

### 1. Mock Data
- `/src/data/mockStatsData.ts` - Mock stats data with easy API/mock toggle

### 2. Components
- `/src/components/stats/ScoringCorrelations.tsx` - Interactive graph showing score vs GIR correlation
- `/src/components/stats/RecentActivityStats.tsx` - Key stats cards (Index, AVG Score, Best Round)
- `/src/components/stats/StatsBreakdown.tsx` - Detailed stats breakdown with strokes gained

### 3. Screens
- `/src/screens/Stats/StatsScreen.tsx` - Main stats page with loading, error states, and debug info

### 4. Services
- `/src/services/dataSourceConfig.ts` - Universal data source handler for easy mock/API switching
- `/src/theme/layout.ts` - Re-export of theme utilities for convenience

## How to Use

### Toggle Between Mock and Real Data
Edit `/src/services/dataSourceConfig.ts`:
```typescript
// Change this line to switch data sources
export const USE_MOCK_DATA = true;  // Set to false for API
```

### Update Mock Data
Edit `/src/data/mockStatsData.ts` to modify:
- `mockUserStats` - Player statistics
- `mockScoringCorrelations` - Graph data
- `mockRecentRounds` - Round history

### Connect to Real API
When ready to use real API:
1. Set `USE_MOCK_DATA = false` in `dataSourceConfig.ts`
2. Update `API_BASE_URL` in the same file
3. Ensure your API endpoint returns the expected data structure

## Features Implemented

✅ **Recent Activity Cards**
- Index (Handicap)
- Average Score (Last 5)
- Best Round
- With trend indicators

✅ **Scoring Correlations Chart**
- Displays relationship between scores and GIR%
- Tab switcher for GIR% and Putts views
- SVG chart with interactive dots

✅ **Detailed Stats Breakdown**
- Rounds & Scoring section
- Accuracy stats (Fairway, GIR, Putts)
- Strokes Gained breakdown (Off Tee, Approach, Around Green, Putting)
- Color-coded gains/losses

✅ **Data Management**
- Easy mock ↔ API switching
- Automatic fallback to mock data on API failure
- Debug banner in development mode
- Loading and error states

## Libraries Used

- `react-native-svg-charts` - For the charting
- `react-native-svg` - SVG rendering
- Existing theme system (Colors, Spacing, BorderRadius)

## Next Steps

1. **Integrate with backend** - Point `API_BASE_URL` to your backend
2. **Fetch real data** - Replace mock data with actual API calls
3. **Add filtering** - Date ranges, course filtering, etc.
4. **Export features** - CSV/PDF export of stats
5. **Comparison views** - Compare stats across time periods
