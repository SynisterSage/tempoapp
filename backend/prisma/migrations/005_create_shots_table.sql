-- Migration: Create shots table
-- Date: 2025-12-06
-- Description: Individual shots within a round

CREATE TABLE shots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round_id UUID NOT NULL REFERENCES rounds(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL, -- 1-18
  shot_number INTEGER NOT NULL, -- 1st shot, 2nd shot, etc.
  club_used VARCHAR(50), -- 'driver', 'irons_5', 'putter', etc.
  distance_yards DECIMAL(8, 2),
  start_latitude DECIMAL(10, 8), -- Where shot started (GPS)
  start_longitude DECIMAL(11, 8),
  end_latitude DECIMAL(10, 8), -- Where shot ended (GPS)
  end_longitude DECIMAL(11, 8),
  shot_type VARCHAR(50), -- 'tee', 'approach', 'chip', 'putt', etc.
  result VARCHAR(50), -- 'fairway', 'rough', 'bunker', 'water', 'green', etc.
  lie_detected VARCHAR(50), -- From AI: 'fairway', 'rough', 'bunker', 'water'
  slope_detected DECIMAL(5, 2), -- Slope in degrees (from ARKit Phase 1+)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_shots_round_id ON shots(round_id);
CREATE INDEX idx_shots_hole_number ON shots(hole_number);
CREATE INDEX idx_shots_shot_number ON shots(shot_number);
CREATE INDEX idx_shots_club_used ON shots(club_used);
