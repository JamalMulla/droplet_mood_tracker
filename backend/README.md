# Squircle Backend API

FastAPI backend for Squircle mood tracking app with LLM-powered tag extraction and summaries.

## Features

- Automatic tag extraction from diary entries using Claude/GPT
- Intelligent monthly/weekly summaries
- Tag-based entry filtering
- Batch processing for historical data

## Setup

### Prerequisites

- Python 3.11+
- pip or poetry

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file:

```
ANTHROPIC_API_KEY=your_api_key_here
# OR
OPENAI_API_KEY=your_api_key_here

DATABASE_URL=sqlite:///./squircle.db
ENVIRONMENT=development
```

### Run

```bash
# Development
uvicorn app.main:app --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Tag Extraction
`POST /api/analyze/tags`

Extract tags from diary text.

**Request:**
```json
{
  "text": "Went to the gym this morning, did chest and back",
  "date": "2024-01-15",
  "mood": {
    "label": "Energetic",
    "intensity": 4
  }
}
```

**Response:**
```json
{
  "tags": ["gym", "exercise", "morning", "chest", "back"],
  "confidence": 0.95
}
```

### Summary Generation
`POST /api/summaries/generate`

Generate intelligent summary for date range.

**Request:**
```json
{
  "date_range": {
    "start": "2024-10-01",
    "end": "2024-10-31"
  },
  "entries": [...],
  "focus": "activities"
}
```

**Response:**
```json
{
  "summary": "In October you went to the gym 10 times...",
  "highlights": [
    "Most common activity: gym (10 times)",
    "Favorite time: morning (7/10 sessions)"
  ]
}
```

## Architecture

```
backend/
├── app/
│   ├── main.py           # FastAPI app
│   ├── api/              # API routes
│   │   ├── analyze.py    # Tag extraction
│   │   └── summaries.py  # Summary generation
│   ├── core/             # Core config
│   │   ├── config.py     # Settings
│   │   └── llm.py        # LLM client
│   ├── models/           # Pydantic models
│   │   └── schemas.py
│   └── services/         # Business logic
│       ├── tag_extractor.py
│       └── summary_generator.py
└── requirements.txt
```

## Testing

```bash
pytest
```
