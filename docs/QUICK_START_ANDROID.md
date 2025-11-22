# Quick Start: Install Squircle on Your Android Phone

The fastest way to get Squircle running on your Android phone in under 5 minutes.

## TL;DR

1. Go to [Actions](https://github.com/YOUR_USERNAME/droplet_mood_tracker/actions/workflows/build-android.yml)
2. Click latest build → Download "app-release-apk"
3. Transfer APK to phone
4. Install and run!

## Detailed Steps

### Step 1: Get the APK (2 minutes)

1. **Trigger a build** (if needed):
   - Push any code to `main` branch, OR
   - Go to **Actions** → **Build Android APK** → **Run workflow** → **Run workflow** button

2. **Wait for build** (~5 minutes):
   - Green checkmark = success
   - Red X = build failed (check logs)

3. **Download the artifact**:
   - Click on the successful workflow run
   - Scroll down to **Artifacts** section
   - Click **app-release-apk** to download
   - Unzip to get `app-release.apk` file

### Step 2: Transfer to Phone (1 minute)

Choose your preferred method:

**Option A: USB Cable**
```bash
# Connect phone via USB
# Enable "File Transfer" mode on phone
# Copy APK to Downloads folder
```

**Option B: Cloud Storage**
- Upload APK to Google Drive/Dropbox
- Download on phone from Drive/Dropbox app

**Option C: Email**
- Email the APK to yourself
- Open email on phone
- Download attachment

**Option D: ADB (Tech-savvy)**
```bash
adb install app-release.apk
```

### Step 3: Install on Phone (1 minute)

1. **Enable Unknown Sources**:
   - Go to **Settings** → **Security** (or **Apps**)
   - Find **Install unknown apps**
   - Select your **File Manager** or **Downloads** app
   - Toggle **Allow from this source** ON

2. **Install the APK**:
   - Open your file manager
   - Navigate to Downloads
   - Tap `app-release.apk`
   - Tap **Install**
   - Tap **Open** when installation completes

3. **Done!** 🎉

## What You Get

- ✅ Full mood tracking calendar
- ✅ Timeline mode with multiple entries per day
- ✅ Mood intensity levels (1-5)
- ✅ AI tag extraction (requires backend running)
- ✅ Manual tagging
- ✅ Reports and insights
- ✅ Local data storage (AsyncStorage)

## Updating the App

When you make changes:

1. **Push to main** → Wait for build
2. **Download new APK**
3. **Install over existing app** (data is preserved!)

Android will automatically update to the new version.

## Troubleshooting

### "Can't install - Package appears to be corrupted"
- Re-download the APK
- Check the zip file wasn't corrupted
- Try a different transfer method

### "For security, your phone is not allowed to install..."
- You need to enable "Install from Unknown Sources"
- Go to Settings → Security → Unknown Sources
- Or Settings → Apps → Special Access → Install Unknown Apps

### "App not installed"
- Check if you have enough storage space
- Try uninstalling the old version first
- Restart your phone and try again

### "App keeps crashing"
- Check you're using a compatible Android version (Android 8.0+)
- Clear app data: Settings → Apps → Squircle → Storage → Clear Data
- Reinstall the app

## Advanced: Build Locally

Want to build yourself instead of using GitHub Actions?

```bash
# In project root
cd android

# Build release APK
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk

# Install via ADB
adb install app/build/outputs/apk/release/app-release.apk
```

## Next Steps

- **Enable AI features**: Run the backend (`cd backend && pixi run dev`)
- **Customize moods**: Edit `src/constants/moods.ts`
- **Add features**: Edit the code and rebuild!

## Need Help?

- Check [MOBILE_BUILDS.md](MOBILE_BUILDS.md) for detailed guide
- Check [GitHub Actions logs](../../actions) if build fails
- Check [React Native docs](https://reactnative.dev/) for RN issues

---

**Happy mood tracking!** 📊📱✨
