# 🌸 ZenBloom - Expo Setup Guide

## Quick Start with Expo

### 1. Install Expo CLI
```bash
npm install -g @expo/cli
```

### 2. Setup the Project
```bash
cd AI-Bot

# Replace package.json with Expo version
copy package-expo.json package.json

# Install dependencies
npm install
```

### 3. Start the Development Server
```bash
npm start
# or
expo start
```

### 4. View Your App

**On Your Phone:**
1. Install "Expo Go" app from App Store/Google Play
2. Scan the QR code that appears in your terminal
3. Your ZenBloom app will open on your phone!

**On Web Browser:**
- Press `w` in the terminal to open in web browser

**On iOS Simulator:**
- Press `i` in the terminal (requires Xcode on Mac)

**On Android Emulator:**
- Press `a` in the terminal (requires Android Studio)

## Features Available in Expo Version

✅ **Mobile-Optimized UI** - Native mobile components  
✅ **Touch Interactions** - Haptic feedback and gestures  
✅ **Navigation** - Bottom tab navigation  
✅ **Chat Interface** - Simulated AI conversations  
✅ **Progress Tracking** - Mood and streak display  
✅ **Responsive Design** - Works on all screen sizes  

## Current Limitations

⚠️ **AI Integration** - Currently shows simulated responses  
⚠️ **Data Persistence** - Uses local state (resets on reload)  
⚠️ **Real Charts** - Shows placeholder text for now  

## Next Steps

To add full AI functionality to the Expo version:

1. **Add AI Services**: Integrate OpenAI/Hugging Face APIs
2. **Add Storage**: Use AsyncStorage or Expo SecureStore
3. **Add Charts**: Use react-native-chart-kit or Victory Native
4. **Add Real Icons**: Replace placeholder icons with custom ones

## Troubleshooting

**Metro bundler issues:**
```bash
expo start --clear
```

**Dependencies issues:**
```bash
rm -rf node_modules
npm install
```

**Can't scan QR code:**
- Make sure your phone and computer are on the same WiFi
- Try using the tunnel connection: `expo start --tunnel`

## File Structure

```
AI-Bot/
├── App.js                     # Expo entry point
├── app.json                   # Expo configuration
├── components/
│   └── MobileAppExpo.jsx      # Main React Native app
├── assets/                    # App icons and splash screens
└── package.json               # Expo dependencies
```

Happy coding! 🚀