from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Mood(BaseModel):
    label: str
    color: str
    intensity: Optional[int] = Field(None, ge=1, le=5)


class TagAnalysisRequest(BaseModel):
    text: str = Field(..., description="Diary entry text to analyze")
    date: str = Field(..., description="ISO date string (YYYY-MM-DD)")
    mood: Optional[Mood] = None


class TagAnalysisResponse(BaseModel):
    tags: List[str] = Field(..., description="Extracted tags")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")


class DayEntry(BaseModel):
    date: str
    mood: Optional[Mood] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None


class DateRange(BaseModel):
    start: str = Field(..., description="Start date (YYYY-MM-DD)")
    end: str = Field(..., description="End date (YYYY-MM-DD)")


class SummaryRequest(BaseModel):
    date_range: DateRange
    entries: List[DayEntry]
    focus: Optional[str] = Field("all", description="Focus area: activities, mood, social, or all")


class SummaryResponse(BaseModel):
    summary: str = Field(..., description="Generated summary text")
    highlights: List[str] = Field(..., description="Key highlights")


class BatchAnalysisRequest(BaseModel):
    entries: List[DayEntry]


class BatchAnalysisResponse(BaseModel):
    processed: int
    tags_extracted: int
    success: bool
    results: List[TagAnalysisResponse]
