# Tempo - Technical Architecture & Implementation Guide

## Tech Stack

### Frontend (React Native)
- **Framework**: React Native (Bare, not Expo initially)
  - iOS: Native iOS modules via CocoaPods
  - Android: Native Android modules via Gradle
- **State Management**: Redux Toolkit or Context API + Zustand
- **Navigation**: React Navigation v5+
- **UI Components**: Custom + React Native Paper / NativeBase
- **HTTP Client**: Axios or Fetch API
- **Maps**: React Native Maps (Google Maps iOS/Android)
- **Camera**: React Native Vision Camera (for AR capability)
- **AR**: 
  - iOS: ARKit (native via bridge)
  - Android: ARCore (native via bridge)
- **GPS/Location**: React Native Geolocation
- **Offline Storage**: SQLite (via react-native-sqlite-storage) + AsyncStorage

### Backend (Node.js)
- **Runtime**: Node.js 20+
- **Framework**: Express.js or Fastify
- **ORM**: Prisma (for Supabase PostgreSQL)
- **Authentication**: Supabase Auth (JWT)
- **Database**: Supabase PostgreSQL
- **File Storage**: Supabase Storage (course photos, etc.)
- **Caching**: Redis (optional, for hot data)
- **Real-time**: Supabase Realtime subscriptions
- **Task Queue**: Bull or pg-boss (for async drill generation)

### AI/ML
- **Practice Drill Generation**: Ollama (self-hosted) or Hugging Face Inference API
  - Model: TinyLlama or Mistral 7B (golf-specific fine-tuned)
  - Alternative: OpenAI API (if cost permits)
- **On-Device ML** (AR features Phase 1):
  - TensorFlow Lite for lie detection, hazard detection
  - Models: MobileNetV2 (transfer learning from open golf datasets)
- **Backend Inference**: Python FastAPI + TensorFlow/PyTorch (future)

### Infrastructure
- **Hosting**: Vercel (backend API), AWS or Railway (alternative)
- **Database Hosting**: Supabase (PostgreSQL + Auth)
- **CDN**: Supabase Storage + CloudFlare
- **Monitoring**: Sentry (errors), LogRocket (session replay)
- **Analytics**: Mixpanel or PostHog

### Development Tools
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions (build iOS/Android, run tests)
- **Testing**: Jest (unit), Detox (e2e), Appium (device tests)
- **Code Quality**: ESLint, Prettier, SonarQube
- **Secrets Management**: GitHub Secrets + dotenv

---

## Phase 0 MVP Architecture

### Frontend Flow
```
Home Tab
├── Dashboard (Recent Rounds, Trends)
└── "Start Round" button

Play Tab (Main)
├── Course Selection
│   ├── GPS Auto-Detect
│   ├── Search
│   └── Save favorites
├── Course Options Screen
│   ├── Round Type (9/18 holes)
│   ├── Scoring Method (Stroke, Match)
│   ├── Tee Selection (Blue/White/Red)
│   └── AI Strategy Profile
├── GPS Map Screen
│   ├── Hole Navigation (prev/next)
│   ├── Yardages (Front/Center/Back)
│   ├── Hazards overlay
│   ├── Compass + Wind
│   ├── Player location dot
│   ├── Shot history on map
│   └── [Camera Button] (top-right)
├── Camera Lite (Sidebar hidden for MVP core)
│   └── Live feed + basic overlays
└── End of Round Recap
    ├── Scorecard
    ├── AI Coach Insights
    └── Share/Save

Stats Tab
├── Round History (filterable)
├── Scorecard Viewer
└── Trends Snapshot

Practice Tab
├── Range Mode
│   ├── Club selector
│   ├── Distance logger
│   └── Avg calculation
└── (Drill Library - Phase 1)

Settings Tab
├── Profile (Handicap, Name)
├── Bag Setup (Clubs + yardages)
├── Auth Settings
└── Preferences
```

