from fastapi import APIRouter, HTTPException
from app.models.schemas import SummaryRequest, SummaryResponse
from app.services.summary_generator import generate_summary

router = APIRouter(prefix="/api/summaries", tags=["summaries"])


@router.post("/generate", response_model=SummaryResponse)
async def create_summary(request: SummaryRequest):
    """
    Generate intelligent summary for a date range

    - **date_range**: Start and end dates
    - **entries**: List of day entries in the range
    - **focus**: Focus area (activities, mood, social, or all)

    Returns a human-readable summary with key highlights
    """
    try:
        result = await generate_summary(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating summary: {str(e)}")
