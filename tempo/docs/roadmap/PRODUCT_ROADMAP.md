# Tempo - Product Roadmap

## Vision
A next-generation golf app that combines GPS mapping, AI analysis, and AR camera technology to transform how golfers play. Works like a digital caddy that reads the course, tracks shots, analyzes performance, and gives smart recommendations—empowering players to understand their game with confidence and clarity.

**Key Differentiator**: Unlike 18Birdies (social-heavy, tracker-first), Tempo is GPS + AR hybrid with AI coaching focus.

---

## MVP (Phase 0) - Core Golf Experience
**Goal**: Deliver GPS-based play tracking + AR camera foundation + basic analytics  
**Target**: iOS (primary), Android follow-up  
**Timeline**: Structure first, then implementation

### 1. **Play (Core Experience)**
The primary gameplay loop—GPS-guided hole navigation with shot tracking.

#### Features:
- ✅ **GPS Course Map** (MVP)
  - Course selection + search
  - GPS-detected hole advancement
  - Front/Center/Back yardages to pin
  - Hazard overlays (bunkers, water, OB)
  - Compass + wind direction indicator
  - Real-time player location tracking
  - Hole info: Par, Handicap, Yards

- ✅ **Shot Tracking** (MVP)
  - Tap to log tee, approach, green shots
  - Manual stroke/putt/penalty entry
  - GPS point capture for each shot start/end
  - Shot history on hole map

- ✅ **Score Entry** (MVP)
  - Modal entry after hole completion
  - Suggests score based on shot log
  - Manual override allowed
  - Gross + handicap calculation

- ✅ **Camera Lite** (MVP - Limited)
  - Live camera feed with safety indicators
  - Distance measurement overlay (basic AR range line)
  - Wind direction compass overlay
  - Club recommendation (yardage + bag setup only)

- 🔒 **AR Camera Smart Sidebar** (MVP - Premium Feature Gate)
  - Opens from top-right button
  - Initial state: camera feed only
  - Ready for Premium AI overlays (Phase 1+)
  - Slope detection (Premium)
  - Lie detection (Premium)
  - Hazard recognition (Premium)

#### Database:
- Courses table (basic + teebox coords)
- Holes table (par, handicap, yards)
- Tee markers table (auto-save from field testing)
- Shots table (GPS points, club, distance)
- Rounds table (date, score, handicap)

---

### 2. **End of Round (Inside Play Tab)**
Auto-trigger when round completes (18 holes played).

#### Features:
- ✅ **Round Recap Popup** (MVP)
  - Course name + location
  - Gross/Net scorecard
  - Player name, handicap
  - Quick stats: FIR%, GIR%, Putts, Penalties

- ✅ **AI Coach Insights** (MVP)
  - Strokes gained breakdown:
    - Off Tee (+/- vs baseline)
    - Approach (+/- vs baseline)
    - Putting (+/- vs baseline)
  - Visual sliders showing performance vs average
  - Recommended drill hint (text only, MVP)

- 🔒 **Premium: Full Drill Library** (Phase 1)
  - AI-generated practice plan based on weaknesses
  - 3-5 recommended drills with instructions
  - Time estimates per drill

#### Baseline Calculation (MVP):
- Compare against user's own historical average (last 5 rounds)
- Fallback: Compare vs scratch golfer baseline (adjust for handicap)

---

### 3. **Stats (Performance Center)**
Historical tracking + basic trend analysis.

#### Features:
- ✅ **Round History** (MVP)
  - Sortable list of all played rounds
  - Course, date, gross, net, handicap
  - Tap to view full scorecard

- ✅ **Scorecard Viewer** (MVP)
  - Hole-by-hole breakdown
  - Par, Handicap, Score, Putts
  - Course info + date

- ✅ **Trend Snapshot** (MVP)
  - Last 3-5 rounds quick stats
  - FIR%, GIR%, Avg Score, Avg Putts
  - Visual indicators (↑ improving, ↓ declining)

- 🔒 **Premium: Advanced Analytics** (Phase 1)
  - Strokes gained categories
  - Dispersion circles (shot patterns)
  - Club performance breakdown
  - Multi-round comparisons

#### Database:
- Round stats (FIR, GIR, putts per round)
- Hole-level stats aggregation

---

### 4. **Home (Dashboard)**
Quick entry point + recent activity preview.

#### Features:
- ✅ **Start Round Button** (MVP)
  - Launches Play tab with GPS auto-detect

- ✅ **Recent Rounds Carousel** (MVP)
  - Last 3-5 rounds as cards
  - Shows: Course, Date, Score, FIR%, GIR%, Putts
  - Tap to view full summary

- ✅ **Personal Trends Snapshot** (MVP)
  - Example: "Driving Accuracy ↑ 8% (last 3 rounds)"
  - 2-3 key metrics pulled from Stats

