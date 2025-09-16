/**
 * Mental Health AI Service - Main Export File
 * Provides easy access to all AI service components and mobile UI
 * Optimized for mobile mental health companion app
 */

// Main AI service interface
export { mentalHealthAI, aiConfig } from './services/MentalHealthAI.js';

// Setup utilities
export { AISetupWizard, setupAI, testAI, getInstructions } from './utils/AISetup.js';

// Core service classes (for advanced usage)
export { AIService } from './services/AIService.js';
export { AIServiceFactory } from './services/AIServiceFactory.js';

// Configuration management
export { AIConfigManager, DEFAULT_CONFIG } from './config/AIConfig.js';

// Prompt templates (for customization)
export { 
  MentalHealthPromptBuilder,
  MENTAL_HEALTH_SYSTEM_PROMPT,
  MOOD_PROMPTS,
  RESPONSE_TEMPLATES,
  getRandomTemplate
} from './prompts/MentalHealthPrompts.js';

// Mobile UI Components - Main App
export { default as MobileApp } from './components/MobileApp.jsx';

// Mobile UI Components - Individual Components
export {
  MobileNavigationContainer,
  MobileBottomNavigation,
  MobileHeader,
  MobileChatContainer,
  MobileChatWindow,
  MobileChatBubble,
  MobileChatInput,
  TypingIndicator,
  MobileLoadingState,
  createMobileApp,
  createMobileChatInterface
} from './components/index.js';

// Enhanced Chat Integration
export { coachReply, getConversationInsights, addMoodLogWithContext } from './Chat-Bot.js';

// Progress and Memory Integration
export { 
  saveMessage, 
  getConversationHistory, 
  getUserProgress, 
  addLog,
  clearHistory,
  exportData
} from './Memory.js';

// Styles and utilities
export { default as MobileChatStyles } from './styles/MobileChatStyles.js';
export { MobileNavigationStyles } from './styles/MobileNavigationStyles.js';
export { IconUtils } from './utils/IconUtils.js';

// Performance utilities
export { 
  usePerformanceMonitor, 
  useScrollToBottom, 
  useDebouncedCallback 
} from './utils/PerformanceHooks.js';

// Safety and crisis management
export { mentalHealthSafetyService } from './services/MentalHealthSafetyService.js';
export { EmergencyResourcesDisplay } from './components/EmergencyResourcesDisplay.jsx';

/**
 * Quick start function for immediate use
 * @param {'huggingface'|'openai'} provider - AI provider
 * @param {string} apiKey - API key
 * @returns {Promise<boolean>} Whether setup was successful
 */
export async function quickStart(provider, apiKey) {
  const { setupAI } = await import('./utils/AISetup.js');
  return await setupAI(provider, apiKey);
}

/**
 * Get a simple response (main function to replace coachReply)
 * @param {string} userMessage - User's message
 * @param {Array} conversationHistory - Previous messages (optional)
 * @param {Object} userMood - Current mood data (optional)
 * @returns {Promise<string>} AI response
 */
export async function getAIResponse(userMessage, conversationHistory = [], userMood = null) {
  const { mentalHealthAI } = await import('./services/MentalHealthAI.js');
  return await mentalHealthAI.generateResponse(userMessage, conversationHistory, userMood);
}

/**
 * Check if AI service is ready to use
 * @returns {boolean} Whether AI is configured and ready
 */
export function isAIReady() {
  try {
    const { mentalHealthAI } = require('./services/MentalHealthAI.js');
    return mentalHealthAI.isReady();
  } catch (error) {
    console.warn('AI service not available:', error.message);
    return false;
  }
}

/**
 * Initialize the complete mobile mental health app
 * @param {Object} config - App configuration
 * @returns {React.Component} Mobile app component
 */
export function createMentalHealthApp(config = {}) {
  const { default: MobileApp } = require('./components/MobileApp.jsx');
  return MobileApp;
}

/**
 * Performance optimized bundle for production
 * Only loads essential components initially
 */
export const essentials = {
  MobileApp: () => import('./components/MobileApp.jsx'),
  getAIResponse,
  isAIReady,
  quickStart,
  coachReply: () => import('./Chat-Bot.js').then(m => m.coachReply),
  Memory: () => import('./Memory.js')
};

// Default export for convenience
export default {
  // AI Services
  getAIResponse,
  isAIReady,
  quickStart,
  
  // Mobile App
  MobileApp: () => import('./components/MobileApp.jsx'),
  createMentalHealthApp,
  
  // Core functionality
  coachReply: () => import('./Chat-Bot.js').then(m => m.coachReply),
  Memory: () => import('./Memory.js'),
  
  // Performance optimized essentials
  essentials
};