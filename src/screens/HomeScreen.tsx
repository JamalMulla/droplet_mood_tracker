import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import PixelsCalendar from '../components/PixelsCalendar';
import DayDetailModal from '../components/DayDetailModal';
import { useMoodData } from '../hooks/useMoodData';
import { DayEntry } from '../types';

const HomeScreen: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { moodData, isLoading, updateDayEntry } = useMoodData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDayPress = (date: string) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedDate(null);
  };

  const handleSave = (date: string, entry: DayEntry) => {
    updateDayEntry(date, entry);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PixelsCalendar
        year={currentYear}
        moodData={moodData}
        onDayPress={handleDayPress}
      />

      {selectedDate && (
        <DayDetailModal
          visible={modalVisible}
          date={selectedDate}
          entry={moodData[selectedDate]}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;
