import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Text, StyleSheet, ImageStyle, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { ASSETS, AssetKey } from '../constants/assets';
import { ErrorLogger, ErrorType, AssetRetryManager } from '../utils/errorHandling';
import { detectDeviceCapabilities, getAssetLoadingStrategy } from '../utils/performanceOptimization';

interface SafeImageProps {
  assetKey: AssetKey;
  style?: ImageStyle;
  fallbackStyle?: ViewStyle;
  fallbackTextStyle?: TextStyle;
  showFallbackText?: boolean;
  onError?: (error: Error) => void;
  onLoad?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  priority?: 'high' | 'normal' | 'low';
  enableRetry?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
  assetKey,
  style,
  fallbackStyle,
  fallbackTextStyle,
  showFallbackText = false,
  onError,
  onLoad,
  resizeMode = 'contain',
  priority = 'normal',
  enableRetry = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();
  const deviceCapabilities = detectDeviceCapabilities();
  const loadingStrategy = getAssetLoadingStrategy(deviceCapabilities);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  const handleError = async (error: any) => {
    const errorMessage = `Failed to load asset: ${assetKey}`;
    
    // Log the error
    ErrorLogger.logError(
      ErrorType.ASSET_LOADING,
      errorMessage,
      error,
      { assetKey, retryCount, priority }
    );

    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    // Try retry if enabled and not exceeded max attempts
    if (enableRetry && retryCount < 2) {
      setIsRetrying(true);
      
      const retrySuccess = await AssetRetryManager.retryAssetLoad(
        assetKey,
        () => new Promise((resolve, reject) => {
          // Create a new image instance for retry
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = ASSETS[assetKey] as any;
        })
      );

      if (retrySuccess) {
        setIsRetrying(false);
        setRetryCount(prev => prev + 1);
        // Force re-render by updating loading state
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 100);
        return;
      }
    }

    // If retry failed or not enabled, show error state
    setHasError(true);
    setIsLoading(false);
    setIsRetrying(false);
    
    if (onError) {
      onError(new Error(errorMessage));
    }
  };

  const handleLoad = () => {
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }

    setIsLoading(false);
    setIsRetrying(false);
    setHasError(false);
    
    if (onLoad) {
      onLoad();
    }
  };

  const handleLoadStart = () => {
    // Set a timeout for loading based on priority and device capabilities
    const timeout = priority === 'high' ? 5000 : 
                   priority === 'normal' ? 8000 : 12000;
    
    // Adjust timeout for low-end devices
    const adjustedTimeout = deviceCapabilities.isLowEndDevice ? timeout * 1.5 : timeout;

    loadTimeoutRef.current = setTimeout(() => {
      if (isLoading && !hasError) {
        handleError(new Error('Asset loading timeout'));
      }
    }, adjustedTimeout);
  };

  // Show loading state for high priority assets or when retrying
  if (isLoading && (priority === 'high' || isRetrying)) {
    return (
      <View style={[styles.loadingContainer, fallbackStyle]}>
        <ActivityIndicator 
          size="small" 
          color="rgba(255, 255, 255, 0.7)" 
        />
        {isRetrying && (
          <Text style={[styles.retryText, fallbackTextStyle]}>
            Retrying...
          </Text>
        )}
      </View>
    );
  }

  // Show error fallback
  if (hasError) {
    return (
      <View style={[styles.fallbackContainer, fallbackStyle]}>
        {showFallbackText && (
          <Text style={[styles.fallbackText, fallbackTextStyle]}>
            Image not available
          </Text>
        )}
        <View style={styles.errorIndicator} />
      </View>
    );
  }

  return (
    <Image
      source={ASSETS[assetKey]}
      style={style}
      resizeMode={resizeMode}
      onError={handleError}
      onLoad={handleLoad}
      onLoadStart={handleLoadStart}
      onLoadEnd={handleLoad}
      // Performance optimization: fade in duration
      fadeDuration={deviceCapabilities.isLowEndDevice ? 0 : 200}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 40,
    minWidth: 40,
  },
  fallbackContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  fallbackText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  retryText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  errorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 100, 100, 0.6)',
    position: 'absolute',
    top: 4,
    right: 4,
  },
});

export default SafeImage;