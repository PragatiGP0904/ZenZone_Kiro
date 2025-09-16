// src/coach.js - Enhanced with AI Integration and Progress Tracking
import { mentalHealthAI } from './services/MentalHealthAI.js';
import { progressTrackingService } from './services/ProgressTrackingService.js';
import { getConversationHistory, getUserProgress } from './Memory.js';

/**
 * Enhanced coach reply function with AI integration and progress tracking
 * @param {string} userText - User's message
 * @param {number} [userMood] - Optional current mood rating (1-10)
 * @returns {Promise<string>} AI-enhanced response
 */
export async function coachReply(userText, userMood = null) {
  try {
    // Get conversation context for AI
    const conversationHistory = getConversationHistory(10); // Last 10 messages
    const userProgress = getUserProgress();
    
    // Generate AI response
    const aiResponse = await mentalHealthAI.generateResponse(
      userText, 
      conversationHistory, 
      userMood ? { mood: userMood, date: new Date().toISOString() } : null
    );

    // Create AI response object with metadata for progress tracking
    const enhancedAIResponse = {
      text: aiResponse,
      success: true,
      supportLevel: assessSupportLevel(aiResponse),
      moodImpact: assessMoodImpact(aiResponse),
      suggestedActions: extractSuggestedActions(aiResponse),
      metadata: {
        model: mentalHealthAI.getProviderName(),
        processingTime: Date.now()
      }
    };

    // Process response with progress tracking
    const progressUpdate = progressTrackingService.processAIResponse(
      enhancedAIResponse,
      userText,
      userMood
    );

    // Log progress update for debugging
    console.log('Progress updated:', {
      conversationQuality: progressUpdate.conversationQuality,
      totalConversations: progressUpdate.progress?.conversationCount
    });

    return aiResponse;

  } catch (error) {
    console.error('Error in enhanced coach reply:', error);
    
    // Fallback to rule-based response
    const fallbackResponse = getRuleBasedResponse(userText);
    
    // Still track the interaction even with fallback
    try {
      const fallbackAIResponse = {
        text: fallbackResponse,
        success: false,
        supportLevel: 'medium',
        moodImpact: 'neutral',
        suggestedActions: [],
        metadata: {
          model: 'fallback',
          processingTime: 0,
          error: error.message
        }
      };

      progressTrackingService.processAIResponse(
        fallbackAIResponse,
        userText,
        userMood
      );
    } catch (trackingError) {
      console.error('Error tracking fallback response:', trackingError);
    }

    return fallbackResponse;
  }
}

/**
 * Original rule-based response system (fallback)
 * @param {string} userText - User's message
 * @returns {string} Rule-based response
 */
export function getRuleBasedResponse(userText) {
  const t = (userText || "").toLowerCase();

  const sad = ["sad","down","tired","anxious","stress","overwhelm","cry"];
  const win = ["proud","happy","did it","completed","finished","win","improve"];
  const stuck = ["stuck","procrast","can't","cannot","blocked","lazy","delay"];

  const hit = (bag) => bag.some(w => t.includes(w));

  if (hit(win)) {
    return "That's wonderful! 🎉 Take a second to breathe it in. What tiny action helped you most? Let's repeat that tomorrow.";
  }
  if (hit(stuck)) {
    return "It's okay to feel stuck. Try the 5-minute rule: set a timer and do the tiniest next step. When it rings, you can stop—or keep going if it feels good. I'm with you. 🌱";
  }
  if (hit(sad)) {
    return "I'm really sorry you're feeling this way. You're not alone right now. Let's name one feeling, and one supportive action you can take in the next 10 minutes—water, stretch, or a short walk? 💛";
  }
  if (t.length < 10) {
    return "Tell me a bit more—what's on your mind right now? I'm listening.";
  }
  return "Thanks for sharing that with me. I hear you. What would make the next hour 1% kinder for you—rest, a small task, or reaching out to someone? 💛";
}

/**
 * Assess the level of support needed based on response content
 * @param {string} text - Response text
 * @returns {'low'|'medium'|'high'|'crisis'} Support level
 */
function assessSupportLevel(text) {
  const lowerText = text.toLowerCase();
  
  // Crisis indicators
  if (lowerText.includes('crisis') || lowerText.includes('emergency') || 
      lowerText.includes('professional help')) {
    return 'crisis';
  }
  
  // High support indicators
  if (lowerText.includes('really sorry') || lowerText.includes('deeply concerned') ||
      lowerText.includes('reach out')) {
    return 'high';
  }
  
  // Medium support indicators
  if (lowerText.includes('understand') || lowerText.includes('support') ||
      lowerText.includes('here for you')) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Assess potential mood impact of the response
 * @param {string} text - Response text
 * @returns {'positive'|'neutral'|'negative'} Mood impact
 */
function assessMoodImpact(text) {
  const lowerText = text.toLowerCase();
  
  const positiveWords = ['wonderful', 'proud', 'great', 'amazing', 'celebrate', 'success'];
  const negativeWords = ['sorry', 'difficult', 'hard', 'struggle', 'pain'];
  
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

/**
 * Extract suggested actions from response text
 * @param {string} text - Response text
 * @returns {string[]} Array of suggested actions
 */
function extractSuggestedActions(text) {
  const actions = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('breathe') || lowerText.includes('breathing')) {
    actions.push('Take deep breaths');
  }
  if (lowerText.includes('walk') || lowerText.includes('exercise')) {
    actions.push('Go for a short walk');
  }
  if (lowerText.includes('water') || lowerText.includes('hydrate')) {
    actions.push('Drink some water');
  }
  if (lowerText.includes('rest') || lowerText.includes('sleep')) {
    actions.push('Get some rest');
  }
  if (lowerText.includes('reach out') || lowerText.includes('talk to')) {
    actions.push('Connect with someone you trust');
  }
  
  return actions;
}

/**
 * Get enhanced conversation insights for progress tracking
 * @returns {Object} Conversation insights
 */
export function getConversationInsights() {
  try {
    return progressTrackingService.getEnhancedProgress();
  } catch (error) {
    console.error('Error getting conversation insights:', error);
    return null;
  }
}

/**
 * Add mood log with AI conversation context
 * @param {Object} moodData - Mood data to log
 * @returns {Object} Updated logs
 */
export function addMoodLogWithContext(moodData) {
  try {
    return progressTrackingService.addMoodLogWithAIContext(moodData);
  } catch (error) {
    console.error('Error adding mood log with context:', error);
    // Fallback to basic mood logging
    const { addLog } = require('./Memory.js');
    return addLog(moodData);
  }
}