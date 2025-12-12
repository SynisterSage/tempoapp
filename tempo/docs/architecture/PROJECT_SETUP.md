# Tempo - Project Initialization & Development Setup

## Project Overview

**Project Name**: Tempo Golf  
**Description**: Next-generation golf app combining GPS mapping, AI analysis, and AR camera technology  
**Repository**: [Will be GitHub URL]  
**Version**: 0.1.0 (MVP)  
**Maintainers**: Lex Ferguson, Chris Buzziad

---

## Repository Structure

```
tempoapp/
├── docs/                           # All documentation
│   ├── roadmap/
│   │   └── PRODUCT_ROADMAP.md
│   ├── architecture/
│   │   ├── TECHNICAL_ARCHITECTURE.md
│   │   └── DATABASE_SCHEMA.md
│   ├── api/
│   │   └── ENDPOINTS.md
│   ├── security/
│   │   ├── AUTH_SECURITY.md
│   │   └── DATA_PRIVACY.md
│   └── features/
│       └── AR_CAMERA_IMPLEMENTATION.md
│
├── frontend/                       # React Native iOS/Android app
│   ├── src/
│   │   ├── screens/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── PlayScreen.tsx
│   │   │   ├── ARCameraScreen.tsx
│   │   │   ├── CourseMapScreen.tsx
│   │   │   ├── ScorecardScreen.tsx
│   │   │   ├── StatsScreen.tsx
│   │   │   ├── PracticeScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   ├── components/
│   │   │   ├── Navigation/
│   │   │   ├── UI/
│   │   │   └── AR/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useLocationTracking.ts
│   │   │   └── useARCamera.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── database.ts
│   │   │   └── geolocation.ts
│   │   ├── store/
│   │   │   └── redux/ (or zustand/)
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── ios/
│   ├── android/
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   └── .eslintrc.json
│
├── backend/                        # Node.js/Express server
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── courses.ts
│   │   │   ├── rounds.ts
│   │   │   ├── users.ts
│   │   │   ├── ai.ts
│   │   │   └── weather.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimit.ts
│   │   ├── services/
│   │   │   ├── supabase.ts
│   │   │   ├── auth.ts
│   │   │   ├── golfCourseApi.ts
│   │   │   └── ai.ts
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │       ├── 001_create_users_table.sql
│   │       ├── 002_create_courses_table.sql
│   │       ├── 003_create_tee_markers_table.sql
│   │       ├── 004_create_rounds_table.sql
│   │       ├── 005_create_shots_table.sql
│   │       ├── 006_create_scores_table.sql
│   │       ├── 007_create_user_bags_table.sql
│   │       ├── 008_create_clubs_table.sql
│   │       ├── 009_create_practice_sessions_table.sql
│   │       ├── 010_create_ai_recommendations_table.sql
│   │       └── 011_create_subscriptions_table.sql
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── .github/
│   └── workflows/
│       ├── frontend-ci.yml
│       ├── backend-ci.yml
│       └── deploy.yml
│
├── .gitignore
├── README.md
└── CONTRIBUTING.md
```

---

## Design System & Component Library

### React Native Paper
Tempo uses **React Native Paper** for design components with custom theming to match our golf-inspired aesthetic.

**Why Paper?**
- Cross-platform (iOS/Android) component consistency
- Material Design 3 foundation (modern, familiar)
- Easy theming system for brand colors
- Built-in accessibility (WCAG compliant)
- Active maintenance and community support

**Installation**:
```bash
cd frontend
npm install react-native-paper
npm install react-native-vector-icons
```

**Custom Theme** (`frontend/src/theme/theme.ts`):
```typescript
import { MD3LightTheme } from 'react-native-paper';

export const tempoTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1B6B1B',        // Golf green
    secondary: '#F5A623',      // Flag gold
    tertiary: '#2E5090',       // Water blue
    background: '#F8F8F8',     // Light gray
    surface: '#FFFFFF',
    surfaceVariant: '#E8E8E8',
    error: '#D32F2F',
    warning: '#F57C00',        // Orange for rough/hazards
    info: '#1976D2',           // Slope/AR info
  },
};
```

**Usage in App.tsx**:
```typescript
import { PaperProvider } from 'react-native-paper';
import { tempoTheme } from '@theme/theme';

export default function App() {
  return (
    <PaperProvider theme={tempoTheme}>
      <Navigation />
    </PaperProvider>
  );
}
```

