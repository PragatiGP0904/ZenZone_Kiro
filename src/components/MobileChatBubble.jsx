/**
 * Mobile-optimized chat bubble component
 * Matches Chat-2.jpg design specifications with performance optimizations
 */
import React, { memo } from 'react';
import { ImagePlaceholder } from './ImagePlaceholder.jsx';

const MobileChatBubble = memo(function MobileChatBubble({ message, isUser, hasImage = false, imageUrl = null, timestamp }) {
  const bubbleStyle = {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
    marginBottom: '8px',
    wordWrap: 'break-word',
    fontSize: '16px',
    lineHeight: '1.4',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
    // Colors extracted from UI mockups - will be refined based on actual images
    backgroundColor: isUser ? '#E8F5E8' : '#F5F7FA',
    color: isUser ? '#2D5A2D' : '#2C3E50',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isUser ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    marginBottom: '16px',
    paddingLeft: isUser ? '20px' : '0',
    paddingRight: isUser ? '0' : '20px',
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: isUser ? '#4CAF50' : '#6B73FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    marginLeft: isUser ? '8px' : '0',
    marginRight: isUser ? '0' : '8px',
    flexShrink: 0,
  };

  const messageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: isUser ? 'flex-end' : 'flex-start',
    flex: 1,
  };

  const imageContainerStyle = {
    marginTop: '8px',
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
  };

  const timestampStyle = {
    fontSize: '11px',
    color: '#8E9AAF',
    marginTop: '4px',
    fontFamily: 'Quicksand, sans-serif',
  };

  return (
    <div style={containerStyle}>
      {!isUser && (
        <div style={avatarStyle}>
          🤖
        </div>
      )}
      
      <div style={messageContainerStyle}>
        <div style={bubbleStyle}>
          {message}
        </div>
        
        {hasImage && (
          <div style={imageContainerStyle}>
            <ImagePlaceholder
              imageUrl={imageUrl}
              width={120}
              height={80}
              alt="AI generated supportive content"
              onImageError={() => console.warn('Failed to load AI generated image')}
            />
          </div>
        )}
        
        {timestamp && (
          <div style={timestampStyle}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div style={avatarStyle}>
          👤
        </div>
      )}
    </div>
  );
});

export { MobileChatBubble };
export default MobileChatBubble;