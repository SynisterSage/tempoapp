-- Migration: Create courses table
-- Date: 2025-12-06
-- Description: Create courses table for golf course information

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255), -- Golf Course API ID
  name VARCHAR(255) NOT NULL,
  location_city VARCHAR(100),
  location_state VARCHAR(50),
  location_country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  holes_count INTEGER DEFAULT 18,
  par INTEGER,
  handicap_index DECIMAL(5, 1),
  architect VARCHAR(255),
  year_opened INTEGER,
  description TEXT,
  website_url TEXT,
  phone_number VARCHAR(20),
  logo_url TEXT,
  course_image_url TEXT,
  difficulty_rating DECIMAL(5, 2),
  slope_rating INTEGER,
  is_public BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_courses_name ON courses(name);
CREATE INDEX idx_courses_location ON courses(location_city, location_state);
CREATE INDEX idx_courses_external_id ON courses(external_id);
CREATE INDEX idx_courses_coordinates ON courses(latitude, longitude);
