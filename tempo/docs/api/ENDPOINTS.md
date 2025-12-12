# Tempo - API Endpoints Documentation

**Base URL**: `https://api.tempo-golf.com` (production)  
**Auth Header**: `Authorization: Bearer {jwt_token}`  
**Content-Type**: `application/json`

---

## Authentication Endpoints

### `POST /auth/register`
Register a new user with email or Google OAuth.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe",
  "handicap_index": 12.5
}
```

**Response** (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "handicap_index": 12.5
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

---

### `POST /auth/login`
Login with email/password or Google OAuth.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200):
```json
{
  "user": { ... },
  "session": { ... }
}
```

---

### `POST /auth/logout`
Logout current user (invalidate refresh token).

**Response** (200):
```json
{
  "message": "Logged out successfully"
}
```

---

## Courses Endpoints

### `GET /courses`
Search and list golf courses.

**Query Params**:
- `search` (string): Course name or city
- `latitude` (float): User's lat for nearby results
- `longitude` (float): User's long for nearby results
- `radius_miles` (int, default 50): Search radius
- `limit` (int, default 20): Results per page
- `offset` (int, default 0): Pagination offset

**Response** (200):
```json
{
  "courses": [
    {
      "id": "uuid",
      "name": "Torrey Pines",
      "location": "La Jolla",
      "city": "San Diego",
      "state": "CA",
      "latitude": 32.7157,
      "longitude": -117.2564,
      "holes": 18,
      "par": 72,
      "slope": 140,
      "photo_url": "https://...",
      "is_verified": true
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

---

### `GET /courses/:courseId`
Get full course details with hole breakdown.

**Response** (200):
```json
{
  "course": {
    "id": "uuid",
    "name": "Torrey Pines",
    "par": 72,
    "holes": 18,
    "photo_url": "...",
    "tee_markers": [
      {
        "hole_number": 1,
        "tee_type": "white",
        "latitude": 32.7160,
        "longitude": -117.2565,
        "yards": 394,
        "par": 4,
        "handicap": 14
      }
    ]
  }
}
```

---

### `POST /courses/:courseId/tee-markers`
**[MVP CRITICAL]** Save tee marker from field testing.

**Request**:
```json
{
  "hole_number": 12,
  "tee_type": "white",
  "latitude": 32.7160,
  "longitude": -117.2565,
  "yards": 394,
  "handicap": 14
}
```

**Response** (201):
```json
{
  "id": "uuid",
  "course_id": "uuid",
  "hole_number": 12,
  "tee_type": "white",
  "latitude": 32.7160,
  "longitude": -117.2565,
  "created_by": "user_uuid",
  "created_at": "2025-12-06T10:30:00Z"
}
```

---

### `GET /courses/:courseId/tee-markers`
Fetch all tee markers for a course.

**Response** (200):
```json
{
  "tee_markers": [
    {
      "hole_number": 1,
      "tee_type": "white",
      "latitude": 32.7160,
      "longitude": -117.2565,
      "yards": 394
    }
  ]
}
```

---

## Rounds Endpoints

### `POST /rounds`
Create a new round (start playing).

**Request**:
```json
{
  "course_id": "uuid",
  "holes_played": 18,
  "scoring_method": "stroke",
  "tee_type": "white",
  "ai_strategy_profile": "balanced"
}
```

**Response** (201):
```json
{
  "round": {
    "id": "uuid",
    "user_id": "uuid",
    "course_id": "uuid",
    "date_played": "2025-12-06T10:00:00Z",
    "holes_played": 18,
    "tee_type": "white",
    "completed": false,
    "created_at": "2025-12-06T10:00:00Z"
  }
}
```

---

### `GET /rounds`
Get user's round history.

**Query Params**:
- `limit` (int, default 20)
- `offset` (int, default 0)
- `sort` (string): `date_desc`, `score_asc`, `score_desc`

**Response** (200):
```json
{
  "rounds": [
    {
      "id": "uuid",
      "course_id": "uuid",
      "course_name": "Torrey Pines",
      "date_played": "2025-12-05T10:00:00Z",
      "gross_score": 76,
      "net_score": 64,
      "holes_played": 18,
      "completed": true
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

---

### `GET /rounds/:roundId`
Get full round details with all scores and shots.

**Response** (200):
```json
{
  "round": {
    "id": "uuid",
    "course_id": "uuid",
    "course_name": "Torrey Pines",
    "date_played": "2025-12-05T10:00:00Z",
    "gross_score": 76,
    "net_score": 64,
    "handicap_at_play": 12.5,
    "completed": true,
    "scores": [
      {
        "hole_number": 1,
        "par": 4,
        "score": 4,
        "putts": 2,
        "fir": true,
        "gir": true
      }
    ],
    "shots": [
      {
        "hole_number": 1,
        "shot_sequence": 1,
        "club_used": "driver",
        "start_lat": 32.716,
        "start_lng": -117.256,
        "end_lat": 32.717,
        "end_lng": -117.257,
        "distance_yards": 260
      }
    ]
  }
}
```

---

### `PUT /rounds/:roundId`
Update round (add scores, mark completed).

**Request**:
```json
{
  "completed": true,
  "gross_score": 76,
  "net_score": 64,
  "weather_conditions": {
    "temp_f": 72,
    "wind_mph": 8,
    "wind_direction": "N"
  }
}
```

**Response** (200):
```json
{
  "round": { ... }
}
```

---

### `POST /rounds/:roundId/shots`
Log a shot during play.

**Request**:
```json
{
  "hole_number": 1,
  "shot_sequence": 1,
  "club_used": "driver",
  "start_latitude": 32.7160,
  "start_longitude": -117.2565,
  "end_latitude": 32.7170,
  "end_longitude": -117.2570,
  "distance_yards": 260,
  "shot_type": "full"
}
```

**Response** (201):
```json
{
  "shot": {
    "id": "uuid",
    "round_id": "uuid",
    "hole_number": 1,
    "shot_sequence": 1,
    "distance_yards": 260,
    "created_at": "2025-12-06T10:15:00Z"
  }
}
```

---

### `POST /rounds/:roundId/scores`
Submit hole score.

**Request**:
```json
{
  "hole_number": 1,
  "par": 4,
  "score": 4,
  "putts": 2,
  "penalties": 0
}
```

**Response** (201):
```json
{
  "score": {
    "id": "uuid",
    "round_id": "uuid",
    "hole_number": 1,
    "par": 4,
    "score": 4,
    "putts": 2,
    "fir": true,
    "gir": true
  }
}
```

---

## User Endpoints

### `GET /users/me`
Get current user profile.

**Response** (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "handicap_index": 12.5,
    "is_premium": false,
    "created_at": "2025-11-01T08:00:00Z"
  }
}
```

---

### `PUT /users/me`
Update user profile.

**Request**:
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "handicap_index": 11.5,
  "preferred_tees": "blue",
  "ai_caddy_personality": "teaching"
}
```

**Response** (200):
```json
{
  "user": { ... }
}
```

---

### `PUT /users/me/bag`
Update user's club setup.

**Request**:
```json
{
  "bag": [
    {
      "club_type": "driver",
      "club_name": "Titleist TSR2",
      "carry_distance": 280,
      "total_distance": 295
    },
    {
      "club_type": "6i",
      "carry_distance": 180,
      "total_distance": 190
    }
  ]
}
```

**Response** (200):
```json
{
  "bag": [ ... ]
}
```

---

### `GET /users/me/stats`
Get user's aggregated statistics.

**Response** (200):
```json
{
  "stats": {
    "total_rounds": 42,
    "avg_gross_score": 78.5,
    "avg_net_score": 66.2,
    "avg_fir_percent": 55.3,
    "avg_gir_percent": 42.8,
    "avg_putts_per_hole": 1.82,
    "last_round_date": "2025-12-05T10:00:00Z",
    "handicap_trend": [
      { "date": "2025-12-01", "handicap": 12.5 },
      { "date": "2025-12-05", "handicap": 12.3 }
    ]
  }
}
```

---

## AI Endpoints

### `POST /ai/drill-recommendation`
Generate AI drill based on recent round.

**Request**:
```json
{
  "round_id": "uuid"
}
```

**Response** (200):
```json
{
  "drill": {
    "id": "uuid",
    "drill_type": "driving_accuracy",
    "title": "10-Club Accuracy Challenge",
    "description": "Hit 10 shots with each club and score accuracy...",
    "duration_minutes": 30,
    "difficulty": "intermediate",
    "instructions": "...",
    "expected_improvement": "Improve FIR% by 5-10% in next 3 rounds"
  }
}
```

---

### `GET /ai/drills/:roundId`
Get AI drills for a specific round.

**Response** (200):
```json
{
  "drills": [
    {
      "id": "uuid",
      "drill_type": "driving_accuracy",
      "title": "10-Club Accuracy Challenge",
      "duration_minutes": 30
    },
    {
      "id": "uuid",
      "drill_type": "putting",
      "title": "Lag Putting Progression",
      "duration_minutes": 20
    }
  ]
}
```

---

## Weather Endpoint

### `GET /weather/:latitude/:longitude`
Get weather at given GPS coordinates.

**Response** (200):
```json
{
  "weather": {
    "temp_f": 72,
    "condition": "Partly Cloudy",
    "wind_mph": 8,
    "wind_direction": "N",
    "humidity": 55,
    "pressure_mb": 1013,
    "fetched_at": "2025-12-06T10:30:00Z"
  }
}
```

---

## Practice Sessions Endpoints

### `POST /practice-sessions`
Create a practice session.

**Request**:
```json
{
  "session_type": "range",
  "club_used": "driver",
  "shots_count": 25,
  "avg_carry_distance": 280,
  "location": "driving_range"
}
```

**Response** (201):
```json
{
  "session": {
    "id": "uuid",
    "session_type": "range",
    "shots_count": 25,
    "avg_carry_distance": 280,
    "created_at": "2025-12-06T14:00:00Z"
  }
}
```

---

### `GET /practice-sessions`
Get user's practice session history.

**Response** (200):
```json
{
  "sessions": [
    {
      "id": "uuid",
      "session_type": "range",
      "club_used": "driver",
      "shots_count": 25,
      "avg_carry_distance": 280,
      "created_at": "2025-12-06T14:00:00Z"
    }
  ],
  "total": 15
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid hole_number: must be 1-18",
  "code": "INVALID_INPUT"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid JWT token",
  "code": "AUTH_REQUIRED"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource",
  "code": "PERMISSION_DENIED"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Round not found",
  "code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Max 100 requests per minute.",
  "code": "RATE_LIMITED"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "code": "SERVER_ERROR"
}
```

---

## Rate Limiting

- **General**: 100 requests/minute per user
- **Auth endpoints**: 5 requests/minute per IP
- **File upload**: 1 request/second per user

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK (success) |
| 201 | Created (resource created) |
| 204 | No Content (success, no response body) |
| 400 | Bad Request (invalid input) |
| 401 | Unauthorized (auth required) |
| 403 | Forbidden (no permission) |
| 404 | Not Found (resource doesn't exist) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

**Last Updated**: December 6, 2025  
**Version**: MVP-API-1.0
