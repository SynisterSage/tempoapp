-- Migration: Create users table
-- Date: 2025-12-06
-- Description: Create base users table with profile information and preferences

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_picture_url TEXT,
  handicap DECIMAL(5, 1),
  handicap_updated_at TIMESTAMP,
  preferred_units VARCHAR(10) DEFAULT 'yards', -- 'yards' or 'meters'
  preferred_tee_type VARCHAR(20) DEFAULT 'blue', -- 'blue', 'white', 'red', 'black'
  bio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
