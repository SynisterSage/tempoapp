-- Migration: Create user bags table
-- Date: 2025-12-06
-- Description: User's golf club setup and yardages

CREATE TABLE user_bags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bag_name VARCHAR(100) DEFAULT 'My Bag',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_user_bags_user_id ON user_bags(user_id);
CREATE INDEX idx_user_bags_is_active ON user_bags(is_active);
