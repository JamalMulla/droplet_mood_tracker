import { useState, useEffect, useCallback } from 'react';
import { MoodData, DayEntry } from '../types';
import { loadMoodData, saveMoodData } from '../utils/storage';

export const useMoodData = () => {
  const [moodData, setMoodData] = useState<MoodData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadMoodData();
        setMoodData(data);
      } catch (error) {
        console.error('Failed to load mood data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const updateDayEntry = useCallback(async (date: string, entry: DayEntry) => {
    setMoodData((prevData) => {
      const newData = { ...prevData, [date]: entry };
      saveMoodData(newData).catch((error) =>
        console.error('Failed to save mood data:', error)
      );
      return newData;
    });
  }, []);

  return {
    moodData,
    isLoading,
    updateDayEntry,
  };
};