### Backend API Structure
```
/api
├── /auth
│   ├── POST /register (email/google)
│   ├── POST /login
│   ├── POST /logout
│   └── POST /refresh-token
├── /courses
│   ├── GET / (search, filter, paginate)
│   ├── GET /:id (course details)
│   ├── POST /:id/tee-markers (save tee coords)
│   └── GET /:id/tee-markers (fetch for course)
├── /rounds
│   ├── POST / (create new round)
│   ├── GET / (user's rounds)
│   ├── GET /:id (round details)
│   ├── PUT /:id (update round)
│   └── POST /:id/shots (log shot)
├── /users
│   ├── GET /me (current user)
│   ├── PUT /me (update profile)
│   ├── PUT /me/bag (update clubs)
│   └── GET /me/stats (user stats)
├── /ai
│   ├── POST /drill-recommendation (generate drill)
│   └── GET /drills/:roundId (fetch drills for round)
└── /weather
    └── GET /:lat/:lng (weather at location)
```

### Data Models (Supabase PostgreSQL)

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  auth_id UUID REFERENCES auth.users(id),
  first_name VARCHAR,
  last_name VARCHAR,
  handicap_index FLOAT DEFAULT 0,
  profile_photo_url TEXT,
  preferred_tees VARCHAR DEFAULT 'white', -- blue, white, red
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### User Bag Setup
```sql
CREATE TABLE user_bags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_type VARCHAR NOT NULL, -- driver, 3w, 5w, 2i, 3i, 4i, 5i, 6i, 7i, 8i, 9i, pw, sw, lw, putter
  carry_distance INT,
  club_name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Courses
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  location VARCHAR,
  city VARCHAR,
  state VARCHAR,
  country VARCHAR,
  latitude FLOAT,
  longitude FLOAT,
  holes INT DEFAULT 18,
  par INT,
  handicap INT,
  slope INT,
  course_rating FLOAT,
  photo_url TEXT,
  external_id VARCHAR, -- Limitless API ID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tee Markers (AUTO-SAVE FROM FIELD)
```sql
CREATE TABLE tee_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  hole_number INT NOT NULL, -- 1-18
  tee_type VARCHAR NOT NULL, -- blue, white, red, black
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  yards INT,
  handicap INT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, hole_number, tee_type)
);
```

#### Rounds
```sql
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  date_played TIMESTAMP DEFAULT NOW(),
  gross_score INT,
  net_score INT,
  handicap_at_play FLOAT,
  holes_played INT DEFAULT 18,
  scoring_method VARCHAR DEFAULT 'stroke', -- stroke, match
  tee_type VARCHAR, -- blue, white, red
  weather_conditions JSONB, -- { temp, wind_speed, wind_direction, humidity }
  ai_strategy_profile VARCHAR, -- conservative, balanced, aggressive
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Shots
```sql
CREATE TABLE shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INT,
  shot_sequence INT, -- 1 = tee, 2 = approach, 3 = chip, 4+ = extra
  club_used VARCHAR,
  start_latitude FLOAT,
  start_longitude FLOAT,
  end_latitude FLOAT,
  end_longitude FLOAT,
  distance_yards INT,
  shot_type VARCHAR, -- full, approach, pitch, chip, putt
  penalty INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Scores (Per-Hole Results)
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INT,
  par INT,
  score INT,
  putts INT,
  fir BOOLEAN, -- fairway in regulation
  gir BOOLEAN, -- green in regulation
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Practice Sessions
```sql
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR, -- range, chipping, putting
  club_used VARCHAR,
  shots_count INT,
  avg_distance INT,
  location VARCHAR, -- "virtual_range" or course name
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Priority (MVP Phase 0)

### Week 1-2: Foundation
- [ ] Supabase setup (auth, DB schema, storage)
- [ ] React Native project scaffold (bare, iOS primary)
- [ ] Navigation structure (Tab Navigator)
- [ ] Auth flow (login/signup + OAuth Google)

### Week 3-4: Core Play Experience
- [ ] GPS map integration (React Native Maps)
- [ ] Course API integration (Limitless)
- [ ] Course search + selection
- [ ] GPS tracking + hole advancement

### Week 5-6: Gameplay
- [ ] Shot tracking (tap to log)
- [ ] Score entry modal
- [ ] Round saving to DB
- [ ] Basic stats aggregation

### Week 7-8: Camera & Polish
- [ ] Camera Lite integration (vision-camera)
- [ ] Distance overlay (static for MVP)
- [ ] Wind indicator
- [ ] End of round recap

### Week 9-10: Testing & Refinement
- [ ] Beta testing with one course
- [ ] Tee marker field marking + auto-save
- [ ] Bug fixes + optimization
- [ ] Android port begins

---

## Tee Marker Field Implementation

