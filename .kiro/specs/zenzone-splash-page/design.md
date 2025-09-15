# Design Document

## Overview

The ZenZone splash screen is designed as a React Native component using Expo, featuring a calming gradient background with multiple animated elements. The design follows a layered approach with background elements, main content (logo and text), and interactive elements (button), all orchestrated with smooth animations to create an engaging user experience.

## Architecture

### Component Structure
```
SplashScreen (Main Container)
├── BackgroundGradient
├── FloatingElements
│   ├── BackgroundShapes (Group.png)
│   ├── Pentagon (pent.png) 
│   └── Bubbles (bubble.png)
├── MainContent
│   ├── Logo (zenzone.png)
│   ├── AppText (text.png)
│   └── Tagline ("The quiet between breaths is where peace blooms.")
└── ActionButton ("GET STARTED")
```

### Technology Stack
- **Framework**: React Native with Expo
- **Animation Library**: React Native Reanimated 3 for smooth, performant animations
- **Styling**: StyleSheet with Flexbox layout
- **Assets**: PNG images from assets directory
- **Navigation**: React Navigation for screen transitions

## Components and Interfaces

### SplashScreen Component
```typescript
interface SplashScreenProps {
  onGetStarted: () => void;
}

interface AnimationState {
  logoScale: SharedValue<number>;
  textTranslateX: SharedValue<number>;
  pentagonShimmer: SharedValue<number>;
  groupFloat: SharedValue<number>;
  bubbleFloat: SharedValue<number>;
}
```

### Animation Specifications

#### Logo Animation (zenzone.png)
- **Type**: Pop-out effect
- **Duration**: 800ms
- **Easing**: Elastic ease-out
- **Transform**: Scale from 0 to 1 with slight overshoot
- **Delay**: 300ms after component mount

#### Text Animation (text.png)
- **Type**: Slide-in from left
- **Duration**: 600ms
- **Easing**: Ease-out
- **Transform**: TranslateX from -200 to 0
- **Delay**: 1000ms (after logo animation)

#### Pentagon Shimmer (pent.png)
- **Type**: Continuous shimmer effect
- **Duration**: 2000ms loop
- **Effect**: Opacity oscillation between 0.6 and 1.0
- **Additional**: Subtle glow effect using shadow

#### Group Float (Group.png)
- **Type**: Vertical floating with shimmer
- **Duration**: 3000ms loop
- **Transform**: TranslateY oscillation ±10px
- **Effect**: Combined with opacity shimmer (0.7 to 1.0)

#### Bubble Float (bubble.png)
- **Type**: Random gentle movement
- **Duration**: 4000ms loop with random delays
- **Transform**: Circular motion with varying radius
- **Effect**: Continuous floating with different speeds per bubble

### Layout Design

#### Background
- **Gradient**: Multi-color gradient (pink, yellow, green, blue tones)
- **Direction**: Diagonal from top-left to bottom-right
- **Colors**: `['#FFB6C1', '#FFFFE0', '#98FB98', '#87CEEB', '#DDA0DD']`

#### Element Positioning
- **Logo**: Center of screen, vertically positioned at 40% from top
- **Text**: Below logo, centered horizontally
- **Tagline**: Below text, smaller font, centered
- **Button**: Bottom third of screen, centered
- **Pentagon**: Top-right area, positioned absolutely
- **Group**: Top-left area, positioned absolutely  
- **Bubbles**: Scattered across screen, various sizes

## Data Models

### Asset References
```typescript
interface AssetPaths {
  logo: require('./assets/zenzone.png');
  text: require('./assets/text.png');
  pentagon: require('./assets/pent.png');
  group: require('./assets/Group.png');
  bubble: require('./assets/bubble.png');
}
```

### Animation Configuration
```typescript
interface AnimationConfig {
  logo: {
    scale: { from: 0, to: 1, duration: 800, delay: 300 };
    easing: 'easeOutElastic';
  };
  text: {
    translateX: { from: -200, to: 0, duration: 600, delay: 1000 };
    easing: 'easeOut';
  };
  pentagon: {
    shimmer: { duration: 2000, loop: true };
    opacity: { from: 0.6, to: 1.0 };
  };
  // ... other animations
}
```

## Error Handling

### Asset Loading
- Implement fallback for missing assets
- Show loading indicator while assets load
- Graceful degradation if animations fail

### Platform Differences
- Detect platform capabilities
- Adjust animation complexity based on performance
- Fallback to simpler animations on lower-end devices

### Navigation Errors
- Handle navigation failures gracefully
- Provide retry mechanism if navigation fails
- Log errors for debugging

## Testing Strategy

### Unit Tests
- Test component rendering with different props
- Test animation trigger functions
- Test asset loading and error states
- Mock React Native Reanimated for testing

### Integration Tests
- Test complete animation sequence
- Test button interaction and navigation
- Test platform-specific behavior (Android vs Web)

### Visual Tests
- Screenshot testing for layout consistency
- Animation timing verification
- Cross-platform visual comparison

### Performance Tests
- Animation frame rate monitoring
- Memory usage during animations
- Asset loading time measurement

## Platform Considerations

### Android Simulator
- Optimize animations for Android performance
- Test with different Android API levels
- Handle hardware acceleration differences

### Web Browser
- Ensure animations work with React Native Web
- Handle mouse vs touch interactions
- Optimize for different browser engines

### Expo Compatibility
- Use Expo-compatible animation libraries
- Ensure assets are properly bundled
- Test with Expo Go development workflow
