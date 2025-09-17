# Zenbloom Page

Interactive mood visualization page for the ZenZone app. This React Native Expo component displays a sunflower (Zenbloom) in different emotional states with smooth animations and interactive elements.

## Project Structure

```
ZenbloomPage/
├── components/          # React Native components
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces and types
├── styles/             # StyleSheet definitions
├── index.ts            # Main entry point
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

## Features

- **Three Mood States**: Happy, Sad, Angry with distinct visual themes
- **Smooth Animations**: Sunflower sway, cloud movement, butterfly animations
- **Interactive Elements**: Mood and growth tracking buttons
- **Environmental Effects**: Rain for sad mood, fire effects for angry mood
- **Progress Tracking**: Growth streak visualization with animated progress bars

## Asset Dependencies

This component uses image assets from `../Zenbloom/Images/` folder:
- Sunflower states (Happy, Sad, Angry)
- Background environments
- Interactive buttons and UI elements
- Animated elements (clouds, butterflies, rain)

## TypeScript Support

Full TypeScript support with comprehensive interfaces for:
- Mood configurations and assets
- Animation references and controls
- Component props and state management
- Shared assets and configurations

## Getting Started

1. Ensure all image assets are available in `../Zenbloom/Images/`
2. Install dependencies: `npm install`
3. Import and use the ZenbloomContainer component in your app

## Requirements Covered

- **1.1**: Sunflower displays appropriate mood-specific assets
- **1.2**: Facial expressions match current mood state  
- **1.3**: Mood-specific visual elements and animations