-- Migration: Create rounds table
-- Date: 2025-12-06
-- Description: Create rounds (18-hole games) table

CREATE TABLE rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id),
  tee_type VARCHAR(20), -- 'blue', 'white', 'red', etc.
  started_at TIMESTAMP NOT NULL,
  finished_at TIMESTAMP,
  gross_score INTEGER, -- Total strokes
  net_score INTEGER, -- Gross - handicap strokes
  is_complete BOOLEAN DEFAULT FALSE,
  
  -- Weather conditions
  weather_condition VARCHAR(50), -- 'sunny', 'cloudy', 'rainy', etc.
  temperature_fahrenheit INTEGER,
  wind_speed_mph DECIMAL(5, 2),
  wind_direction VARCHAR(20), -- 'N', 'NE', 'E', etc.
  
  -- Statistics
  putts INTEGER,
  fairways_hit INTEGER,
  greens_in_regulation INTEGER, -- GIR
  birdies INTEGER,
  eagles INTEGER,
  bogeys INTEGER,
  double_bogeys_or_worse INTEGER,
  
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_rounds_user_id ON rounds(user_id);
CREATE INDEX idx_rounds_course_id ON rounds(course_id);
CREATE INDEX idx_rounds_started_at ON rounds(started_at);
CREATE INDEX idx_rounds_user_course ON rounds(user_id, course_id);
CREATE INDEX idx_rounds_is_complete ON rounds(is_complete);
