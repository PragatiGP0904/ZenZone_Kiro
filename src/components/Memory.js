// src/storage.js
const KEY = "mh_logs_v1";
const CONVERSATION_KEY = "mh_conversation_v1";
const USER_PROGRESS_KEY = "mh_progress_v1";

export function getLogs() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addLog({ mood, note }) {
  const all = getLogs();
  const entry = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    mood: Number(mood),
    note: (note || "").slice(0, 280),
  };
  const next = [...all, entry];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

// Conversation History Management
export function saveMessage(message) {
  try {
    const history = getConversationHistory();
    const messageEntry = {
      id: message.id || crypto.randomUUID(),
      role: message.role, // 'user' or 'assistant'
      text: message.text,
      timestamp: message.timestamp || new Date().toISOString(),
      hasImage: message.hasImage || false,
      imageUrl: message.imageUrl || null,
      metadata: message.metadata || {}
    };
    
    const updatedHistory = [...history, messageEntry];
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(updatedHistory));
    return messageEntry;
  } catch (error) {
    console.error('Failed to save message:', error);
    // Continue functioning even if storage fails
    return message;
  }
}

export function getConversationHistory(limit = null) {
  try {
    const raw = localStorage.getItem(CONVERSATION_KEY);
    const history = raw ? JSON.parse(raw) : [];
    
    if (limit && limit > 0) {
      // Return the most recent messages up to the limit
      return history.slice(-limit);
    }
    
    return history;
  } catch (error) {
    console.error('Failed to retrieve conversation history:', error);
    return [];
  }
}

export function getConversationContext(maxMessages = 10, maxTokens = 2000) {
  try {
    const history = getConversationHistory();
    if (history.length === 0) return [];
    
    // Get recent messages within limits
    const recentMessages = history.slice(-maxMessages);
    
    // Estimate token count and trim if necessary
    let contextMessages = [];
    let estimatedTokens = 0;
    
    // Work backwards from most recent messages
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const message = recentMessages[i];
      const messageTokens = estimateTokenCount(message.text);
      
      if (estimatedTokens + messageTokens > maxTokens && contextMessages.length > 0) {
        break;
      }
      
      contextMessages.unshift(message);
      estimatedTokens += messageTokens;
    }
    
    return contextMessages;
  } catch (error) {
    console.error('Failed to get conversation context:', error);
    return [];
  }
}

// Simple token estimation (roughly 4 characters per token)
function estimateTokenCount(text) {
  return Math.ceil((text || '').length / 4);
}

export function clearLogs() {
  localStorage.removeItem(KEY);
}

export function clearConversationHistory() {
  try {
    localStorage.removeItem(CONVERSATION_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear conversation history:', error);
    return false;
  }
}

// User Progress Management
export function saveUserProgress(progress) {
  try {
    const progressEntry = {
      ...progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressEntry));
    return progressEntry;
  } catch (error) {
    console.error('Failed to save user progress:', error);
    return progress;
  }
}

export function getUserProgress() {
  try {
    const raw = localStorage.getItem(USER_PROGRESS_KEY);
    if (!raw) {
      // Return default progress structure
      return {
        mood: null,
        streak: getStreak(),
        trend: getTrend(),
        logs: getLogs(),
        lastInteraction: null,
        supportLevel: 'low',
        goals: [],
        achievements: [],
        conversationCount: getConversationHistory().length,
        lastUpdated: new Date().toISOString()
      };
    }
    
    const progress = JSON.parse(raw);
    // Update dynamic fields
    progress.streak = getStreak();
    progress.trend = getTrend();
    progress.logs = getLogs();
    progress.conversationCount = getConversationHistory().length;
    
    return progress;
  } catch (error) {
    console.error('Failed to retrieve user progress:', error);
    return {
      mood: null,
      streak: 0,
      trend: 'flat',
      logs: [],
      lastInteraction: null,
      supportLevel: 'low',
      goals: [],
      achievements: [],
      conversationCount: 0,
      lastUpdated: new Date().toISOString()
    };
  }
}

// Session Management
export function updateLastInteraction() {
  try {
    const progress = getUserProgress();
    progress.lastInteraction = new Date().toISOString();
    saveUserProgress(progress);
  } catch (error) {
    console.error('Failed to update last interaction:', error);
  }
}

// Memory Statistics
export function getMemoryStats() {
  try {
    const conversationHistory = getConversationHistory();
    const userMessages = conversationHistory.filter(msg => msg.role === 'user');
    const assistantMessages = conversationHistory.filter(msg => msg.role === 'assistant');
    
    return {
      totalMessages: conversationHistory.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      totalMoodLogs: getLogs().length,
      streak: getStreak(),
      trend: getTrend(),
      storageUsed: {
        conversations: localStorage.getItem(CONVERSATION_KEY)?.length || 0,
        logs: localStorage.getItem(KEY)?.length || 0,
        progress: localStorage.getItem(USER_PROGRESS_KEY)?.length || 0
      }
    };
  } catch (error) {
    console.error('Failed to get memory stats:', error);
    return {
      totalMessages: 0,
      userMessages: 0,
      assistantMessages: 0,
      totalMoodLogs: 0,
      streak: 0,
      trend: 'flat',
      storageUsed: { conversations: 0, logs: 0, progress: 0 }
    };
  }
}

export function getStreak() {
  // count consecutive days with at least 1 log, ending today
  const logs = getLogs()
    .map(l => new Date(l.date))
    .sort((a, b) => b - a); // newest first

  if (logs.length === 0) return 0;

  const oneDay = 24 * 60 * 60 * 1000;
  let streak = 0;
  let anchor = new Date();
  anchor.setHours(0,0,0,0);

  // check days going backwards
  while (true) {
    const exists = logs.some(d => {
      const day = new Date(d);
      day.setHours(0,0,0,0);
      return Math.abs(day - anchor) < oneDay/2;
    });
    if (exists) {
      streak++;
      anchor = new Date(anchor.getTime() - oneDay);
    } else break;
  }
  return streak;
}

export function getTrend() {
  // simple: compare last 3 moods vs previous 3 moods
  const logs = getLogs().sort((a,b) => new Date(a.date) - new Date(b.date));
  if (logs.length < 4) return "flat";
  const moods = logs.map(l => l.mood);
  const half = Math.floor(moods.length / 2);
  const recent = avg(moods.slice(-3));
  const prev = avg(moods.slice(Math.max(0, half-3), half));
  if (recent - prev > 0.5) return "up";
  if (prev - recent > 0.5) return "down";
  return "flat";
}

function avg(arr){ return arr.reduce((a,b)=>a+b,0) / (arr.length || 1); }
