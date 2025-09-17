[design.md](https://github.com/user-attachments/files/22380314/design.md)
# Design Document

## Overview

The Zenbloom page will be implemented as a React Native component using Expo for cross-platform mobile development. The design focuses on creating an immersive, animated mood visualization experience with smooth transitions between three distinct mood states (Happy, Sad, Angry). The component will utilize ONLY the existing image assets from the Zenbloom/Images folder and implement custom animations using React Native's Animated API and CSS-like transforms.

### Key Animation Requirements
- **Common Elements**: Sunflower sway animation, blinking every few seconds, glass-style UI buttons with frosted effects
- **Happy State**: Active butterflies, flower bounce on tap, golden growth bar sparkles, bright sky with moving clouds
- **Sad State**: Falling raindrops, occasional petal drops, dim blue growth bar shimmer, droopy flower
- **Angry State**: Fire/heat effects at bottom, cloud lightning flashes, red pulsing growth bar, sharp angry flower
- **Growth Bar**: Sparkle particles, smooth gradient filling, milestone bloom pulses, mood-specific colors

## Architecture

### Component Structure
```
ZenbloomPage/
├── components/
│   ├── ZenbloomContainer.tsx      # Main container component
│   ├── SunflowerDisplay.tsx       # Animated sunflower component
│   ├── BackgroundLayer.tsx        # Background and environmental effects
│   ├── AnimatedElements.tsx       # Clouds, butterflies, rain, fire effects
│   ├── InteractionButtons.tsx     # Mood and Growth buttons
│   ├── MoodCard.tsx              # Mood information card overlay
│   ├── GrowthCard.tsx            # Growth progress card overlay
│   └── MoodSelector.tsx          # Bottom mood change button and modal
├── hooks/
│   ├── useMoodState.ts           # Mood state management
│   ├── useAnimations.ts          # Animation controllers
│   └── useAssetLoader.ts         # Image asset preloading
├── types/
│   └── mood.types.ts             # TypeScript interfaces
├── assets/
│   └── images/                   # Image assets (existing folder)
└── styles/
    └── zenbloom.styles.ts        # StyleSheet definitions
```

### State Management
- **Mood State**: Current mood (Happy, Sad, Angry) managed via React Context or local state
- **Animation State**: Controls for various animations (sway, clouds, butterflies, effects)
- **UI State**: Card visibility, button states, loading states
- **Progress State**: Growth streak data and progress tracking

## Components and Interfaces

### Core Interfaces

```typescript
// mood.types.ts
export type MoodType = 'happy' | 'sad' | 'angry';

export interface MoodAssets {
  sunflower: any;
  background: any;
  petals: any;
  faceExpression: any;
  logo: any;
  moodButton: any;
  moodButtonClicked: any;
  growthButton: any;
  growthButtonClicked: any;
  backIcon: any;
  growthFlower: any;
}

export interface MoodConfig {
  type: MoodType;
  label: string;
  emoji: string;
  description: string;
  assets: MoodAssets;
}

export interface AnimationRefs {
  sunflowerSway: Animated.Value;
  cloudMovement: Animated.Value[];
  butterflyFlap: Animated.Value[];
  rainDrop?: Animated.Value[];
  fireParticles?: Animated.Value[];
}
```

### Main Container Component

```typescript
// ZenbloomContainer.tsx
interface ZenbloomContainerProps {
  initialMood?: MoodType;
  onMoodChange?: (mood: MoodType) => void;
  streakData?: StreakData;
}

export const ZenbloomContainer: React.FC<ZenbloomContainerProps> = ({
  initialMood = 'happy',
  onMoodChange,
  streakData
}) => {
  // Component implementation
};
```

### Sunflower Display Component

```typescript
// SunflowerDisplay.tsx
interface SunflowerDisplayProps {
  currentMood: MoodType;
  moodAssets: MoodAssets;
  swayAnimation: Animated.Value;
}

export const SunflowerDisplay: React.FC<SunflowerDisplayProps> = ({
  currentMood,
  moodAssets,
  swayAnimation
}) => {
  // Layered sunflower rendering with animations
};
```

### Background Layer Component

```typescript
// BackgroundLayer.tsx
interface BackgroundLayerProps {
  currentMood: MoodType;
  backgroundAsset: any;
  showRain?: boolean;
  showFire?: boolean;
}

export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  currentMood,
  backgroundAsset,
  showRain,
  showFire
}) => {
  // Background rendering with mood-specific effects
};
```

## Data Models

### Mood Configuration

```typescript
const MOOD_CONFIGS: Record<MoodType, MoodConfig> = {
  happy: {
    type: 'happy',
    label: 'Happy',
    emoji: '🌼',
    description: 'Your flower is blooming with joy today.',
    growthBarColor: '#FFD700', // Golden
    assets: {
      sunflower: require('../../Zenbloom/Images/Sunflower_Happy.png'),
      background: require('../../Zenbloom/Images/Background_Happy.png'),
      petals: require('../../Zenbloom/Images/Petal_happy.png'),
      faceExpression: require('../../Zenbloom/Images/Happy_State.png'),
      logo: require('../../Zenbloom/Images/Zenbloom_logo_Happy.png'),
      moodButton: require('../../Zenbloom/Images/Mood_state_Happy.png'),
      moodButtonClicked: require('../../Zenbloom/Images/Mood_State_clicked_happy.png'),
      growthButton: require('../../Zenbloom/Images/Growth_leaf_Happy.png'),
      growthButtonClicked: require('../../Zenbloom/Images/Growth_leaf_clicked_Happy.png'),
      backIcon: require('../../Zenbloom/Images/Back_icon_happy.png'),
      growthFlower: require('../../Zenbloom/Images/Flower_Growthsate_Happy.png')
    }
  },
  sad: {
    type: 'sad',
    label: 'Sad',
    emoji: '🌧️',
    description: 'Your flower is wilting, make it happy.',
    growthBarColor: '#4A90E2', // Blue
    assets: {
      sunflower: require('../../Zenbloom/Images/Sunflower_Sad.png'),
      background: require('../../Zenbloom/Images/Background_Sad.png'),
      petals: require('../../Zenbloom/Images/Petal_sad.png'),
      faceExpression: require('../../Zenbloom/Images/Sad_State.png'),
      logo: require('../../Zenbloom/Images/Zenbloom_logo_Sad.png'),
      moodButton: require('../../Zenbloom/Images/Mood_state_angry,sad.png'),
      moodButtonClicked: require('../../Zenbloom/Images/Mood_State_clicked_sad,angry.png'),
      growthButton: require('../../Zenbloom/Images/Growth_leaf_sad,angry.png'),
      growthButtonClicked: require('../../Zenbloom/Images/Growth_leaf_clicked_sad,angry.png'),
      backIcon: require('../../Zenbloom/Images/Back_icon_sad,angry.png'),
      growthFlower: require('../../Zenbloom/Images/Flower_Growthsate_Sad.png'),
      rainLayer: require('../../Zenbloom/Images/Rainlayer_sad.png')
    }
  },
  angry: {
    type: 'angry',
    label: 'Angry',
    emoji: '🔥',
    description: 'Your flower is fuming, calm it down.',
    growthBarColor: '#FF4500', // Red-Orange
    assets: {
      sunflower: require('../../Zenbloom/Images/Sunflower_Angry.png'),
      background: require('../../Zenbloom/Images/Background_Angry.png'),
      petals: require('../../Zenbloom/Images/Petal_angry.png'),
      faceExpression: require('../../Zenbloom/Images/Angry_State.png'),
      logo: require('../../Zenbloom/Images/Zenbloom_logo_Angry.png'),
      moodButton: require('../../Zenbloom/Images/Mood_state_angry,sad.png'),
      moodButtonClicked: require('../../Zenbloom/Images/Mood_State_clicked_sad,angry.png'),
      growthButton: require('../../Zenbloom/Images/Growth_leaf_sad,angry.png'),
      growthButtonClicked: require('../../Zenbloom/Images/Growth_leaf_clicked_sad,angry.png'),
      backIcon: require('../../Zenbloom/Images/Back_icon_sad,angry.png'),
      growthFlower: require('../../Zenbloom/Images/Flower_Growthsate_Angry.png')
    }
  }
};

// Shared animation assets
const SHARED_ASSETS = {
  clouds: [
    require('../../Zenbloom/Images/Cloud1.png'),
    require('../../Zenbloom/Images/Cloud2.png'),
    require('../../Zenbloom/Images/Cloud3.png'),
    require('../../Zenbloom/Images/Cloud4.png'),
    require('../../Zenbloom/Images/Cloud5.png'),
    require('../../Zenbloom/Images/Cloud6.png')
  ],
  butterflies: [
    require('../../Zenbloom/Images/Butterfly1.png'),
    require('../../Zenbloom/Images/Butterfly2.png'),
    require('../../Zenbloom/Images/Butterfly3.png'),
    require('../../Zenbloom/Images/Butterfly4.png'),
    require('../../Zenbloom/Images/Butterfly5.png'),
    require('../../Zenbloom/Images/Butterfly7.png'),
    require('../../Zenbloom/Images/Butterfly8.png')
  ],
  profile: require('../../Zenbloom/Images/Profile.png')
};
```

### Animation Configuration

```typescript
const ANIMATION_CONFIG = {
  // Common sunflower animations
  sunflowerSway: {
    duration: 3000,
    useNativeDriver: true,
    toValue: 1,
    easing: Easing.inOut(Easing.sin)
  },
  sunflowerBlink: {
    duration: 150,
    useNativeDriver: true,
    interval: 3000 // Blink every 3 seconds
  },
  
  // Happy mood specific
  flowerBounce: {
    duration: 300,
    useNativeDriver: true,
    toValue: 1.1,
    easing: Easing.bounce
  },
  butterflyActive: {
    duration: 1200,
    useNativeDriver: true,
    toValue: 1
  },
  goldenSparkles: {
    duration: 2000,
    useNativeDriver: true,
    toValue: 1
  },
  
  // Sad mood specific
  rainDrop: {
    duration: 1500,
    useNativeDriver: true,
    toValue: 1,
    stagger: 200
  },
  petalFall: {
    duration: 3000,
    useNativeDriver: true,
    toValue: 1,
    interval: 8000 // Occasional petal falls
  },
  blueShimmer: {
    duration: 2500,
    useNativeDriver: true,
    toValue: 1,
    opacity: 0.6
  },
  
  // Angry mood specific
  fireEffect: {
    duration: 1000,
    useNativeDriver: true,
    toValue: 1
  },
  lightningFlash: {
    duration: 100,
    useNativeDriver: true,
    interval: 4000 // Flash every 4 seconds
  },
  redPulse: {
    duration: 1500,
    useNativeDriver: true,
    toValue: 1.05
  },
  
  // Shared animations
  cloudMovement: {
    duration: 25000,
    useNativeDriver: true,
    toValue: 1
  },
  butterflyFlap: {
    duration: 800,
    useNativeDriver: true,
    toValue: 1
  },
  
  // Growth bar animations
  progressFill: {
    duration: 1000,
    useNativeDriver: false,
    toValue: 1
  },
  milestoneBloom: {
    duration: 600,
    useNativeDriver: true,
    toValue: 1.2,
    easing: Easing.elastic(2)
  },
  sparkleRise: {
    duration: 1500,
    useNativeDriver: true,
    toValue: 1
  },
  
  // UI transitions
  moodTransition: {
    duration: 800,
    useNativeDriver: false,
    toValue: 1,
    easing: Easing.inOut(Easing.ease)
  },
  cardSlide: {
    duration: 400,
    useNativeDriver: true,
    toValue: 1
  },
  buttonPress: {
    duration: 150,
    useNativeDriver: true,
    toValue: 0.95
  }
};
```

## Error Handling

### Asset Loading
- Implement fallback images for missing assets
- Show loading states during asset preloading
- Handle network errors gracefully for remote assets

### Animation Errors
- Catch animation failures and provide fallback static states
- Implement animation cleanup on component unmount
- Handle memory management for complex animations

### State Management Errors
- Validate mood state changes
- Provide default states for corrupted data
- Handle async state updates safely

```typescript
// Error boundary for animation failures
class AnimationErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log animation errors and fallback to static display
  }
}
```

## Testing Strategy

### Unit Tests
- **Component Rendering**: Test each component renders correctly with different props
- **Mood State Changes**: Verify mood transitions update assets and animations correctly
- **Animation Logic**: Test animation start/stop/reset functionality
- **Asset Loading**: Test asset preloading and fallback mechanisms

### Integration Tests
- **Full Mood Flow**: Test complete mood change workflow from button tap to visual update
- **Card Interactions**: Test mood and growth card opening/closing
- **Animation Coordination**: Test multiple animations running simultaneously
- **Performance**: Test smooth animations on different device specifications

### Visual Regression Tests
- **Mood States**: Screenshot tests for each mood state appearance
- **Animation Frames**: Key frame testing for critical animation points
- **Responsive Layout**: Test layout on different screen sizes
- **Asset Rendering**: Verify correct asset loading and display

### Performance Tests
- **Memory Usage**: Monitor memory consumption during animations
- **Frame Rate**: Ensure 60fps during complex animation sequences
- **Asset Loading Time**: Test initial load performance
- **Transition Smoothness**: Measure mood transition performance

## Implementation Approach

### Phase 1: Core Structure
1. Set up basic component structure and navigation
2. Implement static mood states without animations
3. Create asset loading system
4. Implement basic mood switching

### Phase 2: Animations
1. Add sunflower sway animation
2. Implement cloud movement
3. Add butterfly animations
4. Create mood transition animations

### Phase 3: Interactive Elements
1. Implement mood and growth buttons
2. Add card overlays with animations
3. Create mood selector modal
4. Add button interaction feedback

### Phase 4: Environmental Effects
1. Add rain animation for sad mood
2. Implement fire/spark effects for angry mood
3. Fine-tune all animations for smoothness
4. Optimize performance

### Phase 5: Polish and Testing
1. Add loading states and error handling
2. Implement accessibility features
3. Performance optimization
4. Comprehensive testing

## Mood-Specific Animation Details

### Happy State Animations
- **Sunflower**: Standing tall, gentle sway + bounce on tap interaction
- **Butterflies**: More active movement using Butterfly1-8.png assets with wing flapping
- **Clouds**: Slow parallax movement across bright sky using Cloud1-6.png
- **Growth Bar**: Golden sparkles (#FFD700) with shimmer effect
- **Background**: Bright Background_Happy.png with moving cloud layers

### Sad State Animations  
- **Sunflower**: Droopy appearance with slower sway animation
- **Rain**: Falling raindrops using Rainlayer_sad.png with staggered animation
- **Petals**: Occasional petal falls (gentle downward animation)
- **Growth Bar**: Dim blue shimmer (#4A90E2) with reduced opacity
- **Background**: Grey-blue Background_Sad.png with rain overlay

### Angry State Animations
- **Sunflower**: Sharp, angry appearance with more aggressive sway
- **Fire Effects**: Heat wave animation at bottom of screen (programmatic)
- **Lightning**: Cloud flashes using opacity changes on cloud assets
- **Growth Bar**: Red pulsing glow (#FF4500) with pulse animation
- **Background**: Dark Background_Angry.png with stormy atmosphere

### Growth Bar Special Effects (All Moods)
- **Progress Fill**: Smooth gradient animation matching mood color
- **Sparkle Particles**: Rising particles when progress increases
- **Milestone Blooms**: Pulse effect at 25%, 50%, 75%, 100% milestones
- **Shimmer Effect**: Light passing through effect across the bar

## Technical Considerations

### Asset Management
- **Strict Asset Usage**: Only use provided assets from Zenbloom/Images folder
- **No External Assets**: All visual elements must use existing PNG files
- **Asset Preloading**: Load all mood-specific assets on app start
- **Memory Optimization**: Efficient caching of frequently used assets

### Animation Performance
- Use `useNativeDriver: true` for all transform and opacity animations
- Implement efficient particle systems for sparkles and fire effects
- Optimize complex animations for 60fps on mid-range devices
- Use InteractionManager for smooth transitions

### UI Consistency
- **Glass Effect Buttons**: Frosted glass appearance with soft shadows
- **Exact Screenshot Matching**: UI must match provided screenshots exactly
- **Responsive Layout**: Maintain proportions across different screen sizes
- **Touch Feedback**: Proper button press animations and haptic feedback

### Cross-Platform Compatibility
- Test all animations on both iOS and Android
- Handle platform-specific performance differences
- Ensure consistent asset rendering across platforms
- Optimize for various device specifications and screen densities

### Memory Management
- Properly cleanup all animations on component unmount
- Implement efficient particle system cleanup
- Monitor memory usage during extended animation sequences
- Handle background/foreground app state changes gracefully
