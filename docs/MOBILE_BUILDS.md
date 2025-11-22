# Mobile App Builds - GitHub Actions Guide

This guide explains how to build and install Squircle on your phone using automated GitHub Actions.

## 🤖 Automated Builds

Every time you merge to `main` or `master`, GitHub Actions automatically builds:
- **Android APK** - Ready to install directly on your phone
- **Android AAB** - For Google Play Store distribution
- **iOS IPA** - For TestFlight or App Store (requires Apple Developer account)

## 📱 Android Installation (Easiest!)

### Step 1: Trigger a Build
1. Merge your code to `main` or `master` branch
2. Or manually trigger: Go to **Actions** → **Build Android APK** → **Run workflow**

### Step 2: Download the APK
1. Go to **Actions** tab on GitHub
2. Click the latest successful workflow run
3. Scroll to **Artifacts** section
4. Download **app-release-apk**
5. Unzip the downloaded file to get `app-release.apk`

### Step 3: Install on Your Phone
1. Transfer `app-release.apk` to your Android phone (via USB, email, or cloud storage)
2. On your phone:
   - Go to **Settings** → **Security** → **Unknown Sources**
   - Enable **Install from Unknown Sources** (or allow your file manager)
3. Use a file manager to find the APK
4. Tap the APK to install
5. Launch **Squircle**!

### Alternative: Direct Install via ADB
```bash
# Connect your phone via USB with USB debugging enabled
adb install app-release.apk
```

## 🍎 iOS Installation (More Complex)

iOS builds require an **Apple Developer Account** ($99/year) and proper certificates.

### Prerequisites
1. Apple Developer Account
2. Development Certificate
3. Provisioning Profile
4. App ID registered in Apple Developer Portal

### Setup (One-time)

1. **Generate Certificates** (on Mac with Xcode):
   ```bash
   # Open Keychain Access
   # Create a Certificate Signing Request (CSR)
   # Upload to Apple Developer Portal
   # Download the certificate
   ```

2. **Create Provisioning Profile**:
   - Go to Apple Developer Portal
   - Register your device UDID
   - Create provisioning profile including your device
   - Download the profile

3. **Add to GitHub Secrets**:
   - Go to repository **Settings** → **Secrets and variables** → **Actions**
   - Add these secrets:
     ```
     APPLE_CERTIFICATE_BASE64: <base64 encoded .p12 file>
     APPLE_CERTIFICATE_PASSWORD: <certificate password>
     APPLE_PROVISIONING_PROFILE_BASE64: <base64 encoded .mobileprovision>
     ```

4. **Create exportOptions.plist**:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
   <plist version="1.0">
   <dict>
       <key>method</key>
       <string>ad-hoc</string>
       <key>teamID</key>
       <string>YOUR_TEAM_ID</string>
   </dict>
   </plist>
   ```
   Place in `ios/exportOptions.plist`

### Installing IPA
Once built:
1. Download IPA from GitHub Actions artifacts
2. Install via:
   - **TestFlight**: Upload to App Store Connect
   - **Xcode**: Window → Devices and Simulators → Add IPA
   - **Third-party tools**: Diawi, Install on Air

## 🚀 Quick Start (Android Only)

For the fastest path to running on your phone:

```bash
# 1. Push to main
git push origin main

# 2. Go to GitHub Actions
# 3. Wait for build to complete (~5 minutes)
# 4. Download app-release-apk artifact
# 5. Install on your phone!
```

## 📦 Build Artifacts Explained

| Artifact | Description | Use Case |
|----------|-------------|----------|
| **app-release.apk** | Android Package | Install directly on your phone |
| **app-release.aab** | Android App Bundle | Upload to Google Play Store |
| **app-release.ipa** | iOS App Package | Install via TestFlight or Xcode |

## 🔐 Signing (Production)

For production releases, you'll want to sign your apps:

### Android Signing
1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore squircle-release.keystore \
     -alias squircle -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Add to GitHub Secrets:
   - `ANDROID_KEYSTORE_BASE64`
   - `ANDROID_KEY_ALIAS`
   - `ANDROID_KEY_PASSWORD`
   - `ANDROID_STORE_PASSWORD`

3. Update workflow to use signed builds

### iOS Signing
Handled via certificates and provisioning profiles (see iOS setup above)

## 🐛 Troubleshooting

### Android APK Won't Install
- Enable "Install from Unknown Sources"
- Check if you have enough storage
- Try uninstalling previous version first

### iOS Build Fails
- Verify Apple Developer account is active
- Check certificate hasn't expired
- Ensure device UDID is in provisioning profile
- Verify all secrets are correctly base64 encoded

### Build Takes Too Long
- GitHub Actions free tier: 2000 minutes/month
- Android builds: ~5-10 minutes
- iOS builds: ~10-15 minutes
- Use workflow_dispatch for manual control

## 📲 Alternative: Manual Builds

Don't want to wait for CI? Build locally:

### Android
```bash
cd android
./gradlew assembleRelease
# APK at: android/app/build/outputs/apk/release/app-release.apk
```

### iOS
```bash
cd ios
pod install
xcodebuild -workspace Squircle.xcworkspace -scheme Squircle -configuration Release archive
```

## 🎯 Recommendations

**For Development:**
- Use Android for fastest iteration
- APK installs in seconds
- No Apple Developer account required

**For Production:**
- Sign both Android and iOS
- Use AAB for Play Store
- Use IPA for App Store/TestFlight

**For Testing:**
- Use workflow_dispatch for on-demand builds
- Keep artifacts for 30 days
- Test on real devices before publishing

## 📚 Additional Resources

- [React Native Publishing](https://reactnative.dev/docs/signed-apk-android)
- [GitHub Actions for React Native](https://github.com/marketplace/actions/react-native-action)
- [Android Developer Guide](https://developer.android.com/studio/publish)
- [iOS Distribution Guide](https://developer.apple.com/distribute/)
