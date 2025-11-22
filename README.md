# Squircle - Mood Tracking App

Squircle is a React Native mobile application for tracking your daily mood through a visual pixel-based calendar. Inspired by Pixels, it allows you to pick a mood/color for each day of the year and add notes.

## Features

- **Visual Pixel Calendar**: View your entire year at a glance with color-coded mood pixels
- **Daily Mood Tracking**: Select from 12 predefined moods with associated colors
- **Notes**: Add text notes for each day to capture thoughts and activities
- **Local Storage**: All data is stored locally on your device using AsyncStorage
- **Clean UI**: Simple, intuitive interface focused on ease of use

## Tech Stack

- **React Native** (CLI, not Expo)
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **React Hooks** for state management

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── DayPixel.tsx    # Individual day pixel component
│   ├── PixelsCalendar.tsx  # Main calendar grid
│   ├── MoodPicker.tsx  # Mood selection component
│   └── DayDetailModal.tsx  # Modal for editing day details
├── screens/            # Screen components
│   └── HomeScreen.tsx  # Main home screen
├── hooks/              # Custom React hooks
│   └── useMoodData.ts  # Hook for managing mood data
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── dateUtils.ts    # Date manipulation utilities
│   └── storage.ts      # AsyncStorage utilities
└── constants/          # App constants
    └── moods.ts        # Mood definitions and colors
```

## Setup Instructions

### Prerequisites

- Node.js >= 18
- React Native development environment set up ([guide](https://reactnative.dev/docs/environment-setup))
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and Android SDK

### Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Running the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Metro Bundler:**
```bash
npm start
```

## 📲 Install on Your Phone

### Option 1: Download Pre-Built APK (Android - Easiest!)

1. Go to [**Actions**](../../actions/workflows/build-android.yml) tab
2. Click the latest successful build
3. Download **app-release-apk** artifact
4. Transfer to your Android phone and install

**Full guide**: See [docs/MOBILE_BUILDS.md](docs/MOBILE_BUILDS.md)

### Option 2: Build Locally

**Android:**
```bash
cd android
./gradlew assembleRelease
# APK at: android/app/build/outputs/apk/release/app-release.apk
```

**iOS:**
```bash
cd ios
pod install
# Then build in Xcode
```

## Usage

1. **View Calendar**: The main screen shows a pixel grid representing all days of the current year
2. **Select a Day**: Tap any pixel to open the day detail modal
3. **Choose Mood**: Scroll through the mood options and tap to select
4. **Add Notes**: Type notes about your day in the text area
5. **Save**: Tap "Save" to persist your entry

## Future Enhancements

- AI-powered tag extraction from notes
- Activity tracking and insights
- Reports based on moods and activities
- Timeline/timestamp mode for multiple entries per day
- More granular mood tracking
- FastAPI backend for cloud sync and AI features
- Activity pattern analysis (e.g., "went running 15 times this year")

## Mobile Architecture Notes

### State Management
- Uses React Context/Hooks for simple state management
- Custom hook (`useMoodData`) encapsulates data fetching and updates
- Ready to integrate with Redux or other state management if needed

### Data Persistence
- AsyncStorage for local data storage
- JSON serialization for mood data
- Easy to migrate to cloud storage later

### Component Architecture
- Atomic design principles: small, reusable components
- Props-based communication between components
- TypeScript for compile-time type checking

### Future Backend Integration
- Ready for FastAPI backend integration
- Storage layer abstracted in `utils/storage.ts`
- Easy to add API calls for:
  - AI tag extraction
  - Cloud sync
  - Reports generation
  - Activity analysis

## License

MIT