- ✅ **Featured Last Round Card** (MVP)
  - Most recent round highlights
  - FIR, GIR, Putts, Handicap
  - Link to End of Round summary

- ✅ **Practice Mode Button** (MVP)
  - Shortcut to Practice tab
  - Text link only

- 🔒 **Camera Lite Teaser** (MVP)
  - "Point camera at green to see slope" text
  - Links to Camera Lite in Play tab
  - Premium upsell copy

---

### 5. **Practice Mode**
Standalone training environment.

#### Features:
- ✅ **Range Mode** (MVP)
  - Log multiple shots with same club
  - Track carry distance, dispersion
  - Avg distance calculation
  - Simple ball marker placement on virtual range

- 🔒 **Swing Setup Assistant** (Premium - Phase 1)
  - AR stance/alignment overlay
  - Compare to target line

- 🔒 **Drill Library** (Premium - Phase 1)
  - AI-generated drills from round weaknesses

- 🔒 **Replay Overlay** (Premium - Phase 1)
  - Record swings, overlay shot tendencies

#### Database:
- Practice sessions (club, shots logged, avg distance)

---

### 6. **Settings & Profile**
User configuration + account management.

#### Features:
- ✅ **User Profile** (MVP)
  - Name, email, handicap index
  - Manual handicap entry (GHIN integration Phase 2)

- ✅ **Bag Setup** (MVP)
  - Add/remove clubs
  - Manual yardage input per club
  - Club type (Driver, 3W, Iron, Wedge, Putter)

- ✅ **Auth Settings** (MVP)
  - Email + Google login
  - Password reset
  - Apple Sign-In (Phase 2)

- 🔒 **Subscription Management** (Premium - Phase 1)
  - Payment gateway integration
  - Plan info + renewal date

- 🔒 **AI Caddy Personality** (Premium - Phase 1)
  - Toggle feedback style (Serious, Fun, Teaching)

- ⏳ **GHIN Integration** (Phase 2)
- ⏳ **Smartwatch Integration** (Phase 2)

#### Database:
- Users table (auth, handicap, preferences)
- User bag setup
- Subscription records

---

## MVP Summary Table

| Feature | Free Tier | Premium | Phase |
|---------|-----------|---------|-------|
| GPS Map + Course Selection | ✅ | ✅ | MVP |
| Shot Tracking | ✅ | ✅ | MVP |
| Score Entry | ✅ | ✅ | MVP |
| Camera Feed (Basic) | ✅ | ✅ | MVP |
| Distance Overlay | ✅ | ✅ | MVP |
| Wind Indicator | ✅ | ✅ | MVP |
| Basic Club Recommendation | ✅ | ✅ | MVP |
| Round History | ✅ | ✅ | MVP |
| Scorecard Viewer | ✅ | ✅ | MVP |
| Basic Stats | ✅ | ✅ | MVP |
| Home Dashboard | ✅ | ✅ | MVP |
| Range Mode Practice | ✅ | ✅ | MVP |
| **AR Slope Detection** | ❌ | ✅ | Phase 1 |
| **AR Lie Detection** | ❌ | ✅ | Phase 1 |
| **AR Hazard Recognition** | ❌ | ✅ | Phase 1 |
| **AI Drill Generation** | ❌ | ✅ | Phase 1 |
| **Advanced Stats** | ❌ | ✅ | Phase 1 |
| **Swing Replay** | ❌ | ✅ | Phase 1 |
| **GHIN Integration** | ❌ | 🔄 | Phase 2 |
| **Smartwatch** | ❌ | 🔄 | Phase 2 |
| **Social Feed** | ❌ | 🔄 | Phase 2 |

---

## Phase 1 - Premium AI + Advanced AR
- Full AR camera suite (slope, lie, hazards, green reading)
- ML-powered drill generation from round analysis
- Advanced strokes gained analytics
- Subscription paywall implementation
- Swing replay overlay + tendency tracking

## Phase 2 - Community & Integration
- Social feed (friend highlights, leaderboards)
- GHIN handicap sync
- Smartwatch integration (Apple Watch, WearOS)
- Challenges (e.g., "Hit 60% greens this week")
- Club-based competitions

---

## Key Design Principles
1. **Simplicity**: One-tap "Start Round" → intuitive play flow
2. **Confidence**: Give players real insight (not overwhelming data)
3. **Calm**: Clean UI, natural interactions (like a good caddy)
4. **Privacy-First**: Local-first data, sync to cloud
5. **Performance**: Smooth GPS tracking, snappy transitions

---

## Success Metrics (MVP)
- **DAU**: Daily active users (target: 100+ beta testers)
- **Round Completion Rate**: % of users who finish a round > 80%
- **Session Length**: Avg time per round (should match real golf time ~4h)
- **AR Engagement**: % who open camera at least once per round
- **Retention**: 1-week retention > 70%, 30-day > 40%

---

**Last Updated**: December 6, 2025  
**Version**: MVP-1.0
