# Squircle - Next Steps Implementation Plan

## Overview

This document outlines the phased approach to building out Squircle's advanced features. Each phase builds on the previous one while maintaining the app's simplicity and usability.

## Phase 1: Timeline/Timestamp Mode ✅ COMPLETED

**Goal**: Allow multiple entries per day instead of one monolithic note

### Features
- Add timestamp when user opens a day that already has entries
- Show timeline of entries throughout the day
- Each timestamp has its own text content
- Users can add, edit, and delete individual timestamps
- Visual timeline UI showing chronological entries

### Technical Changes
- Extend `DayEntry` type to support multiple timestamps
- Update `DayDetailModal` to show timeline view
- Add "Add Timestamp" button
- Create `TimestampEntry` component
- Update storage to handle timestamp arrays

### Benefits
- More granular tracking of daily activities
- Better context for mood changes throughout the day
- Easier to capture moments as they happen

---

## Phase 2: Enhanced Mood Granularity ✅ COMPLETED

**Goal**: More detailed mood tracking and intensity levels

### Features
- Add mood intensity slider (1-5 scale)
- Multiple moods per day support
- Mood evolution timeline (if mood changes during day)
- Custom mood colors (optional)

### Technical Changes
- Extend `Mood` type with intensity field
- Add slider component to mood picker
- Update visual representation to show intensity
- Add mood history to timeline

### Benefits
- Capture nuanced emotional states
- Better data for pattern analysis
- More accurate mood tracking

---

## Phase 3: Activity Tracking UI Structure ✅ COMPLETED

**Goal**: Prepare UI for AI-powered activity extraction (backend integration comes later)

### Features
- Manual tag input for now
- Tag suggestion UI (hardcoded common activities)
- Tag management (add/remove/edit)
- Activity categories (exercise, social, work, etc.)
- Visual tag display in calendar tooltip

### Technical Changes
- Add `tags` array to `DayEntry`
- Create `TagInput` component
- Create `TagPill` component
- Add tag filtering/search
- Prepare data structure for AI-extracted tags

### Backend Preparation
- Define API contract for tag extraction
- Mock AI responses for development
- Structure data for future FastAPI integration

### Benefits
- Users can start categorizing activities
- Data ready for AI analysis when backend is added
- Understanding of what tags users care about

---

## Phase 4: Reports and Insights ✅ COMPLETED

**Goal**: Provide actionable insights from tracked data

### Features

**Basic Analytics**
- Mood distribution charts (pie/bar charts)
- Mood trends over time (line graph)
- Most frequent moods
- Streak tracking (consecutive days)

**Tag-Based Reports**
- Most common activities
- Activity frequency over time
- Mood correlation with activities
- Time-of-day patterns

**Insights**
- "You felt [mood] most on [day of week]"
- "You [activity] X times this month"
- "You preferred [activity] during [season/time]"
- Mood improvement/decline trends

### Technical Changes
- Create `ReportsScreen` component
- Add navigation between screens
- Create chart components (use react-native-chart-kit)
- Add date range selector
- Implement data aggregation utilities
- Create insight generation algorithms

### Benefits
- Users see value in their tracking
- Actionable patterns emerge
- Motivation to continue tracking

---

## Phase 5: AI Backend Integration ⏳ IN PROGRESS

**Goal**: FastAPI backend with LLM-powered intelligent features

### Overview
Automatic tag extraction and intelligent summaries powered by LLM. Users write diary entries naturally, and the system automatically:
- Extracts relevant tags (activities, people, places, emotions)
- Generates monthly/weekly summaries
- Provides drill-down analysis by tags
- Creates narrative insights

### User Flow
1. User writes: "Went to the gym this morning, did chest and back. Felt great afterwards!"
2. LLM automatically extracts tags: `gym`, `exercise`, `morning`, `chest`, `back`
3. Tags stored with entry for aggregation
4. Later analysis: "In October you went to the gym 10 times - focused on chest (4x), back (3x), legs (3x)"

### Features

**Automatic Tag Extraction**
- Parse diary text with LLM
- Extract activities (gym, running, work, cooking, etc.)
- Extract people (friends, family, specific names)
- Extract places (home, office, park, restaurant)
- Extract context (morning, evening, after work)
- Confidence scoring for each tag

**Intelligent Summaries**
- Monthly summaries: "In October you went to the gym 10 times..."
- Activity breakdowns: "Your gym sessions included: chest 4x, back 3x, legs 3x"
- Trend analysis: "You exercised more in the first half of the month"
- Mood-activity correlation: "You felt energetic after 80% of gym sessions"

**Tag-Based Drill-Down**
- Click on "gym" tag → see all gym-related entries
- Filter by date range
- View mood patterns for specific activities
- Export filtered entries

**Smart Insights**
- Pattern detection: "You typically go to the gym in the morning"
- Preference analysis: "You prefer outdoor runs vs treadmill"
- Seasonal patterns: "You exercised more during summer"
- Social patterns: "You feel happier on days you see friends"

### Technical Stack
- **Backend**: FastAPI (Python 3.11+)
- **LLM**: Anthropic Claude API (or OpenAI GPT-4)
- **Database**: SQLite (local first) → PostgreSQL (production)
- **Caching**: In-memory (local) → Redis (production)
- **Authentication**: JWT tokens (future)

### API Endpoints

