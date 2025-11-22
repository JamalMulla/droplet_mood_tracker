# iOS Build Setup for GitHub Actions

Setting up automated iOS builds is more complex than Android due to Apple's requirements. This guide walks you through the complete setup.

## Prerequisites

- **Apple Developer Account** ($99/year)
- **Mac with Xcode** (for certificate generation)
- **GitHub repository admin access**

## Step-by-Step Setup

### 1. Register Your App

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a new **App ID**:
   - Platform: iOS
   - Bundle ID: `com.yourcompany.squircle` (must match Xcode project)
   - Capabilities: Enable what you need (Push Notifications, etc.)

### 2. Register Your Device

1. Get your iPhone's UDID:
   ```bash
   # Connect iPhone via USB
   # Open Finder/iTunes
   # Click on device, click on serial number to reveal UDID
   ```
   Or use:
   ```bash
   idevice_id -l
   ```

2. In Apple Developer Portal:
   - Go to **Devices**
   - Click **+** to register new device
   - Enter Name and UDID

### 3. Create Certificate

**On your Mac:**

1. Open **Keychain Access**
2. Menu: **Keychain Access** → **Certificate Assistant** → **Request a Certificate from a Certificate Authority**
3. Enter your email
4. Select "Saved to disk"
5. Save the `.certSigningRequest` file

**In Apple Developer Portal:**

1. Go to **Certificates**
2. Click **+** to create new certificate
3. Select **iOS Distribution** (for App Store/Ad Hoc)
4. Upload your `.certSigningRequest`
5. Download the certificate (`.cer` file)

**Back on your Mac:**

1. Double-click the downloaded `.cer` to add to Keychain
2. In Keychain Access, find the certificate
3. Right-click → **Export** as `.p12`
4. Set a password (you'll need this later)

### 4. Create Provisioning Profile

**In Apple Developer Portal:**

1. Go to **Profiles**
2. Click **+** to create new profile
3. Select **Ad Hoc** (for testing on registered devices)
4. Select your App ID
5. Select the certificate you created
6. Select the devices you want to test on
7. Give it a name: `Squircle AdHoc`
8. Download the `.mobileprovision` file

### 5. Create Export Options

Create `ios/exportOptions.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>com.yourcompany.squircle</key>
        <string>Squircle AdHoc</string>
    </dict>
    <key>signingStyle</key>
    <string>manual</string>
    <key>signingCertificate</key>
    <string>iOS Distribution</string>
</dict>
</plist>
```

Find your Team ID in Apple Developer Portal → Membership.

### 6. Encode Files for GitHub Secrets

**Encode certificate:**
```bash
base64 -i certificate.p12 | pbcopy
# Now paste into GitHub secret
```

**Encode provisioning profile:**
```bash
base64 -i Squircle_AdHoc.mobileprovision | pbcopy
# Now paste into GitHub secret
```

### 7. Add GitHub Secrets

Go to your repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `APPLE_CERTIFICATE_BASE64` | Base64 of `.p12` file |
| `APPLE_CERTIFICATE_PASSWORD` | Password you set for `.p12` |
| `APPLE_PROVISIONING_PROFILE_BASE64` | Base64 of `.mobileprovision` |
| `APPLE_TEAM_ID` | Your Team ID |

### 8. Update Workflow (Optional)

The workflow `.github/workflows/build-ios.yml` should now work!

For more control, you can customize it:

```yaml
- name: Import Certificate
  env:
    CERTIFICATE_BASE64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}
    CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
  run: |
    echo $CERTIFICATE_BASE64 | base64 --decode > certificate.p12
    security create-keychain -p actions build.keychain
    security default-keychain -s build.keychain
    security unlock-keychain -p actions build.keychain
    security import certificate.p12 -k build.keychain -P $CERTIFICATE_PASSWORD -T /usr/bin/codesign
    security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k actions build.keychain

- name: Import Provisioning Profile
  env:
    PROVISIONING_PROFILE_BASE64: ${{ secrets.APPLE_PROVISIONING_PROFILE_BASE64 }}
  run: |
    mkdir -p ~/Library/MobileDevice/Provisioning\ Profiles
    echo $PROVISIONING_PROFILE_BASE64 | base64 --decode > ~/Library/MobileDevice/Provisioning\ Profiles/squircle.mobileprovision
```

## Testing the Build

1. Push to `main` or manually trigger workflow
2. Go to **Actions** tab
3. Watch the build progress
4. Download IPA from artifacts

## Installing the IPA

### Method 1: Xcode (Easiest for Dev)

1. Connect your iPhone
2. Open Xcode → **Window** → **Devices and Simulators**
3. Select your device
4. Drag and drop the `.ipa` file
5. App installs!

### Method 2: Diawi (Quick Share)

1. Upload IPA to [Diawi](https://www.diawi.com/)
2. Get shareable link
3. Open link on iPhone
4. Install from Safari

### Method 3: TestFlight (Professional)

1. Upload IPA to App Store Connect
2. Add to TestFlight
3. Invite testers via email
4. They install via TestFlight app

## Troubleshooting

### "No provisioning profiles found"
- Verify provisioning profile includes your certificate
- Check Bundle ID matches exactly
- Ensure device UDID is registered

### "Certificate expired"
- Certificates expire after 1 year
- Create new certificate
- Update GitHub secret

### "Unable to install"
- Device UDID must be in provisioning profile
- Check you're using Ad Hoc profile (not Development)
- Verify Team ID is correct

### Build fails with signing error
- Check certificate password is correct
- Ensure base64 encoding was done correctly
- Verify secrets are named exactly as workflow expects

## Alternative: App Store Distribution

For production releases:

1. Use **App Store** distribution profile (not Ad Hoc)
2. Create App Store provisioning profile
3. Update `exportOptions.plist`:
   ```xml
   <key>method</key>
   <string>app-store</string>
   ```
4. Upload to App Store Connect
5. Submit for review

## Cost Comparison

| Method | Cost | Audience |
|--------|------|----------|
| Ad Hoc | $99/year | Up to 100 devices |
| TestFlight | $99/year | External testers (10,000) |
| App Store | $99/year | Public |
| Enterprise | $299/year | Internal company only |

## Resources

- [Apple Developer Portal](https://developer.apple.com/account)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Fastlane](https://fastlane.tools/) - Automate more!
- [Match](https://docs.fastlane.tools/actions/match/) - Team certificate management

## Pro Tips

1. **Use Fastlane**: Automate certificate management
   ```bash
   fastlane match adhoc
   ```

2. **Rotate Certificates Yearly**: Set calendar reminder

3. **Keep Backups**: Store `.p12` and passwords securely

4. **Use Match for Teams**: Sync certificates via Git

5. **TestFlight for Beta**: Much easier than Ad Hoc for multiple testers
