# Tempo - Database Schema

## Overview
PostgreSQL hosted on Supabase with real-time subscriptions enabled.

---

## Core Tables

### 1. `users`
Stores user profile and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  handicap_index FLOAT DEFAULT 0.0,
  profile_photo_url TEXT,
  preferred_tees VARCHAR(20) DEFAULT 'white', -- blue, white, red, black
  ai_caddy_personality VARCHAR(20) DEFAULT 'balanced', -- serious, balanced, fun, teaching
  is_premium BOOLEAN DEFAULT FALSE,
  subscription_tier VARCHAR(50), -- free, premium, pro (future)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_handicap CHECK (handicap_index >= -10 AND handicap_index <= 54)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

### 2. `user_bags`
Stores user's club setup with yardages.

```sql
CREATE TABLE user_bags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  club_type VARCHAR(50) NOT NULL, -- driver, 3w, 5w, 2i, 3i, 4i, 5i, 6i, 7i, 8i, 9i, pw, sw, lw, putter
  club_name VARCHAR(100), -- optional custom name
  carry_distance INT,
  total_distance INT, -- carry + roll
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_distance CHECK (carry_distance > 0 AND total_distance >= carry_distance)
);

CREATE INDEX idx_user_bags_user_id ON user_bags(user_id);
```

---

### 3. `courses`
Stores golf course data (from Limitless API + manual updates).

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(100),
  latitude FLOAT,
  longitude FLOAT,
  holes INT DEFAULT 18,
  par INT,
  handicap INT, -- course handicap for scratch golfer
  slope INT,
  course_rating FLOAT, -- difficulty rating
  photo_url TEXT,
  external_id VARCHAR(50), -- Limitless API ID
  is_verified BOOLEAN DEFAULT FALSE, -- verified by multiple testers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_coords CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
  CONSTRAINT valid_coords_lon CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
);

CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_external_id ON courses(external_id);
CREATE INDEX idx_courses_location ON courses(city, state);
```

---

### 4. `tee_markers`
**Critical for MVP**: Stores tee box coordinates per hole + tee type.
**AUTO-SAVE from field**: Devs/testers place markers in Play screen, instantly saves.

```sql
CREATE TABLE tee_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  hole_number INT NOT NULL, -- 1-18
  tee_type VARCHAR(20) NOT NULL, -- blue, white, red, black, etc.
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  yards INT, -- distance from tee to center of green (estimated)
  handicap INT, -- hole handicap for this tee
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(course_id, hole_number, tee_type),
  CONSTRAINT valid_hole CHECK (hole_number >= 1 AND hole_number <= 18),
  CONSTRAINT valid_coords CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_yards CHECK (yards > 0)
);

CREATE INDEX idx_tee_markers_course ON tee_markers(course_id);
CREATE INDEX idx_tee_markers_created_by ON tee_markers(created_by);
```

---

### 5. `rounds`
Stores completed golf rounds (18 holes = 1 round).

```sql
CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id),
  date_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  gross_score INT, -- total strokes
  net_score INT, -- gross - handicap strokes
  handicap_at_play FLOAT, -- user's handicap on date of play
  holes_played INT DEFAULT 18, -- 9 or 18
  scoring_method VARCHAR(50) DEFAULT 'stroke', -- stroke, match, scramble
  tee_type VARCHAR(20), -- blue, white, red, black
  weather_conditions JSONB, -- { temp_f, wind_mph, wind_direction, humidity }
  ai_strategy_profile VARCHAR(50), -- conservative, balanced, aggressive
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_score CHECK (gross_score > 0 AND gross_score <= 200)
);

CREATE INDEX idx_rounds_user_id ON rounds(user_id);
CREATE INDEX idx_rounds_course_id ON rounds(course_id);
CREATE INDEX idx_rounds_date_played ON rounds(date_played DESC);
```

---

### 6. `shots`
Individual shots logged during play (tee, approach, putt, etc.).

```sql
CREATE TABLE shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INT NOT NULL, -- 1-18
  shot_sequence INT NOT NULL, -- 1 = tee, 2 = second, 3 = third, etc.
  club_used VARCHAR(50), -- driver, 6i, pw, putter, etc.
  start_latitude FLOAT NOT NULL,
  start_longitude FLOAT NOT NULL,
  end_latitude FLOAT NOT NULL,
  end_longitude FLOAT NOT NULL,
  distance_yards INT,
  shot_type VARCHAR(50), -- full, approach, pitch, chip, putt, bump-and-run
  accuracy_score INT, -- 1-10 (optional, for training data)
  penalty INT DEFAULT 0, -- strokes (OB, water, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_coords_start CHECK (start_latitude >= -90 AND start_latitude <= 90),
  CONSTRAINT valid_coords_end CHECK (end_latitude >= -90 AND end_latitude <= 90)
);

CREATE INDEX idx_shots_round_id ON shots(round_id);
CREATE INDEX idx_shots_hole_number ON shots(round_id, hole_number);
```

---

### 7. `scores` (Per-Hole Results)
Summary of each hole's result (par, strokes, putts, FIR, GIR).

```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INT NOT NULL, -- 1-18
  par INT NOT NULL, -- 3, 4, 5
  score INT NOT NULL, -- strokes
  putts INT, -- number of putts
  fir BOOLEAN, -- fairway in regulation (hit fairway on par 4/5)
  gir BOOLEAN, -- green in regulation (on green in par - 2 strokes)
  penalties INT DEFAULT 0,
  
  UNIQUE(round_id, hole_number),
  CONSTRAINT valid_score CHECK (score > 0 AND score <= 20)
);

