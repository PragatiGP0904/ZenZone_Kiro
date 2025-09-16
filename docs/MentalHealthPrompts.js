/**
 * Mental Health-specific prompt templates and response formatting
 * Provides context-aware prompts for supportive AI conversations
 */

/**
 * Base system prompt for mental health conversations
 */
export const MENTAL_HEALTH_SYSTEM_PROMPT = `You are a compassionate mental health companion and gentle coach. Your role is to provide emotional support, encouragement, and practical guidance while maintaining appropriate boundaries.

CORE PRINCIPLES:
- Be warm, empathetic, and non-judgmental
- Provide practical, actionable suggestions
- Encourage professional help when appropriate
- Never diagnose or provide medical advice
- Focus on immediate coping strategies and emotional support
- Use encouraging language and emojis appropriately

RESPONSE GUIDELINES:
- Keep responses concise (1-3 sentences)
- Ask follow-up questions to encourage sharing
- Validate feelings and experiences
- Suggest small, manageable actions
- Be encouraging but realistic
- Use "I" statements to show presence ("I hear you", "I'm with you")

CRISIS DETECTION:
If you detect signs of self-harm, suicide ideation, or crisis:
- Express immediate concern and care
- Encourage seeking professional help
- Provide crisis resources when appropriate
- Do not attempt to counsel through crisis situations

Remember: You are a supportive companion, not a therapist. Your goal is to provide comfort, encouragement, and gentle guidance while encouraging professional support when needed.`;

/**
 * Mood-based prompt variations
 */
export const MOOD_PROMPTS = {
  low: {
    context: "The user is experiencing low mood (1-4 on mood scale).",
    guidance: "Focus on validation, gentle encouragement, and immediate comfort. Suggest very small, achievable actions."
  },
  medium: {
    context: "The user has moderate mood (5-7 on mood scale).",
    guidance: "Provide balanced support with practical suggestions. Encourage building on current stability."
  },
  high: {
    context: "The user is in good spirits (8-10 on mood scale).",
    guidance: "Celebrate their positive state while helping them maintain momentum. Focus on gratitude and forward planning."
  }
};

/**
 * Conversation context templates
 */
export const CONVERSATION_CONTEXTS = {
  firstTime: "This is the user's first conversation. Be welcoming and explain your role as a supportive companion.",
  returning: "This is a returning user. Reference their previous progress and check in on their wellbeing.",
  afterBreak: "The user hasn't checked in for several days. Gently welcome them back without judgment.",
  streak: "The user has been consistently checking in. Acknowledge their commitment and progress."
};

/**
 * Response type templates
 */
export const RESPONSE_TEMPLATES = {
  validation: [
    "I hear you, and what you're feeling is completely valid.",
    "Thank you for sharing that with me. Your feelings matter.",
    "It makes complete sense that you'd feel this way given what you're going through."
  ],
  
  encouragement: [
    "You're taking positive steps by reaching out and sharing.",
    "I'm proud of you for checking in and being honest about how you're feeling.",
    "You're showing real strength by acknowledging what's happening."
  ],
  
  actionSuggestion: [
    "What would make the next hour 1% kinder for you?",
    "Is there one small thing you could do right now to care for yourself?",
    "What tiny step feels manageable in this moment?"
  ],
  
  checkIn: [
    "How are you feeling right now in this moment?",
    "What's been on your mind lately?",
    "Tell me more about what's happening for you today."
  ]
};

/**
 * Crisis response templates
 */
export const CRISIS_RESPONSES = {
  selfHarm: "I'm really concerned about what you're sharing. Please reach out to a mental health professional or crisis hotline immediately. You matter, and help is available. 💛",
  
  suicide: "I'm deeply worried about you right now. Please contact a crisis hotline or emergency services immediately. Your life has value, and there are people who want to help. 💛",
  
  emergency: "This sounds like an emergency situation. Please call emergency services (911) or go to your nearest emergency room. You don't have to face this alone. 💛"
};

/**
 * Generate context-aware prompt for AI service
 */
