/**
 * Virtualized Chat Container - Optimized for long conversation histories
 * Uses virtual scrolling to handle thousands of messages efficiently
 */
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import MobileChatBubble from './MobileChatBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import MobileLoadingState from './MobileLoadingState.jsx';
import MobileChatInput from './MobileChatInput.jsx';
import { useVirtualScroll, useScrollToBottom, useOptimizedMessages, usePerformanceMonitor } from '../utils/PerformanceHooks.js';
import { chatColors, spacing, shadows, typography } from '../styles/MobileChatStyles.js';

const ITEM_HEIGHT = 80; // Estimated height per message
const CONTAINER_HEIGHT = window.innerHeight - 200; // Adjust based on header/input

const VirtualizedChatContainer = memo(function VirtualizedChatContainer({ 
  messages = [], 
  onSendMessage, 
  isLoading = false,
  loadingType = 'typing',
  loadingMessage = '',
  showVoiceInput = false,
  onVoiceInput = null,
  className = '',
  style = {},
  enableVirtualization = true
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [containerHeight, setContainerHeight] = useState(CONTAINER_HEIGHT);
  const chatContainerRef = useRef(null);
  
  // Performance monitoring
  usePerformanceMonitor('VirtualizedChatContainer');
  
  // Optimize messages for rendering
  const optimizedMessages = useOptimizedMessages(messages, 2000);
  
  // Virtual scrolling setup
  const {
    scrollElementRef,
    visibleItems,
    totalHeight,
    startIndex,
    endIndex,
    handleScroll
  } = useVirtualScroll({
    items: optimizedMessages,
    containerHeight,
    itemHeight: ITEM_HEIGHT,
    buffer: 10
  });
  
  // Auto-scroll to bottom
  const { scrollRef, scrollToBottom, handleUserScroll } = useScrollToBottom(
    [optimizedMessages.length, isTyping], 
    'auto'
  );

  // Update container height on resize
  useEffect(() => {
    const updateHeight = () => {
      const newHeight = window.innerHeight - 200;
      setContainerHeight(newHeight);
    };
    
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Handle typing indicator
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Combine scroll handlers
  const handleScrollEvent = useCallback((event) => {
    if (enableVirtualization) {
      handleScroll(event);
    }
    handleUserScroll(event);
  }, [enableVirtualization, handleScroll, handleUserScroll]);

  const handleSendMessage = useCallback((message) => {
    if (onSendMessage && !isLoading) {
      onSendMessage(message);
    }
  }, [onSendMessage, isLoading]);

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
    backgroundColor: '#FAFBFC',
    WebkitOverflowScrolling: 'touch',
    position: 'relative',
    height: containerHeight,
  };

  const virtualScrollContainerStyle = {
    height: totalHeight,
    position: 'relative',
  };

  const messagesListStyle = {
    padding: `${spacing.md} ${spacing.lg}`,
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

  const renderVirtualizedMessages = () => {
    if (!enableVirtualization || optimizedMessages.length < 50) {
      // Use regular rendering for small lists
      return optimizedMessages.map((message, index) => (
        <MobileChatBubble
          key={message.id || index}
          message={message.text}
          isUser={message.role === 'user'}
          hasImage={message.hasImage}
          imageUrl={message.imageUrl}
          timestamp={message.timestamp}
        />
      ));
    }

    // Use virtual scrolling for large lists
    return (
      <div style={virtualScrollContainerStyle}>
        {visibleItems.map((item) => (
          <div
            key={item.id || item.index}
            style={{
              position: 'absolute',
              top: item.offset,
              left: 0,
              right: 0,
              height: ITEM_HEIGHT,
            }}
          >
            <MobileChatBubble
              message={item.text}
              isUser={item.role === 'user'}
              hasImage={item.hasImage}
              imageUrl={item.imageUrl}
              timestamp={item.timestamp}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderMessages = () => {
    if (optimizedMessages.length === 0) {
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

    return (
      <div style={messagesListStyle}>
        {renderVirtualizedMessages()}
        
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
    );
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Chat Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Mental Health Companion</h1>
      </div>

      {/* Messages Container */}
      <div 
        ref={(el) => {
          chatContainerRef.current = el;
          scrollRef.current = el;
          scrollElementRef.current = el;
        }}
        style={messagesContainerStyle}
        onScroll={handleScrollEvent}
      >
        {renderMessages()}
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

export { VirtualizedChatContainer };
export default VirtualizedChatContainer;