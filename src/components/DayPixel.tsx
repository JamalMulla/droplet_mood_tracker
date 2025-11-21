import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { DEFAULT_COLOR } from '../constants/moods';

interface DayPixelProps {
  color?: string;
  onPress: () => void;
  isToday?: boolean;
}

const DayPixel: React.FC<DayPixelProps> = ({ color = DEFAULT_COLOR, onPress, isToday = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.pixel,
        { backgroundColor: color },
        isToday && styles.todayBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    />
  );
};

const styles = StyleSheet.create({
  pixel: {
    width: 12,
    height: 12,
    margin: 1,
    borderRadius: 2,
  },
  todayBorder: {
    borderWidth: 1.5,
    borderColor: '#000',
  },
});

export default DayPixel;
