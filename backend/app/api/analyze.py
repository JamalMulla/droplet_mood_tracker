from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    TagAnalysisRequest,
    TagAnalysisResponse,
    BatchAnalysisRequest,
    BatchAnalysisResponse
)
from app.services.tag_extractor import extract_tags

router = APIRouter(prefix="/api/analyze", tags=["analyze"])


@router.post("/tags", response_model=TagAnalysisResponse)
async def analyze_tags(request: TagAnalysisRequest):
    """
    Extract tags from diary text using LLM

    - **text**: Diary entry text to analyze
    - **date**: ISO date string (YYYY-MM-DD)
    - **mood**: Optional mood information

    Returns list of extracted tags and confidence score
    """
    try:
        result = await extract_tags(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing tags: {str(e)}")


@router.post("/batch", response_model=BatchAnalysisResponse)
async def analyze_batch(request: BatchAnalysisRequest):
    """
    Batch process multiple entries for tag extraction

    Useful for processing historical data or onboarding existing entries

    - **entries**: List of day entries to process

    Returns summary of processing results
    """
    try:
        results = []
        tags_extracted = 0

        for entry in request.entries:
            if entry.notes:
                tag_request = TagAnalysisRequest(
                    text=entry.notes,
                    date=entry.date,
                    mood=entry.mood
                )

                result = await extract_tags(tag_request)
                results.append(result)
                tags_extracted += len(result.tags)

        return BatchAnalysisResponse(
            processed=len(request.entries),
            tags_extracted=tags_extracted,
            success=True,
            results=results
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in batch analysis: {str(e)}")
