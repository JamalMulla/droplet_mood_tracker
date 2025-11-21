import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MoodData } from '../types';
import {
  getMoodDistribution,
  getTagStats,
  generateInsights,
  getCurrentStreak,
  getLongestStreak,
} from '../utils/analytics';
import MoodChart from '../components/MoodChart';
import InsightCard from '../components/InsightCard';
import TagPill from '../components/TagPill';
import AISummary from '../components/AISummary';

interface ReportsScreenProps {
  moodData: MoodData;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ moodData }) => {
  const moodStats = useMemo(() => getMoodDistribution(moodData), [moodData]);
  const tagStats = useMemo(() => getTagStats(moodData), [moodData]);
  const insights = useMemo(() => generateInsights(moodData), [moodData]);
  const currentStreak = useMemo(() => getCurrentStreak(moodData), [moodData]);
  const longestStreak = useMemo(() => getLongestStreak(moodData), [moodData]);

  const totalEntries = Object.values(moodData).filter((e) => e.mood).length;

  // Calculate date range for AI summary (last 30 days)
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    return {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    };
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Reports</Text>
      </View>

      {/* AI Summary */}
      <View style={styles.section}>
        <AISummary
          moodData={moodData}
          startDate={startDate}
          endDate={endDate}
        />
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{totalEntries}</Text>
          <Text style={styles.statLabel}>Total Days</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
      </View>

      {/* Insights */}
      {insights.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </View>
      )}

      {/* Mood Chart */}
      <View style={styles.section}>
        <MoodChart stats={moodStats} />
      </View>

      {/* Tag Statistics */}
      {tagStats.length > 0 && (
        <View style={styles.section}>
          <View style={styles.tagStatsCard}>
            <Text style={styles.sectionTitle}>Top Activities & Tags</Text>
            {tagStats.slice(0, 10).map((tagStat) => (
              <View key={tagStat.tag} style={styles.tagStatRow}>
                <View style={styles.tagInfo}>
                  <TagPill tag={tagStat.tag} />
                  <Text style={styles.tagCount}>{tagStat.count} times</Text>
                </View>
                {tagStat.associatedMoods.length > 0 && (
                  <View style={styles.associatedMoods}>
                    <Text style={styles.associatedLabel}>Usually felt:</Text>
                    {tagStat.associatedMoods.slice(0, 2).map((moodData) => (
                      <View
                        key={moodData.mood}
                        style={[styles.moodBadge, { backgroundColor: `${moodData.color}30` }]}
                      >
                        <Text style={[styles.moodBadgeText, { color: moodData.color }]}>
                          {moodData.mood}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tagStatsCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagStatRow: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  tagCount: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  associatedMoods: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginLeft: 8,
  },
  associatedLabel: {
    fontSize: 11,
    color: '#999',
    marginRight: 4,
  },
  moodBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moodBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default ReportsScreen;
