import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import DayPixel from './DayPixel';
import { MoodData } from '../types';
import { getDaysInYear, formatDate, isToday as checkIsToday } from '../utils/dateUtils';

interface PixelsCalendarProps {
  year: number;
  moodData: MoodData;
  onDayPress: (date: string) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_PER_WEEK = 7;

const PixelsCalendar: React.FC<PixelsCalendarProps> = ({ year, moodData, onDayPress }) => {
  const days = useMemo(() => getDaysInYear(year), [year]);

  // Group days by week for grid layout
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day, index) => {
      if (index === 0) {
        // Add padding for first week
        const dayOfWeek = day.getDay();
        currentWeek = new Array(dayOfWeek).fill(null);
      }

      currentWeek.push(day);

      if (currentWeek.length === DAYS_PER_WEEK) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    });

    // Add last week if not complete
    if (currentWeek.length > 0) {
      while (currentWeek.length < DAYS_PER_WEEK) {
        currentWeek.push(null as any);
      }
      weeksArray.push(currentWeek);
    }

    return weeksArray;
  }, [days]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.yearText}>{year}</Text>
      </View>

      <View style={styles.monthLabels}>
        {MONTHS.map((month, index) => (
          <Text key={month} style={styles.monthLabel}>
            {month}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((day, dayIndex) => {
              if (!day) {
                return <View key={`empty-${dayIndex}`} style={styles.emptyPixel} />;
              }

              const dateStr = formatDate(day);
              const entry = moodData[dateStr];
              const color = entry?.mood?.color;
              const today = checkIsToday(day);

              return (
                <DayPixel
                  key={dateStr}
                  color={color}
                  onPress={() => onDayPress(dateStr)}
                  isToday={today}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  monthLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emptyPixel: {
    width: 12,
    height: 12,
    margin: 1,
  },
});

export default PixelsCalendar;
