// Jest setup file

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo modules
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  Svg: 'Svg',
  Path: 'Path',
  G: 'G',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock only the problematic modules
  const mockComponent = () => 'MockedComponent';
  
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 667 })),
    },
    Settings: mockComponent,
    SettingsManager: mockComponent,
    PushNotificationIOS: mockComponent,
    Clipboard: mockComponent,
    ProgressBarAndroid: mockComponent,
    DevSettings: mockComponent,
    NativeEventEmitter: jest.fn(() => ({
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    })),
    Animated: {
      ...RN.Animated,
      Value: jest.fn().mockImplementation((value) => ({
        setValue: jest.fn(),
        stopAnimation: jest.fn(),
        removeAllListeners: jest.fn(),
        interpolate: jest.fn(),
        _value: value,
      })),
      timing: jest.fn().mockImplementation(() => ({
        start: jest.fn((callback) => callback && callback({ finished: true })),
      })),
      parallel: jest.fn().mockImplementation(() => ({
        start: jest.fn((callback) => callback && callback({ finished: true })),
      })),
    },
  };
});

// Global test setup
global.__DEV__ = true;