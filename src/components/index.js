/**
 * Mobile Chat Components - Main Export File
 * Provides easy access to all mobile chat interface components and navigation
 */

// Import chat components
import MobileChatContainer from './MobileChatContainer.jsx';
import MobileChatWindow from './MobileChatWindow.jsx';
import MobileChatBubble from './MobileChatBubble.jsx';
import MobileChatInput from './MobileChatInput.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import MobileLoadingState from './MobileLoadingState.jsx';
import { ImagePlaceholder, AnimatedImagePlaceholder, AIMessageImageContainer } from './ImagePlaceholder.jsx';

// Import performance-optimized components
import VirtualizedChatContainer from './VirtualizedChatContainer.jsx';

// Import safety components
import EmergencyResourcesDisplay from './EmergencyResourcesDisplay.jsx';

// Import habit tracking components
import HabitCorrelationChart from './HabitCorrelationChart.jsx';
import HabitGraphPlaceholder, { SmartHabitGraph } from './HabitGraphPlaceholder.jsx';

// Import navigation components
import MobileBottomNavigation from './MobileBottomNavigation.jsx';
import MobileNavigationContainer from './MobileNavigationContainer.jsx';
import MobileHeader from './MobileHeader.jsx';

// Import styles
import MobileChatStyles from '../styles/MobileChatStyles.js';
import MobileNavigationStyles from '../styles/MobileNavigationStyles.js';

// Import utilities
import IconUtils from '../utils/IconUtils.js';

// Import performance utilities
import PerformanceUtils from '../utils/PerformanceUtils.js';
import PerformanceHooks from '../utils/PerformanceHooks.js';

// Main chat components
export { MobileChatContainer };
export { MobileChatWindow };
export { MobileChatBubble };
export { MobileChatInput };

// Performance-optimized components
export { VirtualizedChatContainer };

// Loading and state components
export { TypingIndicator };
export { MobileLoadingState };

// Image components
export { ImagePlaceholder };
export { AnimatedImagePlaceholder };
export { AIMessageImageContainer };

// Safety components
export { EmergencyResourcesDisplay };

// Habit tracking components
export { HabitCorrelationChart };
export { HabitGraphPlaceholder };
export { SmartHabitGraph };

// Navigation components
export { MobileBottomNavigation };
export { MobileNavigationContainer };
export { MobileHeader };

// Styles
export { MobileChatStyles };
export { MobileNavigationStyles };

// Utilities
export { IconUtils };

// Performance utilities
export { PerformanceUtils };
export { PerformanceHooks };

/**
 * Quick start function to get a complete mobile chat interface
 * @param {Object} props - Chat window props
 * @returns {JSX.Element} Complete mobile chat interface
 */
export function createMobileChatInterface(props = {}) {
  return MobileChatWindow(props);
}

/**
 * Quick start function to get a complete mobile app with navigation
 * @param {Object} props - App container props
 * @returns {JSX.Element} Complete mobile app with navigation
 */
export function createMobileApp(props = {}) {
  return MobileNavigationContainer(props);
}

// Default export for convenience
export default {
  // Chat components
  MobileChatContainer,
  MobileChatWindow,
  MobileChatBubble,
  MobileChatInput,
  TypingIndicator,
  MobileLoadingState,
  
  // Performance-optimized components
  VirtualizedChatContainer,
  
  // Image components
  ImagePlaceholder,
  AnimatedImagePlaceholder,
  AIMessageImageContainer,
  
  // Safety components
  EmergencyResourcesDisplay,
  
  // Habit tracking components
  HabitCorrelationChart,
  HabitGraphPlaceholder,
  SmartHabitGraph,
  
  // Navigation components
  MobileBottomNavigation,
  MobileNavigationContainer,
  MobileHeader,
  
  // Styles
  MobileChatStyles,
  MobileNavigationStyles,
  
  // Utilities
  IconUtils,
  
  // Performance utilities
  PerformanceUtils,
  PerformanceHooks,
  
  // Quick start functions
  createMobileChatInterface,
  createMobileApp
};