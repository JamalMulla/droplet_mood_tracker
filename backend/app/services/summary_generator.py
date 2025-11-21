from app.core.llm import llm_client
from app.models.schemas import SummaryRequest, SummaryResponse, DayEntry
from typing import List, Dict
from collections import Counter
from datetime import datetime


SUMMARY_SYSTEM_PROMPT = """You are an expert at analyzing mood tracking data and generating insightful, human-readable summaries.

Your task is to create engaging summaries that help users understand their patterns and habits.

Guidelines:
1. Be conversational and encouraging
2. Focus on actionable insights
3. Highlight interesting patterns
4. Use specific numbers and dates
5. Connect activities to moods when relevant
6. Keep it concise but informative (3-5 sentences)

Examples:
"In October, you hit the gym 10 times - impressive consistency! You focused mainly on chest (4 sessions) and back (3 sessions). Your mood was consistently energetic after workouts, especially morning sessions. Keep up the great routine!"

"This month you spent quality time with friends 8 times, and your mood was happiest on those days. You enjoyed a mix of dinner outings (4x) and casual hangouts (4x). Social connections seem to really boost your mood!"
"""


SUMMARY_USER_PROMPT = """Generate a summary for this time period:

Date Range: {start_date} to {end_date}
Focus: {focus}

Tag Statistics:
{tag_stats}

Mood Statistics:
{mood_stats}

Key Entries:
{sample_entries}

Generate an engaging 3-5 sentence summary highlighting the most interesting patterns and insights."""


async def generate_summary(request: SummaryRequest) -> SummaryResponse:
    """
    Generate intelligent summary from diary entries

    Args:
        request: Summary request with entries and date range

    Returns:
        SummaryResponse with summary text and highlights
    """
    # Analyze tags
    tag_stats = _analyze_tags(request.entries)

    # Analyze moods
    mood_stats = _analyze_moods(request.entries)

    # Sample interesting entries
    sample_entries = _get_sample_entries(request.entries, limit=5)

    # Format stats for LLM
    tag_stats_str = "\n".join([f"- {tag}: {count} times" for tag, count in tag_stats.most_common(10)])
    mood_stats_str = "\n".join([f"- {mood}: {count} times" for mood, count in mood_stats.most_common(5)])
    sample_entries_str = "\n".join([f"- {e.date}: {e.notes[:100]}..." if e.notes else f"- {e.date}: [No notes]" for e in sample_entries])

    user_prompt = SUMMARY_USER_PROMPT.format(
        start_date=request.date_range.start,
        end_date=request.date_range.end,
        focus=request.focus,
        tag_stats=tag_stats_str or "No tags found",
        mood_stats=mood_stats_str or "No mood data",
        sample_entries=sample_entries_str or "No entries"
    )

    try:
        # Generate summary with LLM
        summary_text = await llm_client.generate(
            prompt=user_prompt,
            system_prompt=SUMMARY_SYSTEM_PROMPT,
            temperature=0.7,  # More creative for summaries
            max_tokens=500
        )

        # Generate highlights
        highlights = _generate_highlights(tag_stats, mood_stats, request.entries)

        return SummaryResponse(
            summary=summary_text.strip(),
            highlights=highlights
        )

    except Exception as e:
        print(f"Error generating summary: {e}")
        # Fallback to simple stats
        return SummaryResponse(
            summary=f"You tracked {len(request.entries)} days between {request.date_range.start} and {request.date_range.end}.",
            highlights=_generate_highlights(tag_stats, mood_stats, request.entries)
        )


def _analyze_tags(entries: List[DayEntry]) -> Counter:
    """Count tag frequency across entries"""
    tag_counter = Counter()

    for entry in entries:
        if entry.tags:
            tag_counter.update(entry.tags)

    return tag_counter


def _analyze_moods(entries: List[DayEntry]) -> Counter:
    """Count mood frequency across entries"""
    mood_counter = Counter()

    for entry in entries:
        if entry.mood:
            mood_counter[entry.mood.label] += 1

    return mood_counter


def _get_sample_entries(entries: List[DayEntry], limit: int = 5) -> List[DayEntry]:
    """Get a sample of interesting entries (with notes and tags)"""
    # Filter entries with notes
    entries_with_notes = [e for e in entries if e.notes and len(e.notes) > 20]

    # Sort by note length (longer = more detailed)
    sorted_entries = sorted(entries_with_notes, key=lambda e: len(e.notes or ""), reverse=True)

    return sorted_entries[:limit]


def _generate_highlights(tag_stats: Counter, mood_stats: Counter, entries: List[DayEntry]) -> List[str]:
    """Generate key highlights from statistics"""
    highlights = []

    # Top activity
    if tag_stats:
        top_tag, top_count = tag_stats.most_common(1)[0]
        highlights.append(f"Most common activity: {top_tag} ({top_count} times)")

    # Top mood
    if mood_stats:
        top_mood, mood_count = mood_stats.most_common(1)[0]
        highlights.append(f"Most frequent mood: {top_mood} ({mood_count} times)")

    # Total tracking days
    highlights.append(f"Total days tracked: {len(entries)}")

    # Days with notes
    notes_count = len([e for e in entries if e.notes])
    if notes_count > 0:
        highlights.append(f"Days with journal entries: {notes_count}")

    return highlights
