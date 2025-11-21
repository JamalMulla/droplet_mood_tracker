import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodData } from '../types';

const STORAGE_KEY = '@squircle_mood_data';

export const saveMoodData = async (data: MoodData): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mood data:', error);
    throw error;
  }
};

export const loadMoodData = async (): Promise<MoodData> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error loading mood data:', error);
    return {};
  }
};
