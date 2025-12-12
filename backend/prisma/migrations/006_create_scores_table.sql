-- Migration: Create scores table
-- Date: 2025-12-06
-- Description: Per-hole scores and statistics

CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL, -- 1-18
  par INTEGER,
  strokes INTEGER,
  putts INTEGER,
  fairway_hit BOOLEAN,
  green_in_regulation BOOLEAN,
  up_and_down BOOLEAN, -- Chipped or pitched in from off green in 2 shots or less
  score_type VARCHAR(50), -- 'birdie', 'eagle', 'bogey', 'par', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one score per hole per round
  UNIQUE(round_id, hole_number)
);

-- Indexes
CREATE INDEX idx_scores_round_id ON scores(round_id);
CREATE INDEX idx_scores_hole_number ON scores(hole_number);
CREATE INDEX idx_scores_score_type ON scores(score_type);
