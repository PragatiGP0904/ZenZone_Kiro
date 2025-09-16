/**
 * Typing indicator component for AI responses
 * Shows animated dots while AI is generating response
 */
import React, { useEffect, useState } from 'react';

export function TypingIndicator({ isVisible = false }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDots('');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: '16px',
    paddingRight: '20px',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#6B73FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    marginRight: '8px',
    flexShrink: 0,
  };

  const bubbleStyle = {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '20px 20px 20px 4px',
    backgroundColor: '#F5F7FA',
    color: '#8E9AAF',
    fontSize: '16px',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
  };

  const dotsStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
  };

  const dotStyle = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#8E9AAF',
    animation: 'pulse 1.5s ease-in-out infinite',
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle}>
        🤖
      </div>
      
      <div style={bubbleStyle}>
        <span style={dotsStyle}>
          AI is thinking
          <span style={{ marginLeft: '4px', minWidth: '20px', textAlign: 'left' }}>
            {dots}
          </span>
        </span>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 70%, 100% {
            opacity: 0.4;
          }
          35% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default TypingIndicator;