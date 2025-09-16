/**
 * Loading state component for mobile chat interface
 * Shows various loading states during AI processing
 */
import React from 'react';

export function MobileLoadingState({ type = 'typing', message = '' }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
  };

  const spinnerStyle = {
    width: '24px',
    height: '24px',
    border: '3px solid #E1E8ED',
    borderTop: '3px solid #6B73FF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '12px',
  };

  const pulseDotsStyle = {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px',
  };

  const dotStyle = (delay) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#6B73FF',
    animation: `pulse 1.4s ease-in-out ${delay}s infinite both`,
  });

  const textStyle = {
    fontSize: '14px',
    color: '#8E9AAF',
    textAlign: 'center',
    fontWeight: '400',
  };

  const renderLoadingContent = () => {
    switch (type) {
      case 'connecting':
        return (
          <>
            <div style={spinnerStyle}></div>
            <div style={textStyle}>
              {message || 'Connecting to AI...'}
            </div>
          </>
        );
      
      case 'processing':
        return (
          <>
            <div style={pulseDotsStyle}>
              <div style={dotStyle(0)}></div>
              <div style={dotStyle(0.2)}></div>
              <div style={dotStyle(0.4)}></div>
            </div>
            <div style={textStyle}>
              {message || 'Processing your message...'}
            </div>
          </>
        );
      
      case 'generating':
        return (
          <>
            <div style={pulseDotsStyle}>
              <div style={dotStyle(0)}></div>
              <div style={dotStyle(0.1)}></div>
              <div style={dotStyle(0.2)}></div>
              <div style={dotStyle(0.3)}></div>
              <div style={dotStyle(0.4)}></div>
            </div>
            <div style={textStyle}>
              {message || 'Generating response...'}
            </div>
          </>
        );
      
      case 'typing':
      default:
        return (
          <>
            <div style={pulseDotsStyle}>
              <div style={dotStyle(0)}></div>
              <div style={dotStyle(0.2)}></div>
              <div style={dotStyle(0.4)}></div>
            </div>
            <div style={textStyle}>
              {message || 'AI is typing...'}
            </div>
          </>
        );
    }
  };

  return (
    <div style={containerStyle}>
      {renderLoadingContent()}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default MobileLoadingState;