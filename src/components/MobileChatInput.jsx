/**
 * Mobile-optimized chat input component
 * Includes send button, voice input, mobile keyboard handling, and performance optimizations
 */
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useDebouncedCallback, useHapticFeedback, useMobileOptimizations } from '../utils/PerformanceHooks.js';

const MobileChatInput = memo(function MobileChatInput({ 
  onSend, 
  placeholder = "Type your message...", 
  disabled = false,
  showVoiceButton = false,
  onVoiceInput = null 
}) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  
  // Performance hooks
  const { triggerHaptic } = useHapticFeedback();
  const { isMobile, optimizeElement } = useMobileOptimizations();
  
  // Debounced typing indicator
  const debouncedTypingEnd = useDebouncedCallback(() => {
    setIsTyping(false);
  }, 1000);
  
  // Debounced send to prevent rapid submissions
  const debouncedSend = useDebouncedCallback((message) => {
    if (onSend && message.trim() && !disabled) {
      onSend(message.trim());
      triggerHaptic('success');
    }
  }, 300);

  const containerStyle = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #E1E8ED',
    minHeight: '60px',
    position: 'relative',
  };

  const inputContainerStyle = {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F5F7FA',
    borderRadius: '24px',
    border: isFocused ? '2px solid #6B73FF' : '1px solid #E1E8ED',
    transition: 'border-color 0.2s ease',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '24px',
    backgroundColor: 'transparent',
    fontSize: '16px',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
    color: '#2C3E50',
    outline: 'none',
    resize: 'none',
    minHeight: '20px',
    maxHeight: '100px',
    lineHeight: '1.4',
  };

  const sendButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: input.trim() ? '#6B73FF' : '#E1E8ED',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: input.trim() ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
    fontSize: '18px',
    flexShrink: 0,
  };

  const voiceButtonStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#F5F7FA',
    color: '#6B73FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '18px',
    flexShrink: 0,
    marginRight: '4px',
  };

  const handleSend = useCallback(() => {
    const message = input.trim();
    if (message && !disabled) {
      debouncedSend(message);
      setInput('');
      setIsTyping(false);
      // Auto-focus back to input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, disabled, debouncedSend]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setInput(value);
    
    // Trigger typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
    }
    
    // Reset typing indicator after user stops typing
    debouncedTypingEnd();
  }, [isTyping, debouncedTypingEnd]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleVoiceInput = useCallback(() => {
    if (onVoiceInput) {
      triggerHaptic('medium');
      onVoiceInput();
    }
  }, [onVoiceInput, triggerHaptic]);

  const handleButtonPress = useCallback(() => {
    triggerHaptic('light');
    handleSend();
  }, [triggerHaptic, handleSend]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 100)}px`;
    }
  }, [input]);

  // Optimize element for mobile interactions
  useEffect(() => {
    if (inputRef.current) {
      optimizeElement(inputRef.current);
    }
  }, [optimizeElement]);

  return (
    <div style={containerStyle}>
      {showVoiceButton && (
        <button
          style={voiceButtonStyle}
          onClick={handleVoiceInput}
          disabled={disabled}
          aria-label="Voice input"
        >
          🎤
        </button>
      )}
      
      <div style={inputContainerStyle}>
        <textarea
          ref={inputRef}
          style={inputStyle}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
        />
      </div>
      
      <button
        style={sendButtonStyle}
        onClick={handleButtonPress}
        disabled={!input.trim() || disabled}
        aria-label="Send message"
      >
        ➤
      </button>
    </div>
  );
});

export { MobileChatInput };
export default MobileChatInput;