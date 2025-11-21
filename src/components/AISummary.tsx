import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MoodData } from '../types';
import { generateSummary } from '../utils/api';

interface AISummaryProps {
  moodData: MoodData;
  startDate: string;
  endDate: string;
}

const AISummary: React.FC<AISummaryProps> = ({ moodData, startDate, endDate }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert moodData to entries array
      const entries = Object.values(moodData).filter(
        entry => entry.date >= startDate && entry.date <= endDate
      );

      const result = await generateSummary(startDate, endDate, entries);

      if (result) {
        setSummary(result.summary);
        setHighlights(result.highlights);
      } else {
        setError('Failed to generate summary. Is the backend running?');
      }
    } catch (err) {
      setError('Error generating summary');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate on mount if data exists
  useEffect(() => {
    const entries = Object.values(moodData).filter(
      entry => entry.date >= startDate && entry.date <= endDate
    );

    if (entries.length > 0 && !summary && !isLoading) {
      handleGenerate();
    }
  }, [startDate, endDate, moodData]);

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.title}>AI Summary</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleGenerate}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.title}>AI Summary</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Generating intelligent summary...</Text>
        </View>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤖</Text>
          <Text style={styles.title}>AI Summary</Text>
        </View>
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>✨ Generate AI Summary</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🤖</Text>
        <Text style={styles.title}>AI Summary</Text>
        <TouchableOpacity onPress={handleGenerate} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.summaryText}>{summary}</Text>

      {highlights.length > 0 && (
        <View style={styles.highlightsSection}>
          <Text style={styles.highlightsTitle}>Key Highlights</Text>
          {highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <Text style={styles.highlightBullet}>•</Text>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6C63FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C63FF',
    flex: 1,
  },
  refreshButton: {
    padding: 5,
  },
  refreshText: {
    fontSize: 20,
  },
  summaryText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  highlightsSection: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C63FF',
    marginBottom: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  highlightBullet: {
    fontSize: 14,
    color: '#6C63FF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  highlightText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  errorContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#D32F2F',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default AISummary;
