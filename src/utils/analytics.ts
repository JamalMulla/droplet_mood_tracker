import { MoodData, DayEntry, Mood } from '../types';

export interface MoodStats {
  moodLabel: string;
  color: string;
  count: number;
  percentage: number;
}

export interface TagStats {
  tag: string;
  count: number;
  associatedMoods: { mood: string; color: string; count: number }[];
}

export interface Insight {
  type: 'mood' | 'tag' | 'streak' | 'pattern';
  title: string;
  description: string;
  icon?: string;
}

export const getMoodDistribution = (moodData: MoodData): MoodStats[] => {
  const moodCounts: { [key: string]: { label: string; color: string; count: number } } = {};
  let totalEntries = 0;

  Object.values(moodData).forEach((entry) => {
    if (entry.mood) {
      const key = entry.mood.label;
      if (!moodCounts[key]) {
        moodCounts[key] = {
          label: entry.mood.label,
          color: entry.mood.color,
          count: 0,
        };
      }
      moodCounts[key].count++;
      totalEntries++;
    }
  });

  return Object.values(moodCounts)
    .map((mood) => ({
      moodLabel: mood.label,
      color: mood.color,
      count: mood.count,
      percentage: totalEntries > 0 ? (mood.count / totalEntries) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getTagStats = (moodData: MoodData): TagStats[] => {
  const tagCounts: {
    [tag: string]: {
      count: number;
      moods: { [moodLabel: string]: { color: string; count: number } };
    };
  } = {};

  Object.values(moodData).forEach((entry) => {
    if (entry.tags) {
      entry.tags.forEach((tag) => {
        if (!tagCounts[tag]) {
          tagCounts[tag] = { count: 0, moods: {} };
        }
        tagCounts[tag].count++;

        if (entry.mood) {
          const moodLabel = entry.mood.label;
          if (!tagCounts[tag].moods[moodLabel]) {
            tagCounts[tag].moods[moodLabel] = {
              color: entry.mood.color,
              count: 0,
            };
          }
          tagCounts[tag].moods[moodLabel].count++;
        }
      });
    }
  });

  return Object.entries(tagCounts)
    .map(([tag, data]) => ({
      tag,
      count: data.count,
      associatedMoods: Object.entries(data.moods)
        .map(([mood, moodData]) => ({
          mood,
          color: moodData.color,
          count: moodData.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
    }))
    .sort((a, b) => b.count - a.count);
};

export const getCurrentStreak = (moodData: MoodData): number => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (moodData[dateStr]?.mood) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getLongestStreak = (moodData: MoodData): number => {
  const dates = Object.keys(moodData)
    .filter((date) => moodData[date].mood)
    .sort();

  if (dates.length === 0) return 0;

  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const dayDiff = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

export const generateInsights = (moodData: MoodData): Insight[] => {
  const insights: Insight[] = [];
  const moodStats = getMoodDistribution(moodData);
  const tagStats = getTagStats(moodData);
  const currentStreak = getCurrentStreak(moodData);
  const longestStreak = getLongestStreak(moodData);

  // Streak insights
  if (currentStreak > 0) {
    insights.push({
      type: 'streak',
      title: `${currentStreak} Day Streak`,
      description: `You've tracked your mood for ${currentStreak} consecutive days!`,
      icon: '🔥',
    });
  }

  if (longestStreak > 7) {
    insights.push({
      type: 'streak',
      title: `Longest Streak: ${longestStreak} Days`,
      description: 'Keep up the great tracking habit!',
      icon: '🏆',
    });
  }

  // Mood insights
  if (moodStats.length > 0) {
    const topMood = moodStats[0];
    insights.push({
      type: 'mood',
      title: `Most Common Mood: ${topMood.moodLabel}`,
      description: `You felt ${topMood.moodLabel.toLowerCase()} ${topMood.count} times (${topMood.percentage.toFixed(1)}%)`,
      icon: '😊',
    });
  }

  // Tag insights
  if (tagStats.length > 0) {
    const topTag = tagStats[0];
    insights.push({
      type: 'tag',
      title: `Top Activity: ${topTag.tag}`,
      description: `You mentioned "${topTag.tag}" ${topTag.count} times`,
      icon: '⭐',
    });

    // Find correlation between tags and moods
    if (topTag.associatedMoods.length > 0) {
      const topMoodForTag = topTag.associatedMoods[0];
      insights.push({
        type: 'pattern',
        title: `${topTag.tag} → ${topMoodForTag.mood}`,
        description: `You often feel ${topMoodForTag.mood.toLowerCase()} when you ${topTag.tag}`,
        icon: '💡',
      });
    }
  }

  // Total entries insight
  const totalEntries = Object.values(moodData).filter((e) => e.mood).length;
  if (totalEntries > 30) {
    insights.push({
      type: 'pattern',
      title: `${totalEntries} Days Tracked`,
      description: 'Great job building this habit!',
      icon: '📊',
    });
  }

  return insights;
};