CREATE INDEX idx_scores_round_id ON scores(round_id);
```

---

### 8. `practice_sessions`
Tracks practice range sessions (not full rounds).

```sql
CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50) NOT NULL, -- range, chipping, putting, short_game
  club_used VARCHAR(50),
  shots_count INT,
  avg_carry_distance INT,
  avg_total_distance INT,
  location VARCHAR(200), -- course name or "virtual_range"
  duration_minutes INT, -- optional, user-estimated
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_created_at ON practice_sessions(created_at DESC);
```

---

### 9. `ai_drill_recommendations` (Phase 1+)
Stores ML-generated drills based on round analysis.

```sql
CREATE TABLE ai_drill_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drill_type VARCHAR(100), -- driving_accuracy, gir_improvement, putting, etc.
  title VARCHAR(200),
  description TEXT,
  duration_minutes INT,
  difficulty VARCHAR(50), -- beginner, intermediate, advanced
  instructions TEXT,
  expected_improvement TEXT, -- "improve GIR % by 5-10%"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 120)
);

CREATE INDEX idx_drills_user_id ON ai_drill_recommendations(user_id);
CREATE INDEX idx_drills_round_id ON ai_drill_recommendations(round_id);
```

---

### 10. `subscriptions` (Phase 1+)
Tracks user subscription status and payment.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_tier VARCHAR(50) NOT NULL, -- free, premium, pro
  status VARCHAR(50), -- active, cancelled, expired
  billing_cycle VARCHAR(20), -- monthly, annual
  amount_cents INT, -- price in cents (e.g., 999 = $9.99)
  currency VARCHAR(3) DEFAULT 'USD',
  external_id VARCHAR(100), -- Stripe/PayPal ID
  started_at TIMESTAMP,
  renews_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_renews_at ON subscriptions(renews_at);
```

---

## Computed Views (for Analytics)

### `user_round_stats`
```sql
CREATE VIEW user_round_stats AS
SELECT 
  r.user_id,
  COUNT(r.id) as total_rounds,
  AVG(r.gross_score) as avg_gross_score,
  AVG(r.net_score) as avg_net_score,
  ROUND(AVG(CAST(s.fir AS INT)) * 100, 1) as avg_fir_percent,
  ROUND(AVG(CAST(s.gir AS INT)) * 100, 1) as avg_gir_percent,
  AVG(s.putts) as avg_putts_per_hole,
  MAX(r.date_played) as last_round_date
FROM rounds r
LEFT JOIN scores s ON r.id = s.round_id
WHERE r.completed = TRUE
GROUP BY r.user_id;
```

### `course_difficulty`
```sql
CREATE VIEW course_difficulty AS
SELECT 
  c.id,
  c.name,
  COUNT(DISTINCT r.user_id) as players_count,
  AVG(r.gross_score) as avg_gross,
  STDDEV(r.gross_score) as score_variance
FROM courses c
LEFT JOIN rounds r ON c.id = r.course_id
WHERE r.completed = TRUE
GROUP BY c.id, c.name;
```

---

## Indexes Summary

| Table | Index | Purpose |
|-------|-------|---------|
| users | email | Auth lookups |
| users | created_at | User growth analytics |
| courses | name | Course search |
| courses | external_id | API sync |
| tee_markers | course_id | Load tees per course |
| rounds | user_id | User's round history |
| rounds | date_played | Recent first |
| shots | round_id | Shots per round |
| practice_sessions | user_id | User practice history |
| subscriptions | user_id | Premium status check |

---

## Row-Level Security (RLS) Policies

Enable RLS on sensitive tables:

```sql
-- Users can only see their own profile
CREATE POLICY "Users see own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only see their own rounds
CREATE POLICY "Users see own rounds" ON rounds
  FOR SELECT USING (auth.uid() = user_id);

-- Courses are publicly readable
CREATE POLICY "Courses are public" ON courses
  FOR SELECT USING (true);

-- Tee markers are publicly readable
CREATE POLICY "Tee markers are public" ON tee_markers
  FOR SELECT USING (true);
```

---

## Data Relationships Diagram

```
users (1) ──← (N) rounds
         └─← (N) user_bags
         └─← (N) practice_sessions
         └─← (N) tee_markers (created_by)
         └─1← subscriptions

rounds (1) ──← (N) shots
        └─← (N) scores
        └─← (N) ai_drill_recommendations

courses (1) ──← (N) tee_markers
         └─← (N) rounds

subscriptions (1) ──← (1) users
```

---

## MVP Data Flow (Round Play)

1. **Start Round**
   - Create `rounds` record
   - Fetch `tee_markers` for course + selected tee type
   - Display on map

2. **Log Shots**
   - Per shot: Create `shots` record with GPS coords
   - Update UI with shot path

3. **End Hole**
   - User enters score (strokes, putts)
   - Create `scores` record for hole

4. **End Round**
   - Mark round as completed
   - Calculate FIR, GIR from shots + scores
   - Generate AI insights (Phase 1+)
   - Display recap

5. **Persist to DB**
   - All data synced to Supabase via API

---

**Last Updated**: December 6, 2025  
**Version**: MVP-DB-1.0