```python
# Tag Extraction
POST /api/analyze/tags
{
  "text": "Went to the gym this morning...",
  "date": "2024-01-15",
  "mood": { "label": "Energetic", "intensity": 4 }
}
→ Returns: { "tags": ["gym", "exercise", "morning"], "confidence": 0.95 }

# Generate Summary
POST /api/summaries/generate
{
  "date_range": { "start": "2024-10-01", "end": "2024-10-31" },
  "entries": [...],
  "focus": "activities"  // or "mood", "social", "all"
}
→ Returns: { "summary": "In October you went to the gym 10 times...", "highlights": [...] }

# Get Tag-Filtered Entries
GET /api/entries/by-tag?tag=gym&start=2024-10-01&end=2024-10-31
→ Returns: { "entries": [...], "stats": {...} }

# Batch Analysis (for onboarding existing data)
POST /api/analyze/batch
{
  "entries": [...]
}
→ Returns: { "processed": 150, "tags_extracted": 450, "success": true }
```

### Implementation Plan

**Backend Setup**
1. Create FastAPI project structure
2. Set up LLM client (Anthropic/OpenAI)
3. Define data models (Pydantic)
4. Implement tag extraction logic
5. Add summary generation
6. Create API endpoints
7. Add error handling & retry logic

**LLM Prompt Engineering**
- Design tag extraction prompt
- Handle edge cases (typos, slang, abbreviations)
- Implement tag normalization (gym = gym workout = weight training)
- Add context awareness (date, mood, previous tags)

**React Native Integration**
1. Add API client utilities
2. Create environment config for backend URL
3. Update DayDetailModal to call tag extraction
4. Add loading states during LLM processing
5. Allow manual tag editing after auto-extraction
6. Implement summary screen
7. Add offline support (queue requests)

**Data Flow**
```
User saves entry →
  Call /api/analyze/tags →
    LLM processes text →
      Extract tags →
        Store with entry →
          Update UI with tags
```

### Benefits
- **Zero Manual Work**: Tags appear automatically
- **Rich Data**: More comprehensive tagging than manual
- **Intelligent Insights**: LLM generates human-readable summaries
- **Time-Saving**: Users focus on writing, not categorizing
- **Consistent**: Same activity always gets same tag
- **Scalable**: Works with historical data via batch processing

### Challenges & Solutions

**Challenge**: LLM API costs
- **Solution**: Cache common patterns, batch process, use smaller models for simple extractions

**Challenge**: Latency (LLM takes 1-3 seconds)
- **Solution**: Async processing, show loading state, allow saving without waiting

**Challenge**: Tag consistency
- **Solution**: Maintain tag dictionary, normalize variations, provide suggestions

**Challenge**: Privacy concerns
- **Solution**: Option for local-only processing, clear data policy, no storage of text on server (only tags)

**Challenge**: Offline support
- **Solution**: Queue requests, process when online, manual tags as fallback

### Development Estimates
- Backend setup: 2-3 hours
- LLM integration: 3-4 hours
- API endpoints: 2-3 hours
- React Native integration: 3-4 hours
- Testing & refinement: 2-3 hours
- **Total**: 12-17 hours (1.5-2 days)

---

## Phase 6: Advanced Analytics & Predictions (Future)

**Goal**: Predictive insights and advanced pattern recognition

### Features
- Mood prediction based on activities
- Optimal time suggestions for activities
- Habit formation tracking
- Correlation analysis (sleep, weather, exercise → mood)
- Personalized recommendations
- Export reports as PDF

### Technical Requirements
- Machine learning models (scikit-learn)
- Time series analysis
- Weather API integration
- PDF generation

---

## Implementation Order

1. **Phase 1** ✅: Timeline Mode - Most impactful for user experience
2. **Phase 2** ✅: Mood Granularity - Enhances core feature
3. **Phase 3** ✅: Activity UI - Prepares for AI
4. **Phase 4** ✅: Reports - Makes data useful
5. **Phase 5** ⏳: LLM Backend - Intelligent tag extraction and summaries (IN PROGRESS)
6. **Phase 6** 🔮: Advanced Analytics - Predictions and ML-based insights

---

## Success Metrics

- **Engagement**: Daily active usage
- **Retention**: Week-over-week retention rate
- **Data Quality**: Average entries per day, note length
- **Feature Adoption**: % users using timestamps, tags, reports
- **Insight Value**: User feedback on report usefulness

---

## Development Estimates

| Phase | Complexity | Time Estimate | Status |
|-------|------------|---------------|--------|
| Phase 1 | Medium | 2-3 hours | ✅ Complete |
| Phase 2 | Low | 1-2 hours | ✅ Complete |
| Phase 3 | Medium | 2-3 hours | ✅ Complete |
| Phase 4 | High | 4-5 hours | ✅ Complete |
| Phase 5 | High | 12-17 hours | ⏳ In Progress |
| Phase 6 | Very High | 2-3 weeks | 🔮 Future |

---

## Next Immediate Actions

1. ✅ Create NEXT_STEPS.md (this document)
2. ✅ Implement Timeline/Timestamp Mode
3. ✅ Implement Enhanced Mood Granularity
4. ✅ Implement Activity Tracking UI
5. ✅ Implement Reports and Insights
6. ⏳ **NOW**: Create FastAPI backend with LLM integration
   - Set up FastAPI project structure
   - Integrate Anthropic Claude API for tag extraction
   - Implement tag extraction endpoint
   - Implement summary generation endpoint
   - Create React Native API client
   - Integrate automatic tag extraction in app
   - Add summary generation screen
