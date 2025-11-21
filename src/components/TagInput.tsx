import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import TagPill from './TagPill';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  moodColor?: string;
}

// Common activity suggestions
const SUGGESTED_TAGS = [
  'work', 'exercise', 'running', 'gym', 'yoga',
  'social', 'friends', 'family', 'date',
  'hobby', 'reading', 'gaming', 'cooking',
  'outdoor', 'indoor', 'travel', 'shopping',
  'meditation', 'music', 'movie', 'tired',
  'stressed', 'productive', 'lazy'
];

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, moodColor = '#4ECDC4' }) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setShowSuggestions(text.length > 0);
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const filteredSuggestions = SUGGESTED_TAGS.filter(
    suggestion =>
      !tags.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  ).slice(0, 6);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tags & Activities</Text>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TagPill
              key={tag}
              tag={tag}
              onRemove={() => removeTag(tag)}
              color={moodColor}
            />
          ))}
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a tag (e.g., work, exercise, friends)"
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          onFocus={() => setShowSuggestions(true)}
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {inputValue.length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsContainer}
        >
          {filteredSuggestions.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestionPill}
              onPress={() => addTag(suggestion)}
            >
              <Text style={styles.suggestionText}>+ {suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionsContainer: {
    marginTop: 10,
  },
  suggestionPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});

export default TagInput;