**Using Components**:
```typescript
import { Button, Card, Text } from 'react-native-paper';

export function ScorecardScreen() {
  return (
    <Card style={{ margin: 16 }}>
      <Card.Title title="Hole 7" subtitle="Par 4" />
      <Card.Content>
        <Text variant="headlineMedium">185 yards</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Log Score</Button>
      </Card.Actions>
    </Card>
  );
}
```

**Customizing Components**:
```typescript
// Override specific button styling without losing theme
<Button
  mode="contained"
  buttonColor={theme.colors.primary}
  textColor="#FFFFFF"
  onPress={handlePress}
>
  Start Round
</Button>
```

**Theme Provider in Screens**:
```typescript
import { useTheme } from 'react-native-paper';

export function MyScreen() {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.primary }}>Tempo Golf</Text>
    </View>
  );
}
```

---

## Development Environment Setup

### Prerequisites
- **macOS**: 12.0+
- **Node.js**: 20.x LTS
- **npm**: 10.x+
- **Xcode**: 15.0+ (for iOS)
- **Android Studio**: Latest (for Android)
- **Git**: 2.40+

### 1. Clone Repository
```bash
git clone https://github.com/[your-org]/tempoapp.git
cd tempoapp
```

### 2. Install Dependencies

**Frontend**:
```bash
cd frontend
npm install

# React Native core + paper design
npm install react-native-paper react-native-vector-icons

# Maps & location
npm install react-native react-native-maps react-native-vision-camera
npm install react-native-geolocation-service @react-native-community/geolocation

# AR & animations
npm install react-native-reanimated react-native-worklets-core

# Storage & state
npm install react-native-keychain # Secure token storage
npm install zustand # State management (or redux)
npm install @react-native-async-storage/async-storage

# Networking & utilities
npm install axios # HTTP client
npm install expo-sqlite # Local database
npm install react-native-sensors # Compass, accelerometer, gyroscope
```

**Backend**:
```bash
cd ../backend
npm install

# Server & API
npm install express fastify
npm install cors helmet # Security middleware

# Database & ORM
npm install prisma @prisma/client
npm install @supabase/supabase-js

# Authentication & security
npm install bcrypt jsonwebtoken
npm install express-rate-limit
npm install dotenv zod # ENV validation + validation schema

# Error tracking & monitoring
npm install sentry-node
npm install pino # JSON logging

# Optional: Redis for caching
npm install redis ioredis
```

---

## Golf Course API Integration