export class MentalHealthPromptBuilder {
  /**
   * Build a complete prompt for the AI service
   * @param {string} userMessage - User's current message
   * @param {Array} conversationHistory - Previous messages
   * @param {Object} userMood - Current mood data
   * @param {Object} context - Additional context including safety recommendations
   * @returns {string} Complete prompt for AI
   */
  static buildPrompt(userMessage, conversationHistory = [], userMood = null, context = {}) {
    // For Hugging Face models, use a more conversational format
    if (context.provider === 'huggingface') {
      return this.buildHuggingFacePrompt(userMessage, conversationHistory, userMood, context);
    }
    
    let prompt = MENTAL_HEALTH_SYSTEM_PROMPT + "\n\n";
    
    // Add safety recommendations if provided
    if (context.safetyRecommendations) {
      prompt += this.buildSafetyGuidance(context.safetyRecommendations) + "\n\n";
    }
    
    // Add mood context if available
    if (userMood) {
      const moodLevel = this.getMoodLevel(userMood.mood);
      prompt += `CURRENT MOOD CONTEXT: ${MOOD_PROMPTS[moodLevel].context}\n`;
      prompt += `GUIDANCE: ${MOOD_PROMPTS[moodLevel].guidance}\n\n`;
    }
    
    // Add conversation context
    if (context.conversationType) {
      prompt += `CONVERSATION CONTEXT: ${CONVERSATION_CONTEXTS[context.conversationType]}\n\n`;
    }
    
    // Add recent conversation history for context
    if (conversationHistory.length > 0) {
      prompt += "RECENT CONVERSATION:\n";
      const recentMessages = conversationHistory.slice(-6); // Last 6 messages for context
      
      recentMessages.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.text}\n`;
      });
      prompt += "\n";
    }
    
    // Add current user message
    prompt += `CURRENT USER MESSAGE: ${userMessage}\n\n`;
    
    // Add response instructions
    prompt += "Please respond as the mental health companion described above. ";
    prompt += "Keep your response supportive, concise, and focused on the user's immediate needs. ";
    prompt += "End with a gentle question or suggestion when appropriate.";
    
    return prompt;
  }

  /**
   * Build Hugging Face specific prompt format
   * @param {string} userMessage - User's current message
   * @param {Array} conversationHistory - Previous messages
   * @param {Object} userMood - Current mood data
   * @param {Object} context - Additional context
   * @returns {string} Hugging Face optimized prompt
   */
  static buildHuggingFacePrompt(userMessage, conversationHistory = [], userMood = null, context = {}) {
    let prompt = "";
    
    // For DialoGPT and similar models, use conversation format
    if (conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-4); // Keep it shorter for HF models
      
      recentMessages.forEach(msg => {
        if (msg.role === 'user') {
          prompt += `Human: ${msg.text}\n`;
        } else {
          prompt += `Assistant: ${msg.text}\n`;
        }
      });
    }
    
    // Add mood context in natural language
    let moodContext = "";
    if (userMood) {
      const moodLevel = this.getMoodLevel(userMood.mood);
      if (moodLevel === 'low') {
        moodContext = " (The person seems to be having a difficult time)";
      } else if (moodLevel === 'high') {
        moodContext = " (The person seems to be in good spirits)";
      }
    }
    
    // Add conversation type context
    let contextHint = "";
    if (context.conversationType === 'firstTime') {
      contextHint = " This is their first conversation, so be welcoming.";
    } else if (context.conversationType === 'streak') {
      contextHint = " They've been consistently checking in, acknowledge their commitment.";
    }
    
    // Add current user message with context
    prompt += `Human: ${userMessage}${moodContext}\n`;
    prompt += `Assistant: I'm a compassionate mental health companion.${contextHint} `;
    
    return prompt;
  }
  
  /**
   * Build safety guidance for AI response generation
   * @param {Object} safetyRecommendations - Safety recommendations from safety service
   * @returns {string} Safety guidance text
   */
  static buildSafetyGuidance(safetyRecommendations) {
    let guidance = "SAFETY GUIDANCE:\n";
    
    if (safetyRecommendations.adjustTemperature) {
      guidance += `- Use lower temperature (${safetyRecommendations.adjustTemperature}) for more careful responses\n`;
    }
    
    if (safetyRecommendations.includeDisclaimer) {
      guidance += "- Include reminder that you're an AI assistant, not a therapist\n";
    }
    
    if (safetyRecommendations.emphasizeSupport) {
      guidance += "- Emphasize emotional support and validation\n";
    }
    
    if (safetyRecommendations.avoidMedicalAdvice) {
      guidance += "- Avoid any medical advice or diagnostic language\n";
    }
    
    if (safetyRecommendations.requireEmpathy) {
      guidance += "- Use highly empathetic and supportive language\n";
    }
    
    if (safetyRecommendations.suggestProfessionalHelp) {
      guidance += "- Gently suggest professional mental health support\n";
    }
    
    return guidance;
  }

  /**
   * Determine mood level category
   * @param {number} mood - Mood rating (1-10)
   * @returns {'low'|'medium'|'high'} Mood level
   */
  static getMoodLevel(mood) {
    if (mood <= 4) return 'low';
    if (mood <= 7) return 'medium';
    return 'high';
  }
  
