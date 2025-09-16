/**
 * Image Placeholder Component for AI Responses
 * Displays dummy image placeholders that can be easily replaced with real generated images
 * Matches Chat-2.jpg layout specifications
 */
import React, { useState } from 'react';

export function ImagePlaceholder({ 
  imageUrl = null, 
  width = 120, 
  height = 80, 
  alt = "AI generated content",
  onImageError = null,
  className = "",
  style = {}
}) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Base styles matching Chat-2.jpg layout
  const placeholderStyle = {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: '12px',
    backgroundColor: '#E8F0FE',
    border: '1px solid #E1E8ED',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    color: '#8E9AAF',
    fontFamily: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '400',
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    ...style
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '12px',
    display: imageLoadError ? 'none' : 'block'
  };

  const placeholderContentStyle = {
    textAlign: 'center',
    padding: '8px',
    lineHeight: '1.2'
  };

  const loadingStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '10px',
    color: '#6B73FF'
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoadError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageLoadError(true);
    if (onImageError) {
      onImageError();
    }
  };

  const handleImageLoadStart = () => {
    setIsLoading(true);
  };

  // Render real image if URL is provided and no error occurred
  if (imageUrl && !imageLoadError) {
    return (
      <div className={className} style={placeholderStyle}>
        <img 
          src={imageUrl}
          alt={alt}
          style={imageStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {isLoading && (
          <div style={loadingStyle}>
            Loading...
          </div>
        )}
      </div>
    );
  }

  // Render placeholder content
  return (
    <div className={className} style={placeholderStyle}>
      <div style={placeholderContentStyle}>
        <div style={{ marginBottom: '4px' }}>🖼️</div>
        <div>Image placeholder</div>
      </div>
    </div>
  );
}

/**
 * Enhanced Image Placeholder with animation and future-ready features
 */
export function AnimatedImagePlaceholder({ 
  imageUrl = null,
  width = 120,
  height = 80,
  alt = "AI generated content",
  onImageError = null,
  showAnimation = true,
  placeholderText = "Generating image...",
  className = "",
  style = {}
}) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const animatedStyle = {
    ...style,
    animation: showAnimation ? 'pulse 2s infinite' : 'none'
  };

  // Add CSS animation keyframes to document if not already present
  React.useEffect(() => {
    if (showAnimation && !document.querySelector('#image-placeholder-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'image-placeholder-styles';
      styleSheet.textContent = `
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [showAnimation]);

  return (
    <ImagePlaceholder
      imageUrl={imageUrl}
      width={width}
      height={height}
      alt={alt}
      onImageError={onImageError}
      className={className}
      style={animatedStyle}
    />
  );
}

/**
 * Image Placeholder Container for AI Messages
 * Handles positioning and layout according to Chat-2.jpg specifications
 */
export function AIMessageImageContainer({ 
  children, 
  hasImage = false, 
  imageUrl = null,
  imageWidth = 120,
  imageHeight = 80,
  className = "",
  style = {}
}) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
    ...style
  };

  return (
    <div className={className} style={containerStyle}>
      {children}
      {hasImage && (
        <ImagePlaceholder
          imageUrl={imageUrl}
          width={imageWidth}
          height={imageHeight}
          alt="AI generated supportive content"
        />
      )}
    </div>
  );
}

export default ImagePlaceholder;