-- Migration: Create clubs table
-- Date: 2025-12-06
-- Description: Individual clubs in a user's bag with yardage data

CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_bag_id UUID NOT NULL REFERENCES user_bags(id) ON DELETE CASCADE,
  club_type VARCHAR(50), -- 'driver', 'wood_3', 'hybrid', 'iron_3', 'iron_4', ... 'iron_9', 'pw', 'gw', 'sw', 'lw'
  club_name VARCHAR(100),
  average_distance_yards DECIMAL(8, 2),
  carry_distance_yards DECIMAL(8, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_clubs_user_bag_id ON clubs(user_bag_id);
CREATE INDEX idx_clubs_club_type ON clubs(club_type);
