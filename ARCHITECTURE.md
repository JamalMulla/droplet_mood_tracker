# Squircle Architecture

## Overview

Squircle is built with a modular, scalable architecture following React Native best practices. The app is designed to be simple initially while maintaining extensibility for future AI-powered features.

## Core Architecture Principles

### 1. Component-Based Architecture

**Atomic Components**: Small, reusable components that do one thing well
- `DayPixel`: Renders a single day as a colored square
- `MoodPicker`: Horizontal scrollable mood selector
- `DayDetailModal`: Bottom sheet modal for day editing

**Composite Components**: Combine atomic components
- `PixelsCalendar`: Orchestrates multiple `DayPixel` components
- `HomeScreen`: Combines calendar and modal

### 2. Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
useMoodData Hook
    ↓
State Update (React)
    ↓
AsyncStorage (Persistence)
    ↓
UI Re-render
```

### 3. Type Safety

TypeScript is used throughout for compile-time type checking:
- `Mood`: Mood definition with color and label
- `DayEntry`: Complete day data structure
- `MoodData`: Map of dates to entries

### 4. State Management

**Current**: React Hooks + Context
- `useState` for component-local state
- Custom hook `useMoodData` for shared mood data
- Simple and performant for current scope

**Future**: Can easily integrate:
- Redux for complex state
- React Query for server state
- Zustand for lightweight global state

### 5. Storage Layer

**Current**: AsyncStorage (Local)
```typescript
MoodData → JSON → AsyncStorage
```

**Future**: API Integration
```typescript
MoodData → JSON → API → FastAPI Backend → Database
```

The storage layer is abstracted in `utils/storage.ts`, making it easy to swap implementations.

## Component Hierarchy

```
App
└── HomeScreen
    ├── PixelsCalendar
    │   └── DayPixel (×365)
    └── DayDetailModal
        ├── MoodPicker
        └── TextInput (Notes)
```

## Data Models

### DayEntry
```typescript
{
  date: string;           // ISO format: YYYY-MM-DD
  mood?: {
    color: string;        // Hex color
    label: string;        // Mood name
  };
  notes?: string;         // User text
  tags?: string[];        // Future: AI-extracted tags
  timestamps?: [{         // Future: Timeline mode
    id: string;
    time: string;
    content: string;
  }];
}
```

### Storage Format
```json
{
  "2024-01-15": {
    "date": "2024-01-15",
    "mood": { "color": "#4ECDC4", "label": "Calm" },
    "notes": "Went for a morning run. Felt great!"
  }
}
```

## Future Backend Integration

### FastAPI Backend Design

**Endpoints**:
```
POST /api/entries          # Create/update entry
GET  /api/entries          # Get all entries
GET  /api/entries/{date}   # Get specific entry
POST /api/analyze          # AI analysis endpoint
GET  /api/reports          # Generate insights
```

**AI Features**:
1. **Tag Extraction**: Analyze notes to extract activities, people, places
2. **Pattern Analysis**: Identify mood patterns and correlations
3. **Activity Tracking**: Group similar activities across time
4. **Insights**: Generate reports like "ran 15 times, preferred mornings"

### Migration Path

1. **Phase 1** (Current): Local-only with AsyncStorage
2. **Phase 2**: Add API layer, dual write to local + server
3. **Phase 3**: Server as source of truth, local cache
4. **Phase 4**: Real-time sync, offline support

## Performance Considerations

### Current Optimizations
- `useMemo` for expensive date calculations
- Shallow props comparison to prevent unnecessary re-renders
- Lazy loading of modal content

### Future Optimizations
- Virtualized list for very large datasets
- Image caching for mood icons
- Background sync for API calls
- Pagination for historical data

## Scalability

### Current Limitations
- Single year view only
- All data in memory
- No cloud backup

### Scaling Strategy
1. **Year Navigation**: Add year picker/swipe
2. **Data Pagination**: Load months on demand
3. **Cloud Storage**: Sync to backend
4. **Caching**: Redis for frequently accessed data
5. **CDN**: Static assets and AI models

## Testing Strategy (Future)

```
Unit Tests:
  - Utility functions (dateUtils, storage)
  - Components (Jest + React Native Testing Library)

Integration Tests:
  - User flows (select mood → save → verify)
  - API integration

E2E Tests:
  - Detox for full app flows
```

## Security Considerations

### Current
- All data stored locally
- No authentication needed

### Future
- JWT authentication for API
- End-to-end encryption for sensitive notes
- GDPR compliance for EU users
- Data export functionality

## Accessibility

### Current
- Basic touchable components
- Semantic color choices

### Future
- VoiceOver/TalkBack support
- Dynamic text sizing
- High contrast mode
- Haptic feedback
