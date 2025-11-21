from app.core.llm import llm_client
from app.models.schemas import TagAnalysisRequest, TagAnalysisResponse
from typing import List
import json


TAG_EXTRACTION_SYSTEM_PROMPT = """You are an expert at analyzing diary entries and extracting structured tags.

Your task is to extract relevant tags from diary text. Tags should capture:
- Activities (gym, running, work, cooking, reading, etc.)
- People (friends, family, specific names if mentioned)
- Places (home, office, park, restaurant, gym, etc.)
- Time context (morning, evening, afternoon, night, after work)
- Emotions/feelings if explicitly mentioned
- Specific details (chest day, leg day, cardio, weights, etc.)

Rules:
1. Use lowercase for all tags
2. Be specific but concise (e.g., "chest workout" → "chest", "gym")
3. Normalize similar activities (gym workout = weight training = gym)
4. Extract 3-10 tags per entry
5. Only extract tags explicitly mentioned or clearly implied
6. Return ONLY a JSON array of strings, nothing else

Examples:
Input: "Went to the gym this morning, did chest and back. Felt great afterwards!"
Output: ["gym", "exercise", "morning", "chest", "back"]

Input: "Had dinner with Sarah at the new Italian place downtown. Food was amazing."
Output: ["dinner", "friends", "restaurant", "italian", "downtown", "social"]

Input: "Worked from home today. Long meetings but productive. Took a walk in the evening."
Output: ["work", "home", "meetings", "productive", "walk", "evening"]
"""


TAG_EXTRACTION_USER_PROMPT = """Extract tags from this diary entry:

Date: {date}
Mood: {mood}
Text: {text}

Return ONLY a JSON array of tag strings. Example: ["tag1", "tag2", "tag3"]"""


async def extract_tags(request: TagAnalysisRequest) -> TagAnalysisResponse:
    """
    Extract tags from diary text using LLM

    Args:
        request: Tag analysis request with text and metadata

    Returns:
        TagAnalysisResponse with extracted tags and confidence score
    """
    mood_str = f"{request.mood.label} (intensity: {request.mood.intensity})" if request.mood else "Not specified"

    user_prompt = TAG_EXTRACTION_USER_PROMPT.format(
        date=request.date,
        mood=mood_str,
        text=request.text
    )

    try:
        # Call LLM
        response_text = await llm_client.generate(
            prompt=user_prompt,
            system_prompt=TAG_EXTRACTION_SYSTEM_PROMPT,
            temperature=0.3,
            max_tokens=200
        )

        # Parse JSON response
        response_text = response_text.strip()

        # Handle markdown code blocks
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            response_text = "\n".join(lines[1:-1])  # Remove first and last lines

        tags = json.loads(response_text)

        # Validate and clean tags
        if not isinstance(tags, list):
            tags = []

        # Ensure all tags are strings and lowercase
        tags = [str(tag).lower().strip() for tag in tags if tag]

        # Remove duplicates while preserving order
        seen = set()
        unique_tags = []
        for tag in tags:
            if tag not in seen:
                seen.add(tag)
                unique_tags.append(tag)

        # Calculate confidence (simple heuristic: more tags = higher confidence)
        confidence = min(0.95, 0.7 + (len(unique_tags) * 0.05))

        return TagAnalysisResponse(
            tags=unique_tags,
            confidence=confidence
        )

    except json.JSONDecodeError as e:
        # Fallback: try to extract tags manually
        print(f"JSON decode error: {e}. Response: {response_text}")
        return TagAnalysisResponse(tags=[], confidence=0.0)

    except Exception as e:
        print(f"Error extracting tags: {e}")
        return TagAnalysisResponse(tags=[], confidence=0.0)


def normalize_tag(tag: str) -> str:
    """Normalize tag variations to canonical forms"""
    normalization_map = {
        "workout": "exercise",
        "gym workout": "gym",
        "weight training": "gym",
        "cardio": "exercise",
        "running": "run",
        "jogging": "run",
        "dinner": "meal",
        "lunch": "meal",
        "breakfast": "meal",
    }

    return normalization_map.get(tag.lower(), tag.lower())
