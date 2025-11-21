import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { DayEntry, Mood, Timestamp } from '../types';
import MoodPicker from './MoodPicker';
import TimelineEntry from './TimelineEntry';
import TagInput from './TagInput';

interface DayDetailModalProps {
  visible: boolean;
  date: string;
  entry?: DayEntry;
  onClose: () => void;
  onSave: (date: string, entry: DayEntry) => void;
}

type ViewMode = 'note' | 'timeline';

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  visible,
  date,
  entry,
  onClose,
  onSave,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(entry?.mood);
  const [notes, setNotes] = useState(entry?.notes || '');
  const [timestamps, setTimestamps] = useState<Timestamp[]>(entry?.timestamps || []);
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [viewMode, setViewMode] = useState<ViewMode>('note');
  const [editingTimestampId, setEditingTimestampId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedMood(entry?.mood);
    setNotes(entry?.notes || '');
    setTimestamps(entry?.timestamps || []);
    setTags(entry?.tags || []);
    // Auto-switch to timeline if timestamps exist
    if (entry?.timestamps && entry.timestamps.length > 0) {
      setViewMode('timeline');
    } else {
      setViewMode('note');
    }
    setEditingTimestampId(null);
  }, [entry, date]);

  const handleAddTimestamp = () => {
    const newTimestamp: Timestamp = {
      id: Date.now().toString(),
      time: new Date().toISOString(),
      content: '',
    };
    setTimestamps([...timestamps, newTimestamp]);
    setEditingTimestampId(newTimestamp.id);
  };

  const handleTimestampContentChange = (id: string, content: string) => {
    setTimestamps(timestamps.map(ts =>
      ts.id === id ? { ...ts, content } : ts
    ));
  };

  const handleDeleteTimestamp = (id: string) => {
    setTimestamps(timestamps.filter(ts => ts.id !== id));
    setEditingTimestampId(null);
  };

  const handleSave = () => {
    const updatedEntry: DayEntry = {
      date,
      mood: selectedMood,
      notes: viewMode === 'note' ? (notes.trim() || undefined) : entry?.notes,
      tags: tags.length > 0 ? tags : undefined,
      timestamps: viewMode === 'timeline' ? timestamps.filter(ts => ts.content.trim()) : entry?.timestamps,
    };
    onSave(date, updatedEntry);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.dateText}>{formattedDate}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <MoodPicker selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeButton, viewMode === 'note' && styles.modeButtonActive]}
                onPress={() => setViewMode('note')}
              >
                <Text style={[styles.modeButtonText, viewMode === 'note' && styles.modeButtonTextActive]}>
                  Note
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeButton, viewMode === 'timeline' && styles.modeButtonActive]}
                onPress={() => setViewMode('timeline')}
              >
                <Text style={[styles.modeButtonText, viewMode === 'timeline' && styles.modeButtonTextActive]}>
                  Timeline
                </Text>
              </TouchableOpacity>
            </View>

            {viewMode === 'note' ? (
              <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <TextInput
                  style={styles.notesInput}
                  multiline
                  placeholder="How was your day? What did you do?"
                  placeholderTextColor="#999"
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </View>
            ) : (
              <View style={styles.timelineSection}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.sectionTitle}>Timeline</Text>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddTimestamp}>
                    <Text style={styles.addButtonText}>+ Add Entry</Text>
                  </TouchableOpacity>
                </View>
                {timestamps.length === 0 ? (
                  <View style={styles.emptyTimeline}>
                    <Text style={styles.emptyText}>No entries yet. Tap "Add Entry" to start.</Text>
                  </View>
                ) : (
                  timestamps.map((timestamp) => (
                    <TimelineEntry
                      key={timestamp.id}
                      timestamp={timestamp}
                      isEditing={editingTimestampId === timestamp.id}
                      onEdit={() => setEditingTimestampId(timestamp.id)}
                      onDelete={() => handleDeleteTimestamp(timestamp.id)}
                      onContentChange={(content) => handleTimestampContentChange(timestamp.id, content)}
                      onSave={() => setEditingTimestampId(null)}
                    />
                  ))
                )}
              </View>
            )}

            <TagInput
              tags={tags}
              onTagsChange={setTags}
              moodColor={selectedMood?.color}
            />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    paddingLeft: 10,
  },
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#333',
  },
  notesSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    minHeight: 150,
    fontSize: 15,
    color: '#333',
  },
  timelineSection: {
    padding: 20,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyTimeline: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DayDetailModal;