### Overview
Tempo uses the **Golf Course API** (https://api.golfcourseapi.com/) to fetch real course data without building a full database.

**API Key**: `UD6VS23ZHZYXDNGITWYDLJ5KXU`  
**Base URL**: `https://api.golfcourseapi.com`  
**Documentation**: https://api.golfcourseapi.com/docs/api/

### Key Endpoints

**Search Courses**
```
GET /courses/search?q={query}&key={API_KEY}

Example:
GET https://api.golfcourseapi.com/courses/search?q=pebble%20beach&key=UD6VS23ZHZYXDNGITWYDLJ5KXU

Response:
{
  "courses": [
    {
      "id": "12345",
      "name": "Pebble Beach Golf Links",
      "city": "Pebble Beach",
      "state": "CA",
      "country": "USA",
      "holes": 18,
      "par": 72,
      "handicap": 2.0,
      "lat": 36.5622,
      "lon": -121.9489,
      "website": "https://...",
      "logo": "https://..."
    }
  ]
}
```

**Get Course Details**
```
GET /courses/{id}?key={API_KEY}

Returns: Full course info with holes, tee types, yardages
```

**Get Holes**
```
GET /courses/{id}/holes?key={API_KEY}

Returns:
{
  "holes": [
    {
      "number": 1,
      "par": 4,
      "handicap": 7,
      "tees": {
        "blue": 415,
        "white": 380,
        "red": 340
      }
    },
    ...
  ]
}
```

### Backend Implementation

**Service** (`backend/src/services/golfCourseApi.ts`):
```typescript
import axios from 'axios';

const GOLF_API_BASE = 'https://api.golfcourseapi.com';
const GOLF_API_KEY = process.env.GOLF_COURSE_API_KEY;

export async function searchCourses(query: string) {
  try {
    const response = await axios.get(`${GOLF_API_BASE}/courses/search`, {
      params: { q: query, key: GOLF_API_KEY },
      timeout: 5000
    });
    return response.data.courses || [];
  } catch (error) {
    console.error('Golf API search error:', error);
    return [];
  }
}

export async function getCourseDetails(courseId: string) {
  const response = await axios.get(`${GOLF_API_BASE}/courses/${courseId}`, {
    params: { key: GOLF_API_KEY }
  });
  return response.data;
}

export async function getCourseHoles(courseId: string) {
  const response = await axios.get(`${GOLF_API_BASE}/courses/${courseId}/holes`, {
    params: { key: GOLF_API_KEY }
  });
  return response.data.holes;
}
```

**API Route** (`backend/src/routes/courses.ts`):
```typescript
import { Router } from 'express';
import { searchCourses, getCourseDetails } from '@services/golfCourseApi';
import prisma from '@services/prisma';

const router = Router();

// Search courses (Golf API + local database)
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  // Search Golf API
  const externalCourses = await searchCourses(q as string);
  
  // Also search local courses (user-added tee boxes)
  const localCourses = await prisma.courses.findMany({
    where: {
      name: { contains: q as string, mode: 'insensitive' }
    },
    include: { tee_markers: true }
  });
  
  // Merge results (external + local)
  res.json({
    courses: [...externalCourses, ...localCourses]
  });
});

// Get course details
router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params;
  
  // Check local database first
  let course = await prisma.courses.findUnique({
    where: { external_id: courseId },
    include: { tee_markers: true }
  });
  
  // If not local, fetch from Golf API
  if (!course) {
    const golfApiData = await getCourseDetails(courseId);
    course = golfApiData;
  }
  
  res.json(course);
});
```

### Frontend Integration

**Hook** (`frontend/src/hooks/useCourseSearch.ts`):
```typescript
import { useState } from 'react';
import api from '@services/api';

export function useCourseSearch() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setCourses([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get('/courses/search', {
        params: { q: query }
      });
      setCourses(response.data.courses);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, search };
}
```

**Usage** (`frontend/src/screens/CourseSelectionScreen.tsx`):
```typescript
import { useCourseSearch } from '@hooks/useCourseSearch';
import { Searchbar, ActivityIndicator, Card } from 'react-native-paper';
import { FlatList, View } from 'react-native';

export function CourseSelectionScreen({ onSelectCourse }) {
  const { courses, loading, search } = useCourseSearch();
  const [query, setQuery] = useState('');

  return (
    <View style={{ flex: 1 }}>
      <Searchbar
        placeholder="Search courses..."
        onChangeText={(text) => {
          setQuery(text);
          search(text);
        }}
        value={query}
      />
      
      {loading && <ActivityIndicator animating={true} />}
      
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            onPress={() => onSelectCourse(item)}
            style={{ margin: 8 }}
          >
            <Card.Title
              title={item.name}
              subtitle={`${item.city}, ${item.state}`}
            />
            <Card.Content>
              <Text>Par {item.par} | {item.holes} holes</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
```

### Tee Box Handling (MVP Strategy)

Golf Course API provides **hole yardages** but **NOT tee box coordinates**. For MVP:

**Phase 0 (MVP - Testing)**:
1. User selects course from Golf API
2. Opens AR camera for that course
3. Manually places virtual pin at actual tee location
4. Coordinates + tee type auto-save to `tee_markers` table
5. Next round: Fetch saved tee positions from database

**Implementation** (`frontend/src/screens/ARCameraScreen.tsx`):
```typescript
const handleTeePlacement = async (courseId: string, holeNumber: number, teeType: string, coords: LatLng) => {
  // Save to backend
  await api.post('/tee-markers', {
    course_id: courseId,
    hole_number: holeNumber,
    tee_type: teeType,
    latitude: coords.lat,
    longitude: coords.lng
  });
  
  // Show confirmation
  showToast('Tee position saved!');
};
```

**API Endpoint** (`backend/src/routes/courses.ts`):
```typescript
// POST /tee-markers (save tee location)
router.post('/tee-markers', authMiddleware, async (req, res) => {
  const { course_id, hole_number, tee_type, latitude, longitude } = req.body;
  
  const marker = await prisma.tee_markers.upsert({
    where: {
      // Unique: one tee type per hole per course
      course_id_hole_number_tee_type: { course_id, hole_number, tee_type }
    },
    create: {
      course_id,
      hole_number,
      tee_type,
      latitude,
      longitude,
      created_by: req.userId // Track who added it
    },
    update: {
      latitude,
      longitude,
      updated_at: new Date()
    }
  });
  
  res.json(marker);
});
```

**Future (Phase 2+)**:
- Community verification: Other users confirm tee positions
- Public database: Share tee boxes across all users
- ML confidence: Automatic tee detection from course data

---

### 3. Environment Configuration

**Frontend** (`frontend/.env`):
```bash
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_SUPABASE_URL=https://[project].supabase.co
REACT_APP_SUPABASE_ANON_KEY=[your-anon-key]
REACT_APP_GOOGLE_CLIENT_ID=[your-google-client-id]
```

**Backend** (`backend/.env`):
```bash
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[your-service-key]

# Database (if local PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/tempo

# Auth
JWT_SECRET=your-random-secret-key-here
JWT_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# Google OAuth
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]

# Third-party APIs
WEATHER_API_KEY=[openweathermap-api-key]
STRIPE_SECRET_KEY=[stripe-secret]

# Monitoring
SENTRY_DSN=[sentry-dsn]
```

### 4. Database Setup

**Initialize Supabase Project**:
```bash
# If using Supabase hosting (recommended)
# Go to supabase.com, create project, note URL and keys

# If using local PostgreSQL
brew install postgresql
brew services start postgresql
createdb tempo_dev
```

**Migrate Schema**:
```bash
cd backend
npx prisma migrate dev --name init

# This reads schema from docs/architecture/DATABASE_SCHEMA.md
# and creates tables in Supabase/PostgreSQL
```

---

## Frontend Development

### Start Development Server
```bash
cd frontend

# iOS
npx react-native run-ios

# Android
npx react-native run-android

# Watch mode (Metro bundler)
npx react-native start
```

### Project Structure Details

**screens/**: Full-screen components
- `HomeScreen.tsx`: Dashboard (recent rounds, upcoming courses)
- `PlayScreen.tsx`: Active round (course + hole selection)
- `ARCameraScreen.tsx`: AR view with distance overlay
- `CourseMapScreen.tsx`: Course map with hole layout
- `ScorecardScreen.tsx`: Score entry for hole
- `StatsScreen.tsx`: User statistics (GIR %, stroke avg, etc.)
- `PracticeScreen.tsx`: Practice sessions + drill recommendations
- `SettingsScreen.tsx`: User profile, auth, preferences

**components/**:
- `Navigation/BottomTabNavigator.tsx`: Tab bar (Play, Home, Stats, Practice, Settings)
- `UI/Button.tsx, Text.tsx, etc.`: Reusable design components
- `AR/DistanceOverlay.tsx`: AR distance display
- `AR/SlopeDetector.tsx`: Phase 1+ slope detection

**hooks/**:
- `useAuth.ts`: Auth state + login/logout
- `useLocationTracking.ts`: GPS updates during round
- `useARCamera.ts`: AR camera state + frame processing

**services/**:
- `api.ts`: Axios client with auth headers
- `database.ts`: Local SQLite queries
- `geolocation.ts`: GPS tracking logic

**store/**:
- Redux or Zustand for global state (rounds, user profile, settings)

### TypeScript Configuration

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-native",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"],
      "@screens/*": ["./src/screens/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

---

## Backend Development

### Start Development Server
```bash
cd backend
npm run dev

# Runs on http://localhost:3000
# Auto-restarts on file changes
```

**package.json scripts**:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

### API Development

**Route Structure** (`src/routes/rounds.ts`):
```typescript
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/rounds
router.post('/', authMiddleware, async (req, res) => {
  // Create new round
  // See docs/api/ENDPOINTS.md for full spec
});

// GET /api/rounds/:id
router.get('/:id', authMiddleware, async (req, res) => {
  // Fetch round details
});

export default router;
```

### Database Queries with Prisma

```typescript
// Create round
const round = await prisma.rounds.create({
  data: {
    user_id: req.userId,
    course_id: req.body.course_id,
    tee_type: req.body.tee_type,
    started_at: new Date(),
    weather: req.body.weather
  }
});

// Fetch user's rounds (last 10)
const rounds = await prisma.rounds.findMany({
  where: { user_id: req.userId },
  orderBy: { started_at: 'desc' },
  take: 10
});

// Update shot
const shot = await prisma.shots.update({
  where: { id: shotId },
  data: { distance_yards: 185 }
});
```

---

## Testing

### Frontend Unit Tests
```bash
cd frontend
npm test

# Jest config in package.json
# Test files: __tests__/**/*.test.ts(x)
```

**Example test** (`__tests__/distanceOverlay.test.tsx`):
```typescript
import { render, screen } from '@testing-library/react-native';
import { DistanceOverlay } from '@components/AR/DistanceOverlay';

test('displays flag distance', () => {
  render(<DistanceOverlay distance={185} />);
  expect(screen.getByText('185y')).toBeOnTheScreen();
});
```

### Backend Unit Tests
```bash
cd backend
npm test

# Jest config in package.json
```

**Example test** (`src/routes/__tests__/rounds.test.ts`):
```typescript
describe('POST /rounds', () => {
  test('creates new round for authenticated user', async () => {
    const res = await request(app)
      .post('/api/rounds')
      .set('Authorization', `Bearer ${token}`)
      .send({
        course_id: '123',
        tee_type: 'blue'
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

### E2E Tests
```bash
cd frontend
npm run test:e2e

# Detox for React Native E2E testing
```

---

## CI/CD Pipeline

### GitHub Actions

**.github/workflows/backend-ci.yml**:
```yaml
name: Backend CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: cd backend && npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

**.github/workflows/frontend-ci.yml**:
```yaml
name: Frontend CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: cd frontend && npm install
      - run: npm run lint
      - run: npm test
      # iOS build test
      - run: |
          cd ios
          pod install
          xcodebuild -workspace Tempo.xcworkspace -scheme Tempo
```

---

## Deployment

### Development Environment
- **Backend**: Localhost:3000 or local Supabase
- **Frontend**: iOS Simulator / Android Emulator
- **Database**: Local PostgreSQL or Supabase dev instance

### Staging Environment
- **Backend**: Vercel (staging URL)
- **Frontend**: TestFlight (iOS) / Google Play Internal Testing (Android)
- **Database**: Supabase staging project

### Production Environment
- **Backend**: Vercel production
- **Frontend**: App Store (iOS) / Google Play (Android)
- **Database**: Supabase production

**Deployment Steps**:
```bash
# Backend to Vercel
cd backend
vercel deploy --prod

# Frontend to App Store
cd frontend
npm run build:ios
xcode-select --install
xcodebuild archive -workspace ios/Tempo.xcworkspace -scheme Tempo

# Then upload to App Store Connect
```

---

## Code Style & Linting

### ESLint Configuration
```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-types": "warn"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Pre-commit Hooks
```bash
# Install husky
npm install husky --save-dev
npx husky install

# Add hook: lint staged files
npx husky add .husky/pre-commit "npm run lint-staged"
```

---

## Development Workflow

### Branch Strategy
```
main (production)
  ↑
staging (staging deploys)
  ↑
develop (integration branch)
  ↑
feature/[feature-name] (individual features)
bugfix/[bug-name] (bug fixes)
```

### Creating a Feature
```bash
# 1. Create branch from develop
git checkout develop
git pull
git checkout -b feature/ar-camera

# 2. Make changes, commit
git add src/screens/ARCameraScreen.tsx
git commit -m "feat: add AR camera with distance overlay"

# 3. Push and open PR
git push origin feature/ar-camera

# Then on GitHub:
# - Create Pull Request to develop
# - Request review
# - Once approved, merge
```

### Pull Request Template
```markdown
## Description
What does this PR do?

## Related Issue
Closes #123

## Testing
How was this tested?

## Screenshots
(If UI changes)

## Checklist
- [ ] Tests pass
- [ ] Code follows style guide
- [ ] Documentation updated
- [ ] No breaking changes
```

---

## Troubleshooting

### Common Issues

**React Native Build Fails**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start -- --reset-cache
```

**Xcode Build Error**
```bash
# Clean Xcode build folder
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

**Supabase Connection Error**
```bash
# Check URL and keys in .env
# Verify Supabase project is active in console
# Test connection from backend:
npm run dev
curl http://localhost:3000/health
```

---

## Performance Monitoring

### Frontend Performance
- **Lighthouse**: Run in browser DevTools
- **React Profiler**: Built into React DevTools
- **Flipper**: Debugging tool for React Native

### Backend Performance
- **New Relic**: APM monitoring
- **Sentry**: Error tracking
- **CloudWatch**: AWS monitoring

---

## Documentation Maintenance

- Update docs/ folder when features change
- Keep TECHNICAL_ARCHITECTURE.md in sync with actual tech stack
- Update DATABASE_SCHEMA.md when adding tables
- Add new endpoints to docs/api/ENDPOINTS.md

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on:
- Code review process
- Commit message format
- Documentation requirements
- Release process

---

**Last Updated**: December 6, 2025  
**Version**: MVP-SETUP-1.0  
**Maintainers**: Lex Ferguson, Chris Buzziad
