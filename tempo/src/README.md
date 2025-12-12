# Tempo Golf - Source Code Structure

## 📁 Folder Organization

### `/screens`
Main app screens organized by feature/tab:

- **`/Home`** - Dashboard, recent rounds, quick actions
- **`/Play`** - Core GPS gameplay (course selection, map, shot tracking, camera)
- **`/Stats`** - Performance analytics, round history, trends
- **`/Practice`** - Range mode, drill tracking
- **`/Settings`** - Profile, bag setup, preferences
- **`/Auth`** - Login, registration, password reset

### `/components`
Reusable UI components:

- **`/common`** - Shared components (buttons, cards, inputs, modals)
- **`/play`** - Play-specific components (GPS map, shot logger, hazard overlay)
- **`/stats`** - Stats-specific components (charts, scorecard viewer)

### `/navigation`
Navigation configuration:

- `AppNavigator.tsx` - Root navigator
- `TabNavigator.tsx` - Bottom tab navigation
- `PlayStack.tsx` - Play feature stack
- `navigationTypes.ts` - TypeScript navigation types

### `/services`
External API integrations & data layer:

- `api.ts` - Backend API client (Axios/Fetch)
- `auth.service.ts` - Supabase Auth
- `course.service.ts` - Golf Course API
- `weather.service.ts` - Weather API
- `location.service.ts` - GPS/Location services
- `storage.service.ts` - AsyncStorage helpers

### `/store`
State management (Zustand):

- `authStore.ts` - User authentication state
- `roundStore.ts` - Active round state
- `courseStore.ts` - Course data
- `userStore.ts` - User profile & bag
- `settingsStore.ts` - App preferences

### `/types`
TypeScript type definitions:

- `models.ts` - Data models (User, Course, Round, Shot)
- `api.ts` - API request/response types
- `navigation.ts` - Navigation param types

### `/utils`
Helper functions & utilities:

- `calculations.ts` - Golf scoring, handicap, strokes gained
- `gps.ts` - Distance calculations, coordinate helpers
- `formatting.ts` - Date, number, string formatting
- `validation.ts` - Form validation

### `/constants`
App-wide constants:

- `colors.ts` - Color palette
- `typography.ts` - Font styles
- `layout.ts` - Spacing, dimensions
- `config.ts` - API URLs, keys

### `/hooks`
Custom React hooks:

- `useLocation.ts` - GPS location tracking
- `useRound.ts` - Active round management
- `usePermissions.ts` - Camera/location permissions
- `useOrientation.ts` - Device orientation

### `/assets`
Static resources:

- **`/images`** - Course photos, backgrounds, logos
- **`/icons`** - Custom icon sets, tab icons

### `/theme`
Theme configuration:

- `index.ts` - Light/dark theme definitions
- `colors.ts` - Theme colors
- `spacing.ts` - Spacing system
