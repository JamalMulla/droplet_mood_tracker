import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Insight } from '../utils/analytics';

interface InsightCardProps {
  insight: Insight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  return (
    <View style={styles.container}>
      {insight.icon && <Text style={styles.icon}>{insight.icon}</Text>}
      <View style={styles.content}>
        <Text style={styles.title}>{insight.title}</Text>
        <Text style={styles.description}>{insight.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});

export default InsightCard;
