-- Migration: Create AI drill recommendations table
-- Date: 2025-12-06
-- Description: ML-generated drill recommendations based on user performance (Phase 1+)

CREATE TABLE ai_drill_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  drill_type VARCHAR(100), -- 'improve_iron_distance', 'short_game_accuracy', etc.
  drill_name VARCHAR(255),
  description TEXT,
  focus_club VARCHAR(50),
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  estimated_duration_minutes INTEGER,
  success_criteria TEXT, -- What constitutes completing the drill
  priority_score DECIMAL(5, 2), -- 0-100, higher = more important to work on
  reason_generated TEXT, -- Why this drill was recommended
  is_active BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_ai_recommendations_user_id ON ai_drill_recommendations(user_id);
CREATE INDEX idx_ai_recommendations_is_active ON ai_drill_recommendations(is_active);
CREATE INDEX idx_ai_recommendations_priority ON ai_drill_recommendations(priority_score DESC);
