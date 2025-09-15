import { Dimensions, Platform, PixelRatio } from 'react-native';

// Get screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design reference)
const BASE_WIDTH = 375; // iPhone X width as reference
const BASE_HEIGHT = 812; // iPhone X height as reference

// Scale factors
const widthScale = SCREEN_WIDTH / BASE_WIDTH;
const heightScale = SCREEN_HEIGHT / BASE_HEIGHT;

// Use the smaller scale to maintain aspect ratio
const scale = Math.min(widthScale, heightScale);

/**
 * Responsive width based on screen width
 */
export const wp = (percentage: number): number => {
  return (percentage * SCREEN_WIDTH) / 100;
};

/**
 * Responsive height based on screen height
 */
export const hp = (percentage: number): number => {
  return (percentage * SCREEN_HEIGHT) / 100;
};

/**
 * Responsive font size
 */
export const rf = (size: number): number => {
  const newSize = size * scale;
  
  // Ensure minimum readable size
  if (Platform.OS === 'ios') {
    return Math.max(newSize, 12);
  }
  
  // Android specific adjustments
  return Math.max(newSize / PixelRatio.get(), 12);
};

/**
 * Responsive size for elements (maintains aspect ratio)
 */
export const rs = (size: number): number => {
  return size * scale;
};

/**
 * Get responsive dimensions for images and elements
 */
export const getResponsiveDimensions = (baseWidth: number, baseHeight: number) => {
  return {
    width: rs(baseWidth),
    height: rs(baseHeight),
  };
};

/**
 * Platform-specific responsive adjustments
 */
export const platformAdjustments = {
  // Web specific adjustments
  web: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  // Android specific adjustments
  android: {
    elevation: 8,
    shadowColor: 'transparent', // Use elevation instead of shadow on Android
  },
  // Default (iOS) adjustments
  default: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
};

/**
 * Get platform-specific shadow/elevation styles
 */
export const getPlatformShadow = (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
  const intensityMap = {
    light: { elevation: 4, shadowOpacity: 0.2, shadowRadius: 4 },
    medium: { elevation: 8, shadowOpacity: 0.3, shadowRadius: 8 },
    heavy: { elevation: 12, shadowOpacity: 0.4, shadowRadius: 12 },
  };

  const config = intensityMap[intensity];

  if (Platform.OS === 'web') {
    return {
      shadowOffset: { width: 0, height: config.shadowRadius / 2 },
      shadowOpacity: config.shadowOpacity,
      shadowRadius: config.shadowRadius,
      shadowColor: '#000',
    };
  }

  if (Platform.OS === 'android') {
    return {
      elevation: config.elevation,
      shadowColor: 'transparent',
    };
  }

  // iOS
  return {
    shadowOffset: { width: 0, height: config.shadowRadius / 2 },
    shadowOpacity: config.shadowOpacity,
    shadowRadius: config.shadowRadius,
    shadowColor: '#000',
  };
};

/**
 * Screen size categories for responsive behavior
 */
export const getScreenCategory = () => {
  if (SCREEN_WIDTH < 350) return 'small';
  if (SCREEN_WIDTH < 414) return 'medium';
  if (SCREEN_WIDTH < 768) return 'large';
  return 'xlarge';
};

/**
 * Responsive spacing based on screen size
 */
export const getResponsiveSpacing = () => {
  const category = getScreenCategory();
  
  switch (category) {
    case 'small':
      return {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
      };
    case 'medium':
      return {
        xs: 6,
        sm: 12,
        md: 18,
        lg: 24,
        xl: 30,
        xxl: 36,
      };
    case 'large':
      return {
        xs: 8,
        sm: 16,
        md: 24,
        lg: 32,
        xl: 40,
        xxl: 48,
      };
    default: // xlarge
      return {
        xs: 10,
        sm: 20,
        md: 30,
        lg: 40,
        xl: 50,
        xxl: 60,
      };
  }
};

// Export screen dimensions for direct use
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale,
  widthScale,
  heightScale,
};