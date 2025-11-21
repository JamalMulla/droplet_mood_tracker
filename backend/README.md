# Squircle Backend API

FastAPI backend for Squircle mood tracking app with LLM-powered tag extraction and summaries.

## Features

- Automatic tag extraction from diary entries using Claude/GPT
- Intelligent monthly/weekly summaries
- Tag-based entry filtering
- Batch processing for historical data

## Setup

### Prerequisites

- [Pixi](https://pixi.sh) - Modern package manager for Python
  ```bash
  # Install pixi (macOS/Linux)
  curl -fsSL https://pixi.sh/install.sh | bash

  # Or using Homebrew
  brew install pixi

  # Windows (PowerShell)
  iwr -useb https://pixi.sh/install.ps1 | iex
  ```

### Installation

```bash
cd backend

# Install all dependencies (pixi handles everything)
pixi install

# Or install with dev dependencies
pixi install --environment dev
```

### Environment Variables

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_api_key_here
# OR
OPENAI_API_KEY=your_api_key_here

DATABASE_URL=sqlite:///./squircle.db
ENVIRONMENT=development
```

### Run

```bash
# Development (with auto-reload)
pixi run dev

# Production
pixi run start

# Run tests
pixi run test

# Format code
pixi run format

# Lint code
pixi run lint
```

### Alternative: Traditional Python Setup

If you prefer not to use pixi:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
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
├── pixi.toml            # Pixi package management
└── requirements.txt     # Fallback for pip users
```

## Testing

```bash
# With pixi
pixi run test

# Or with pytest directly
pytest
```

## Development Tools

Pixi provides convenient tasks for development:

```bash
pixi run dev        # Start dev server with auto-reload
pixi run start      # Start production server
pixi run test       # Run pytest
pixi run format     # Format code with black
pixi run lint       # Lint code with ruff
```
