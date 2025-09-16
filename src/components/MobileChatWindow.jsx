// src/components/MobileChatWindow.jsx - Mobile-Optimized Version with AI Integration and Performance Optimizations
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { coachReply, addMoodLogWithContext } from "../Chat-Bot.js";
import { getConversationHistory, saveMessage } from "../Memory.js";
import MobileChatContainer from "./MobileChatContainer.jsx";
import VirtualizedChatContainer from "./VirtualizedChatContainer.jsx";
import { useHapticFeedback, useOptimizedMessages, usePerformanceMonitor } from "../utils/PerformanceHooks.js";
import { memoryUtils } from "../utils/PerformanceUtils.js";
import { chatColors, spacing, typography, borderRadius } from "../styles/MobileChatStyles.js";

const MobileChatWindow = memo(function MobileChatWindow({ onNewLog, addLog }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitMood, setAwaitMood] = useState(false);
  const [note, setNote] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [useVirtualization, setUseVirtualization] = useState(false);
  
  // Performance hooks
  const { triggerHaptic } = useHapticFeedback();
  usePerformanceMonitor('MobileChatWindow');
  
  // Optimize messages for rendering
  const optimizedMessages = useOptimizedMessages(messages, 2000);

  // Load conversation history on component mount
  useEffect(() => {
    const loadConversationHistory = () => {
      try {
        const history = getConversationHistory();
        
        if (history && history.length > 0) {
          // Convert memory format to component format if needed
          const formattedMessages = history.map((msg, index) => ({
            id: msg.id || index + 1,
            role: msg.role || (msg.sender === 'user' ? 'user' : 'assistant'),
            text: msg.text || msg.message || '',
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            hasImage: msg.hasImage || (msg.role === 'assistant' && msg.role !== 'user')
          }));
          
          // Clean up old messages to prevent memory issues
          const cleanedMessages = memoryUtils.cleanupOldMessages(formattedMessages, 2000);
          setMessages(cleanedMessages);
          
          // Enable virtualization for large conversation histories
          if (cleanedMessages.length > 100) {
            setUseVirtualization(true);
          }
        } else {
          // Set default welcome message if no history
          const welcomeMessage = { 
            id: 1,
            role: "assistant", 
            text: "Hey, I'm your gentle coach 💬 Tell me how you're doing today.",
            timestamp: new Date(),
            hasImage: false
          };
          
          setMessages([welcomeMessage]);
          
          // Save welcome message to memory
          try {
            saveMessage(welcomeMessage);
          } catch (error) {
            console.error('Error saving welcome message:', error);
          }
        }
      } catch (error) {
        console.error('Error loading conversation history:', error);
        
        // Fallback to default welcome message
        const welcomeMessage = { 
          id: 1,
          role: "assistant", 
          text: "Hey, I'm your gentle coach 💬 Tell me how you're doing today.",
          timestamp: new Date(),
          hasImage: false
        };
        
        setMessages([welcomeMessage]);
      } finally {
        setIsInitialized(true);
      }
    };

    loadConversationHistory();
  }, []);

  const send = useCallback(async (text) => {
    if (!text.trim()) return;
    
    // Trigger haptic feedback for message send
    triggerHaptic('light');
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
      hasImage: false
    };
    
    setMessages(m => {
      const newMessages = [...m, userMessage];
      // Enable virtualization if conversation gets long
      if (newMessages.length > 100 && !useVirtualization) {
        setUseVirtualization(true);
      }
      return newMessages;
    });
    setIsLoading(true);

    // Save user message to memory
    try {
      saveMessage(memoryUtils.optimizeMessage(userMessage));
    } catch (error) {
      console.error('Error saving user message:', error);
    }

    try {
      // Get AI response using the enhanced coachReply function
      const reply = await coachReply(text.trim());
      
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: reply,
        timestamp: new Date(),
        hasImage: true // AI messages include image placeholders
      };
      
      // Save AI message to memory
      try {
        saveMessage(memoryUtils.optimizeMessage(aiMessage));
      } catch (error) {
        console.error('Error saving AI message:', error);
      }
      
      const moodMessage = {
        id: Date.now() + 2,
        role: "assistant",
        text: "On a scale of 1–10, how's your mood right now?",
        timestamp: new Date(),
        hasImage: false
      };
      
      setMessages(m => [...m, aiMessage, moodMessage]);
      setIsLoading(false);
      setAwaitMood(true);
      
      // Success haptic feedback
      triggerHaptic('success');
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Error haptic feedback
      triggerHaptic('error');
      
      // Fallback error message
      const errorMessage = {
        id: Date.now() + 1,
        role: "assistant",
        text: "I'm having trouble connecting right now. Please try again in a moment. 💛",
        timestamp: new Date(),
        hasImage: false
      };
      
      setMessages(m => [...m, errorMessage]);
      setIsLoading(false);
    }
  }, [triggerHaptic, useVirtualization]);

  const submitMood = useCallback((mood) => {
    // Haptic feedback for mood selection
    triggerHaptic('medium');
    
    const n = note.trim();
    const moodData = { mood, note: n, timestamp: new Date() };
    
    // Use enhanced mood logging with AI context
    try {
      if (addLog) {
        const all = addLog(moodData);
        onNewLog?.(all);
      } else {
        // Use the enhanced mood logging function
        const updatedLogs = addMoodLogWithContext(moodData);
        onNewLog?.(updatedLogs);
      }
    } catch (error) {
      console.error('Error logging mood:', error);
      // Fallback to basic logging
      onNewLog?.(moodData);
    }
    
    const moodMessage = {
      id: Date.now(),
      role: "user",
      text: `Mood: ${mood}${n ? ` • Note: ${n}` : ""}`,
      timestamp: new Date(),
      hasImage: false
    };
    
    // Save mood message to memory
    try {
      saveMessage(memoryUtils.optimizeMessage(moodMessage));
    } catch (error) {
      console.error('Error saving mood message:', error);
    }
    
    const responseMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: "Noted. Proud of you for checking in. 🌟",
      timestamp: new Date(),
      hasImage: false
    };
    
    // Save response message to memory
    try {
      saveMessage(memoryUtils.optimizeMessage(responseMessage));
    } catch (error) {
      console.error('Error saving response message:', error);
    }
    
    setMessages(m => [...m, moodMessage, responseMessage]);
    setNote("");
    setAwaitMood(false);
  }, [note, addLog, onNewLog, triggerHaptic]);

  // Mobile mood selector component
  const MoodSelector = () => {
    const containerStyle = {
      padding: spacing.lg,
      backgroundColor: chatColors.white,
      borderTop: `1px solid ${chatColors.aiBubble.border}`,
    };

    const titleStyle = {
      fontSize: typography.sizes.base,
      fontWeight: typography.weights.semiBold,
      color: chatColors.aiBubble.text,
      marginBottom: spacing.md,
      textAlign: 'center',
      fontFamily: typography.fonts.primary,
    };

    const moodGridStyle = {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    };

    const moodButtonStyle = (number) => ({
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      border: 'none',
      backgroundColor: chatColors.userBubble.background,
      color: chatColors.userBubble.text,
      fontSize: typography.sizes.md,
      fontWeight: typography.weights.semiBold,
      cursor: 'pointer',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    });

    const noteInputStyle = {
      width: '100%',
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      border: `1px solid ${chatColors.input.border}`,
      backgroundColor: chatColors.input.background,
      fontSize: typography.sizes.md,
      fontFamily: typography.fonts.secondary,
      color: chatColors.input.text,
      outline: 'none',
    };

    return (
      <div style={containerStyle}>
        <div style={titleStyle}>Pick your mood (1=low, 10=great)</div>
        <div style={moodGridStyle}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <button 
              key={n} 
              style={moodButtonStyle(n)}
              onClick={() => submitMood(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <input
          style={noteInputStyle}
          placeholder="Optional note (what influenced your mood?)"
          value={note}
          onChange={e => setNote(e.target.value)}
          onKeyPress={e => e.key === "Enter" && note.trim() && submitMood("— pick a number above —")}
        />
      </div>
    );
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: chatColors.white
      }}>
        <div style={{
          fontSize: typography.sizes.lg,
          color: chatColors.typing.text,
          fontFamily: typography.fonts.primary
        }}>
          Loading your conversation...
        </div>
      </div>
    );
  }

  // Choose container based on message count and virtualization setting
  const ChatContainer = useVirtualization ? VirtualizedChatContainer : MobileChatContainer;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ChatContainer
        messages={optimizedMessages}
        onSendMessage={send}
        isLoading={isLoading}
        loadingType="processing"
        loadingMessage="Generating supportive response..."
        showVoiceInput={false}
        enableVirtualization={useVirtualization}
        style={{ flex: awaitMood ? '1 1 auto' : '1' }}
      />
      
      {awaitMood && <MoodSelector />}
    </div>
  );
});

export default MobileChatWindow;