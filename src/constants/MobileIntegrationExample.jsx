/**
 * Mobile Integration Example
 * Shows how to integrate mobile chat components with existing AI services
 */
import React, { useState, useEffect } from 'react';
import { MobileChatWindow, MobileChatContainer } from '../components/index.js';
import { getAIResponse, isAIReady } from '../index.js';

// Example 1: Drop-in replacement for existing ChatWindow
export function MobileReplacementExample({ onNewLog }) {
  // Simple storage mock (replace with your actual storage)
  const addLog = (data) => {
    const logEntry = {
      ...data,
      id: Date.now(),
      timestamp: new Date()
    };
    
    // Store in localStorage for demo
    const logs = JSON.parse(localStorage.getItem('moodLogs') || '[]');
    logs.push(logEntry);
    localStorage.setItem('moodLogs', JSON.stringify(logs));
    
    return logEntry;
  };

  return (
    <div style={{ height: '100vh' }}>
      <MobileChatWindow 
        onNewLog={onNewLog}
        addLog={addLog}
      />
    </div>
  );
}

// Example 2: Custom integration with AI services
export function AIIntegratedMobileChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Hello! I\'m your AI mental health companion. How are you feeling today?',
      timestamp: new Date(),
      hasImage: true
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiReady, setAiReady] = useState(false);

  // Check if AI is configured
  useEffect(() => {
    setAiReady(isAIReady());
  }, []);

  const handleSendMessage = async (text) => {
    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date(),
      hasImage: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let aiResponse;
      
      if (aiReady) {
        // Use real AI service
        const conversationHistory = messages.slice(-5); // Last 5 messages for context
        aiResponse = await getAIResponse(text, conversationHistory);
      } else {
        // Fallback to rule-based responses
        const { coachReply } = await import('../Chat-Bot.js');
        aiResponse = coachReply(text);
      }

      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: aiResponse,
        timestamp: new Date(),
        hasImage: true // AI messages include image placeholders
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('AI response failed:', error);
      
      // Fallback error message
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: 'I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        hasImage: false
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    // Placeholder for voice input functionality
    alert('Voice input would be implemented here using Web Speech API or similar');
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* AI Status Indicator */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        backgroundColor: aiReady ? '#22C55E' : '#F59E0B',
        color: 'white',
        fontWeight: '500'
      }}>
        {aiReady ? '🤖 AI Ready' : '⚡ Rule-based'}
      </div>

      <MobileChatContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        loadingType="generating"
        loadingMessage="Creating a thoughtful response..."
        showVoiceInput={true}
        onVoiceInput={handleVoiceInput}
      />
    </div>
  );
}

// Example 3: Progressive enhancement - start simple, add features
export function ProgressiveEnhancementExample() {
  const [features, setFeatures] = useState({
    voiceInput: false,
    imageGeneration: false,
    aiResponses: false
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Welcome! I\'m starting with basic features. You can enable more advanced features using the controls above.',
      timestamp: new Date(),
      hasImage: false
    }
  ]);

  const handleSendMessage = async (text) => {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      text,
      timestamp: new Date(),
      hasImage: false
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate different response types based on enabled features
    setTimeout(() => {
      let responseText = 'Thanks for sharing that with me.';
      
      if (features.aiResponses) {
        responseText = 'I understand how you\'re feeling. Let\'s explore this together. What would help you feel better right now?';
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: responseText,
        timestamp: new Date(),
        hasImage: features.imageGeneration
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const toggleFeature = (feature) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Feature Controls */}
      <div style={{
        padding: '10px',
        backgroundColor: '#F5F7FA',
        borderBottom: '1px solid #E1E8ED',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {Object.entries(features).map(([feature, enabled]) => (
          <button
            key={feature}
            onClick={() => toggleFeature(feature)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: enabled ? '#6B73FF' : '#E1E8ED',
              color: enabled ? 'white' : '#2C3E50',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {feature.replace(/([A-Z])/g, ' $1').toLowerCase()}
          </button>
        ))}
      </div>

      {/* Chat Interface */}
      <div style={{ flex: 1 }}>
        <MobileChatContainer
          messages={messages}
          onSendMessage={handleSendMessage}
          showVoiceInput={features.voiceInput}
          onVoiceInput={() => alert('Voice input activated!')}
        />
      </div>
    </div>
  );
}

// Example 4: Full app integration with navigation
export function FullAppExample() {
  const [currentScreen, setCurrentScreen] = useState('chat');
  const [moodLogs, setMoodLogs] = useState([]);

  const handleNewLog = (logData) => {
    setMoodLogs(prev => [...prev, logData]);
  };

  const screens = {
    chat: {
      title: 'Chat',
      component: () => (
        <MobileReplacementExample onNewLog={handleNewLog} />
      )
    },
    progress: {
      title: 'Progress',
      component: () => (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Your Progress</h2>
          <p>Mood logs: {moodLogs.length}</p>
          <div style={{ marginTop: '20px' }}>
            {moodLogs.slice(-5).map((log, i) => (
              <div key={i} style={{ 
                padding: '10px', 
                margin: '5px 0', 
                backgroundColor: '#F5F7FA',
                borderRadius: '8px'
              }}>
                Mood: {log.mood} - {log.note || 'No note'}
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  const CurrentScreen = screens[currentScreen].component;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <div style={{
        display: 'flex',
        backgroundColor: '#6B73FF',
        color: 'white'
      }}>
        {Object.entries(screens).map(([key, screen]) => (
          <button
            key={key}
            onClick={() => setCurrentScreen(key)}
            style={{
              flex: 1,
              padding: '15px',
              border: 'none',
              backgroundColor: currentScreen === key ? '#5B63D3' : 'transparent',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            {screen.title}
          </button>
        ))}
      </div>

      {/* Screen Content */}
      <div style={{ flex: 1 }}>
        <CurrentScreen />
      </div>
    </div>
  );
}

// Main example selector
export default function MobileIntegrationExample() {
  const [currentExample, setCurrentExample] = useState('replacement');

  const examples = {
    replacement: { component: MobileReplacementExample, title: 'Drop-in Replacement' },
    ai: { component: AIIntegratedMobileChat, title: 'AI Integration' },
    progressive: { component: ProgressiveEnhancementExample, title: 'Progressive Enhancement' },
    fullApp: { component: FullAppExample, title: 'Full App' }
  };

  const CurrentExample = examples[currentExample].component;

  return (
    <div style={{ height: '100vh' }}>
      {/* Example Selector */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        backgroundColor: 'white',
        borderBottom: '2px solid #6B73FF',
        padding: '10px'
      }}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {Object.entries(examples).map(([key, example]) => (
            <button
              key={key}
              onClick={() => setCurrentExample(key)}
              style={{
                padding: '6px 12px',
                borderRadius: '16px',
                border: 'none',
                backgroundColor: currentExample === key ? '#6B73FF' : '#F5F7FA',
                color: currentExample === key ? 'white' : '#2C3E50',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {example.title}
            </button>
          ))}
        </div>
      </div>

      {/* Example Content */}
      <div style={{ paddingTop: '50px', height: 'calc(100vh - 50px)' }}>
        <CurrentExample />
      </div>
    </div>
  );
}