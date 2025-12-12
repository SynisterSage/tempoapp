-- Migration: Create tee markers table
-- Date: 2025-12-06
-- Description: Store tee box locations for each course/hole
-- This is critical for MVP field testing - allows users to mark tee positions

CREATE TABLE tee_markers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL, -- 1-18
  tee_type VARCHAR(20) NOT NULL, -- 'blue', 'white', 'red', 'black', 'gold', etc.
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  distance_yards INTEGER, -- Distance from tee to hole center
  distance_meters INTEGER, -- Converted from distance_yards
  handicap_index INTEGER, -- Hole handicap for this tee
  par INTEGER,
  created_by UUID REFERENCES users(id), -- User who added this marker (for field testing tracking)
  verified BOOLEAN DEFAULT FALSE,
  verification_count INTEGER DEFAULT 0, -- Number of users who confirmed this marker
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure only one tee type per hole per course
  UNIQUE(course_id, hole_number, tee_type)
);

-- Indexes
CREATE INDEX idx_tee_markers_course_hole ON tee_markers(course_id, hole_number);
CREATE INDEX idx_tee_markers_tee_type ON tee_markers(tee_type);
CREATE INDEX idx_tee_markers_created_by ON tee_markers(created_by);
CREATE INDEX idx_tee_markers_verified ON tee_markers(verified);
