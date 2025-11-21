import { DayEntry, Mood } from '../types';

// Configuration
// TODO: Update this URL when deploying backend
const API_BASE_URL = __DEV__
  ? 'http://localhost:8000'  // Development: local backend
  : 'https://your-production-api.com';  // Production

interface TagAnalysisRequest {
  text: string;
  date: string;
  mood?: Mood;
}

interface TagAnalysisResponse {
  tags: string[];
  confidence: number;
}

interface SummaryRequest {
  date_range: {
    start: string;
    end: string;
  };
  entries: DayEntry[];
  focus?: string;
}

interface SummaryResponse {
  summary: string;
  highlights: string[];
}

/**
 * Extract tags from diary text using LLM
 */
export const extractTags = async (
  text: string,
  date: string,
  mood?: Mood
): Promise<string[]> => {
  try {
    const request: TagAnalysisRequest = {
      text,
      date,
      mood,
    };

    const response = await fetch(`${API_BASE_URL}/api/analyze/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TagAnalysisResponse = await response.json();
    return data.tags;
  } catch (error) {
    console.error('Error extracting tags:', error);
    // Return empty array on error - fail gracefully
    return [];
  }
};

/**
 * Generate intelligent summary for a date range
 */
export const generateSummary = async (
  startDate: string,
  endDate: string,
  entries: DayEntry[],
  focus: string = 'all'
): Promise<SummaryResponse | null> => {
  try {
    const request: SummaryRequest = {
      date_range: {
        start: startDate,
        end: endDate,
      },
      entries,
      focus,
    };

    const response = await fetch(`${API_BASE_URL}/api/summaries/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SummaryResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating summary:', error);
    return null;
  }
};

/**
 * Check if API is available
 */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
