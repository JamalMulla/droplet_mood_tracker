export type Mood = {
  color: string;
  label: string;
};

export type DayEntry = {
  date: string; // ISO date format YYYY-MM-DD
  mood?: Mood;
  notes?: string;
  tags?: string[];
  timestamps?: Timestamp[];
};

export type Timestamp = {
  id: string;
  time: string; // ISO timestamp
  content: string;
};

export type MoodData = {
  [date: string]: DayEntry;
};
