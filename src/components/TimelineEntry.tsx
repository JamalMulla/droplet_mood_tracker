import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Timestamp } from '../types';

interface TimelineEntryProps {
  timestamp: Timestamp;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  timestamp,
  isEditing,
  onEdit,
  onDelete,
  onContentChange,
  onSave,
}) => {
  const time = new Date(timestamp.time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <View style={styles.container}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{time}</Text>
        <View style={styles.timeline}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>
      </View>

      <View style={styles.contentColumn}>
        {isEditing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={timestamp.content}
              onChangeText={onContentChange}
              multiline
              autoFocus
              placeholder="What's happening?"
              placeholderTextColor="#999"
            />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.contentBox} onPress={onEdit} activeOpacity={0.7}>
            <Text style={styles.contentText}>{timestamp.content}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  timeColumn: {
    width: 70,
    alignItems: 'center',
    paddingTop: 2,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  timeline: {
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ECDC4',
    marginBottom: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  contentColumn: {
    flex: 1,
    paddingRight: 10,
  },
  contentBox: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },
  contentText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  editContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4ECDC4',
  },
  editInput: {
    padding: 12,
    fontSize: 15,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    padding: 8,
    gap: 8,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#4ECDC4',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFE0E0',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TimelineEntry;
