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
import { DayEntry, Mood } from '../types';
import MoodPicker from './MoodPicker';

interface DayDetailModalProps {
  visible: boolean;
  date: string;
  entry?: DayEntry;
  onClose: () => void;
  onSave: (date: string, entry: DayEntry) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({
  visible,
  date,
  entry,
  onClose,
  onSave,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(entry?.mood);
  const [notes, setNotes] = useState(entry?.notes || '');

  useEffect(() => {
    setSelectedMood(entry?.mood);
    setNotes(entry?.notes || '');
  }, [entry, date]);

  const handleSave = () => {
    const updatedEntry: DayEntry = {
      date,
      mood: selectedMood,
      notes: notes.trim() || undefined,
      tags: entry?.tags,
      timestamps: entry?.timestamps,
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
