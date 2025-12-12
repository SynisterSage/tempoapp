-- Migration: Create practice sessions table
-- Date: 2025-12-06
-- Description: Range and practice session tracking

CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type VARCHAR(50), -- 'range', 'short_game', 'putting', 'full_swing'
  location_name VARCHAR(255),
  started_at TIMESTAMP NOT NULL,
  finished_at TIMESTAMP,
  duration_minutes INTEGER,
  
  -- Drill information (Phase 1+)
  drill_type VARCHAR(50), -- 'iron_accuracy', 'short_game_distance', etc.
  focus_club VARCHAR(50),
  shots_attempted INTEGER,
  successful_shots INTEGER,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_practice_sessions_user_id ON practice_sessions(user_id);
CREATE INDEX idx_practice_sessions_started_at ON practice_sessions(started_at);
CREATE INDEX idx_practice_sessions_session_type ON practice_sessions(session_type);
