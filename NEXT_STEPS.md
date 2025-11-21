# Squircle - Next Steps Implementation Plan

## Overview

This document outlines the phased approach to building out Squircle's advanced features. Each phase builds on the previous one while maintaining the app's simplicity and usability.

## Phase 1: Timeline/Timestamp Mode ✓ Next

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

## Phase 2: Enhanced Mood Granularity

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

## Phase 3: Activity Tracking UI Structure

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

## Phase 4: Reports and Insights

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

## Phase 5: AI Backend Integration (Future)

**Goal**: FastAPI backend for intelligent features

### Features
- AI tag extraction from notes
- Advanced pattern recognition
- Activity inference (e.g., "went running" → running tag)
- Personalized insights
- Cloud sync and backup

### Technical Stack
- FastAPI backend
- OpenAI/Anthropic API for NLP
- PostgreSQL for data storage
- Redis for caching
- JWT authentication

### Endpoints
```
POST /api/entries/analyze    # Extract tags from text
GET  /api/insights           # Get AI-generated insights
POST /api/sync               # Sync local data to cloud
GET  /api/reports            # Server-side report generation
```

---

## Implementation Order

1. **Phase 1** (Now): Timeline Mode - Most impactful for user experience
2. **Phase 2** (Next): Mood Granularity - Enhances core feature
3. **Phase 3** (Then): Activity UI - Prepares for AI
4. **Phase 4** (Then): Reports - Makes data useful
5. **Phase 5** (Future): Backend - Scales and adds intelligence

---

## Success Metrics

- **Engagement**: Daily active usage
- **Retention**: Week-over-week retention rate
- **Data Quality**: Average entries per day, note length
- **Feature Adoption**: % users using timestamps, tags, reports
- **Insight Value**: User feedback on report usefulness

---

## Development Estimates

| Phase | Complexity | Time Estimate |
|-------|------------|---------------|
| Phase 1 | Medium | 2-3 hours |
| Phase 2 | Low | 1-2 hours |
| Phase 3 | Medium | 2-3 hours |
| Phase 4 | High | 4-5 hours |
| Phase 5 | High | 1-2 weeks |

---

## Next Immediate Actions

1. ✓ Create NEXT_STEPS.md (this document)
2. → Implement Timeline/Timestamp Mode
3. → Test timeline functionality
4. → Move to Phase 2