  /**
   * Build mood insight prompt
   * @param {Array} moodHistory - Historical mood data
   * @returns {string} Prompt for mood insights
   */
  static buildMoodInsightPrompt(moodHistory) {
    let prompt = "You are a mental health companion analyzing mood patterns to provide supportive insights.\n\n";
    
    prompt += "MOOD HISTORY:\n";
    moodHistory.slice(-14).forEach(entry => { // Last 14 entries
      const date = new Date(entry.date).toLocaleDateString();
      prompt += `${date}: Mood ${entry.mood}/10`;
      if (entry.note) {
        prompt += ` - ${entry.note}`;
      }
      prompt += "\n";
    });
    
    prompt += "\nPlease provide a brief, encouraging insight about their mood patterns. ";
    prompt += "Focus on positive trends, progress, or gentle observations. ";
    prompt += "Keep it supportive and under 100 words. ";
    prompt += "If you notice concerning patterns, gently suggest professional support.";
    
    return prompt;
  }
  
  /**
   * Detect crisis keywords in user message
   * @param {string} message - User message to analyze
   * @returns {Object} Crisis detection result
   */
  static detectCrisis(message) {
    const lowerMessage = message.toLowerCase();
    
    const crisisKeywords = {
      selfHarm: ['hurt myself', 'self harm', 'cut myself', 'harm myself'],
      suicide: ['kill myself', 'end my life', 'suicide', 'not worth living', 'want to die'],
      emergency: ['emergency', 'crisis', 'can\'t go on', 'end it all']
    };
    
    for (const [type, keywords] of Object.entries(crisisKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return {
            detected: true,
            type,
            response: CRISIS_RESPONSES[type]
          };
        }
      }
    }
    
    return { detected: false };
  }
  
  /**
   * Format AI response with mental health context
   * @param {string} rawResponse - Raw AI response
   * @param {Object} context - Response context
   * @returns {Object} Formatted response
   */
  static formatResponse(rawResponse, context = {}) {
    // Clean and validate response
    let text = rawResponse.trim();
    
    // Ensure response isn't too long
    if (text.length > 300) {
      text = text.substring(0, 297) + "...";
    }
    
    // Add emoji if response seems too clinical
    if (!text.includes('💛') && !text.includes('🌟') && !text.includes('🌱') && 
        !text.includes('💚') && !text.includes('✨') && context.addEmoji !== false) {
      
      // Add appropriate emoji based on content
      if (text.includes('proud') || text.includes('wonderful') || text.includes('great')) {
        text += " 🌟";
      } else if (text.includes('sorry') || text.includes('difficult')) {
        text += " 💛";
      } else if (text.includes('step') || text.includes('try') || text.includes('small')) {
        text += " 🌱";
      }
    }
    
    return {
      text,
      formatted: true,
      timestamp: new Date()
    };
  }
}

/**
 * Hugging Face model specific prompts
 */
export const HUGGINGFACE_PROMPTS = {
  dialogpt: {
    systemPrefix: "I'm a compassionate mental health companion. ",
    conversationStarters: [
      "I'm here to listen and support you. ",
      "Thank you for sharing with me. ",
      "I hear you and I'm with you. "
    ],
    responseEnders: [
      " How are you feeling about that?",
      " What would help you most right now?",
      " You're not alone in this."
    ]
  },
  
  blenderbot: {
    systemPrefix: "As your supportive companion, ",
    conversationStarters: [
      "I want you to know that your feelings are valid. ",
      "It takes courage to reach out, and I'm glad you did. ",
      "I'm here to provide a safe space for you. "
    ],
    responseEnders: [
      " What small step feels manageable right now?",
      " How can I best support you today?",
      " Remember, healing isn't linear."
    ]
  }
};

/**
 * Model-specific prompt optimization
 */
export const MODEL_OPTIMIZATIONS = {
  'microsoft/DialoGPT-medium': {
    maxContextLength: 200,
    useConversationFormat: true,
    addSystemPrefix: true,
    temperatureRange: [0.6, 0.8]
  },
  
  'microsoft/DialoGPT-large': {
    maxContextLength: 300,
    useConversationFormat: true,
    addSystemPrefix: true,
    temperatureRange: [0.7, 0.9]
  },
  
  'facebook/blenderbot-400M-distill': {
    maxContextLength: 150,
    useConversationFormat: false,
    addSystemPrefix: true,
    temperatureRange: [0.5, 0.7]
  }
};

/**
 * Helper function to get random template
 * @param {Array} templates - Array of template strings
 * @returns {string} Random template
 */
export function getRandomTemplate(templates) {
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Get model-specific optimization settings
 * @param {string} modelName - Name of the model
 * @returns {Object} Optimization settings
 */
export function getModelOptimization(modelName) {
  return MODEL_OPTIMIZATIONS[modelName] || MODEL_OPTIMIZATIONS['microsoft/DialoGPT-medium'];
}