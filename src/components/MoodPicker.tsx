import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Mood } from '../types';
import { MOODS } from '../constants/moods';

interface MoodPickerProps {
  selectedMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
}

const INTENSITY_LEVELS = [1, 2, 3, 4, 5];
const INTENSITY_LABELS = ['Low', 'Mild', 'Moderate', 'Strong', 'Intense'];

const MoodPicker: React.FC<MoodPickerProps> = ({ selectedMood, onMoodSelect }) => {
  const handleIntensityChange = (intensity: number) => {
    if (selectedMood) {
      onMoodSelect({ ...selectedMood, intensity });
    }
  };

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
              onPress={() => onMoodSelect({ ...mood, intensity: selectedMood?.intensity || 3 })}
              activeOpacity={0.8}
            >
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedMood && (
        <View style={styles.intensitySection}>
          <Text style={styles.intensityTitle}>Intensity</Text>
          <View style={styles.intensitySlider}>
            {INTENSITY_LEVELS.map((level) => {
              const isActive = (selectedMood.intensity || 3) >= level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.intensityDot,
                    isActive && [styles.intensityDotActive, { backgroundColor: selectedMood.color }],
                  ]}
                  onPress={() => handleIntensityChange(level)}
                />
              );
            })}
          </View>
          <View style={styles.intensityLabels}>
            <Text style={styles.intensityLabelText}>
              {INTENSITY_LABELS[(selectedMood.intensity || 3) - 1]}
            </Text>
          </View>
        </View>
      )}
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
  intensitySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  intensityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  intensitySlider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  intensityDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    borderWidth: 2,
    borderColor: '#CCC',
  },
  intensityDotActive: {
    borderColor: '#000',
    transform: [{ scale: 1.2 }],
  },
  intensityLabels: {
    alignItems: 'center',
    marginTop: 10,
  },
  intensityLabelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
});

export default MoodPicker;
