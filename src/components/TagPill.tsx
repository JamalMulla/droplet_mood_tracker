import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TagPillProps {
  tag: string;
  onRemove?: () => void;
  color?: string;
}

const TagPill: React.FC<TagPillProps> = ({ tag, onRemove, color = '#4ECDC4' }) => {
  return (
    <View style={[styles.container, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.text, { color }]}>{tag}</Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.removeText, { color }]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    marginLeft: 6,
  },
  removeText: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

export default TagPill;
