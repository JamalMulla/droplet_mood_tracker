import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { DEFAULT_COLOR } from '../constants/moods';

interface DayPixelProps {
  color?: string;
  intensity?: number; // 1-5 scale
  onPress: () => void;
  isToday?: boolean;
}

const DayPixel: React.FC<DayPixelProps> = ({
  color = DEFAULT_COLOR,
  intensity,
  onPress,
  isToday = false
}) => {
  // Map intensity to opacity: 1=0.3, 2=0.5, 3=0.7, 4=0.85, 5=1.0
  const getOpacity = () => {
    if (!intensity || color === DEFAULT_COLOR) return 1;
    return 0.2 + (intensity * 0.16);
  };

  return (
    <TouchableOpacity
      style={[
        styles.pixel,
        { backgroundColor: color, opacity: getOpacity() },
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
