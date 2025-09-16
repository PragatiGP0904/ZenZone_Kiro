/**
 * Mobile Chat Container - Main chat interface component
 * Integrates all mobile chat components with responsive design and performance optimizations
 */
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import MobileChatBubble from './MobileChatBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import MobileLoadingState from './MobileLoadingState.jsx';
import MobileChatInput from './MobileChatInput.jsx';
import { useScrollToBottom, usePerformanceMonitor } from '../utils/PerformanceHooks.js';
import { chatColors, spacing, shadows, mobileStyles, typography } from '../styles/MobileChatStyles.js';

const MobileChatContainer = memo(function MobileChatContainer({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  loadingType = 'typing',
  loadingMessage = '',
  showVoiceInput = false,
  onVoiceInput = null,
  className = '',
  style = {}
}) {
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  
  // Performance monitoring
  usePerformanceMonitor('MobileChatContainer');
  
  // Optimized scroll to bottom
  const { scrollRef, scrollToBottom, handleUserScroll } = useScrollToBottom(
    [messages.length, isTyping]
  );

  // Combine scroll refs
  useEffect(() => {
    if (chatContainerRef.current) {
      scrollRef.current = chatContainerRef.current;
    }
  }, [scrollRef]);

  // Handle typing indicator
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      // Delay hiding typing indicator for smoother UX
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100vh',
    backgroundColor: chatColors.white,
    fontFamily: typography.fonts.secondary,
    position: 'relative',
    ...style,
  };

  const headerStyle = {
    padding: `${spacing.lg} ${spacing.lg} ${spacing.md}`,
    backgroundColor: chatColors.white,
    borderBottom: `1px solid ${chatColors.aiBubble.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: shadows.sm,
  };

  const titleStyle = {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    fontFamily: typography.fonts.primary,
    color: chatColors.aiBubble.text,
    margin: 0,
  };

  const messagesContainerStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: '#FAFBFC',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };

  const messagesListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    minHeight: '100%',
    paddingBottom: spacing.lg,
  };

  const welcomeMessageStyle = {
    textAlign: 'center',
    padding: `${spacing.xxl} ${spacing.lg}`,
    color: chatColors.typing.text,
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.secondary,
    lineHeight: typography.lineHeights.relaxed,
  };

  const handleSendMessage = useCallback((message) => {
    if (onSendMessage && !isLoading) {
      onSendMessage(message);
    }
  }, [onSendMessage, isLoading]);

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div style={welcomeMessageStyle}>
          <div style={{ fontSize: typography.sizes.xxl, marginBottom: spacing.md }}>
            🤖
          </div>
          <div>
            Hi there! I'm your mental health companion. 
            <br />
            How are you feeling today?
          </div>
        </div>
      );
    }

    return messages.map((message, index) => (
      <MobileChatBubble
        key={message.id || index}
        message={message.text}
        isUser={message.role === 'user'}
        hasImage={message.hasImage}
        imageUrl={message.imageUrl}
        timestamp={message.timestamp}
      />
    ));
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Chat Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Mental Health Companion</h1>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        style={messagesContainerStyle}
        onScroll={handleUserScroll}
      >
        <div style={messagesListStyle}>
          {renderMessages()}
          
          {/* Typing Indicator */}
          {isTyping && !isLoading && (
            <TypingIndicator isVisible={true} />
          )}
          
          {/* Loading State */}
          {isLoading && (
            <MobileLoadingState 
              type={loadingType} 
              message={loadingMessage} 
            />
          )}
        </div>
      </div>

      {/* Chat Input */}
      <MobileChatInput
        onSend={handleSendMessage}
        disabled={isLoading}
        showVoiceButton={showVoiceInput}
        onVoiceInput={onVoiceInput}
        placeholder="Share how you're feeling..."
      />
    </div>
  );
});

export { MobileChatContainer };
export default MobileChatContainer;