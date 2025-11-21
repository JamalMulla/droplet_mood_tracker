import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MoodStats } from '../utils/analytics';

interface MoodChartProps {
  stats: MoodStats[];
}

const MoodChart: React.FC<MoodChartProps> = ({ stats }) => {
  if (stats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No mood data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Distribution</Text>

      {/* Bar chart */}
      <View style={styles.chart}>
        {stats.map((mood) => (
          <View key={mood.moodLabel} style={styles.barContainer}>
            <View style={styles.barInfo}>
              <Text style={styles.moodLabel}>{mood.moodLabel}</Text>
              <Text style={styles.moodCount}>{mood.count}</Text>
            </View>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: mood.color,
                    width: `${mood.percentage}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{mood.percentage.toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  chart: {
    gap: 12,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barInfo: {
    width: 80,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  moodCount: {
    fontSize: 11,
    color: '#666',
  },
  barWrapper: {
    flex: 1,
    height: 24,
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 12,
  },
  percentage: {
    width: 50,
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});

export default MoodChart;
