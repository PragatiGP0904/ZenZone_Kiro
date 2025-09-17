import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { THEME_COLORS, TYPOGRAPHY, SPACING, COMMON_STYLES } from '../styles/zenbloom.styles';

interface LoadingScreenProps {
  progress: number;
  loadedCount: number;
  totalCount: number;
  hasError?: boolean;
  failedAssets?: string[];
}

/**
 * LoadingScreen component for asset preloading
 * Shows progress and handles loading errors gracefully
 */
export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  progress,
  loadedCount,
  totalCount,
  hasError = false,
  failedAssets = [],
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnimation]);

  // Pulse animation for loading indicator
  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (progress < 100) {
          pulse();
        }
      });
    };

    pulse();

    return () => {
      pulseAnimation.stopAnimation();
    };
  }, [pulseAnimation, progress]);

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnimation }],
            },
          ]}
        >
          <Text style={styles.logoText}>🌻</Text>
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>ZenBloom</Text>
        <Text style={styles.subtitle}>Loading your garden...</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
          
          {/* Progress Text */}
          <Text style={styles.progressText}>
            {Math.round(progress)}% ({loadedCount}/{totalCount})
          </Text>
        </View>

        {/* Error Message */}
        {hasError && failedAssets.length > 0 && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Some assets failed to load ({failedAssets.length} failed)
            </Text>
            <Text style={styles.errorSubtext}>
              Don't worry, the app will still work!
            </Text>
          </View>
        )}

        {/* Loading Tips */}
        {progress < 100 && (
          <View style={styles.tipsContainer}>
            <Text style={styles.tipText}>
              💡 Tip: Your sunflower's mood affects its appearance and animations
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...COMMON_STYLES.container,
    ...COMMON_STYLES.centerContent,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    maxWidth: 300,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: 64,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: THEME_COLORS.white,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    color: THEME_COLORS.secondaryText,
    marginBottom: SPACING.xxxl,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  progressTrack: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginBottom: SPACING.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: THEME_COLORS.happy.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: THEME_COLORS.white,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  errorSubtext: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: THEME_COLORS.secondaryText,
    textAlign: 'center',
  },
  tipsContainer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  tipText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: THEME_COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.sizes.sm,
  },
});