### User Flow (Testing Phase)
1. Dev/Tester opens Play tab
2. Selects course
3. Navigates to hole
4. **[New] "Mark Tee" button appears in course options or map**
5. User selects tee type (Blue/White/Red/Black)
6. User taps hole location on map to place marker
7. **AUTO-SAVE: GPS coords + tee type + hole # sent to DB**
8. Confirmation toast: "Tee marker saved"
9. Next time any user plays this course, tees pre-populate

### Backend Endpoint
```javascript
POST /api/courses/:courseId/tee-markers
{
  hole_number: 12,
  tee_type: "white",
  latitude: 32.7157,
  longitude: -117.2564,
  yards: 394,
  handicap: 14
}
Response: { id, created_at, ... }
```

### Frontend Logic
```javascript
// When user places marker:
const saveTeeMarker = async (courseId, holeNum, teeType, coords) => {
  try {
    await API.post(`/courses/${courseId}/tee-markers`, {
      hole_number: holeNum,
      tee_type: teeType,
      latitude: coords.lat,
      longitude: coords.lng,
      yards: estimatedYards // optional
    });
    showToast("✅ Tee marker saved!");
  } catch (err) {
    showToast("❌ Failed to save. Try again.");
  }
};
```

---

## AR Camera Implementation (MVP -> Phase 1)

### MVP (Phase 0)
- Camera feed with safety frame overlay
- "Point camera at green to see slope" text teaser
- Sidebar closes; camera off-screen

### Phase 1 (Premium)
**Slope Detection**
1. User opens Camera Lite via sidebar
2. Points phone at uphill/downhill green
3. ARKit/ARCore detects plane geometry
4. Accelerometer measures device tilt
5. Calculate: Rise/Run = slope percentage
6. Overlay arrows (↑ uphill, ↓ downhill)

**Lie Detection (TensorFlow Lite)**
1. User points at ball area
2. Real-time image captured
3. TFLite model (MobileNetV2) classifies: fairway/rough/sand/fringe
4. Confidence score + overlay label

**Hazard Recognition (YOLO Nano)**
1. Full frame analysis
2. Detect: water (blue), bunkers (tan), trees (green)
3. Bounding boxes + distance estimates
4. Distance calculated: ARCore plane + GPS fallback

---

## Security Considerations (Phase 0)

### Authentication
- Email/Google OAuth via Supabase Auth
- JWT tokens (auto-refresh, 1hr expiry)
- Secure token storage (React Native keychain)

### Data Privacy
- All data encrypted in transit (HTTPS/TLS)
- User data isolated by user_id in DB
- Course data public (read-only for free users)
- Tee markers are course-level, not user-specific

### API Security
- Rate limiting: 100 req/min per user
- CORS enabled for mobile apps only
- Input validation on all endpoints
- SQL injection prevention (Prisma ORM)

### Device Security
- Camera access permissions (iOS Info.plist, Android Manifest)
- Location permissions (always ask in-app)
- Offline data: SQLite unencrypted (standard for MVP)

---

## Testing Strategy (Phase 0)

### Unit Tests
- Score calculation logic
- Strokes gained calculations
- Bag setup CRUD operations

### Integration Tests
- Auth flow (signup, login, logout)
- Round creation + shot logging
- Tee marker save flow

### E2E Tests (Detox)
- Full round play (select course → log shots → end round)
- Stats viewing
- Settings updates

### Manual Testing
- One course (Torrey Pines?) with all 18 holes mapped
- Beta testers on iOS device
- AR camera on iPhone 12 Pro+ (LiDAR device)

---

## Deployment Strategy

### Development
- Main branch: development
- Feature branches: feature/feature-name
- GitHub Actions: Lint + Unit tests on PR

### Staging
- Build iOS + Android apps
- Deploy backend to staging Supabase
- TestFlight (iOS) + Internal Testing (Android)

### Production
- Merge to main + tag release
- Build signed iOS + Android
- Deploy backend (zero-downtime)
- Release to App Store + Play Store

---

## Performance Targets (MVP)
- App startup: < 3 seconds
- Map load: < 2 seconds
- GPS accuracy: ±10 meters
- AR frame rate: 30+ FPS (iPhone 12+)
- API response: < 500ms (p95)

---

**Last Updated**: December 6, 2025  
**Version**: MVP-TECHNICAL-1.0
