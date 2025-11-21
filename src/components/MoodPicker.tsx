import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Mood } from '../types';
import { MOODS } from '../constants/moods';

interface MoodPickerProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
}

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling?</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodList}
      >
        {MOODS.map((mood) => {
          const isSelected = selectedMood?.color === mood.color;
          return (
            <TouchableOpacity
              key={mood.color}
              style={[
                styles.moodItem,
                { backgroundColor: mood.color },
                isSelected && styles.selectedMood,
              ]}
              onPress={() => onMoodSelect(mood)}
              activeOpacity={0.8}
            >
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  moodList: {
    paddingHorizontal: 15,
  },
  moodItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  selectedMood: {
    borderWidth: 3,
    borderColor: '#000',
  },
  moodLabel: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default MoodPicker;
