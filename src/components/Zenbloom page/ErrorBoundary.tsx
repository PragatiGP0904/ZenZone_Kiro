import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME_COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../styles/zenbloom.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component for handling animation and component failures
 * Provides fallback UI when animations fail or components crash
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>
              The animation encountered an error. Don't worry, your progress is safe.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME_COLORS.black,
    padding: SPACING.xl,
  },
  errorCard: {
    backgroundColor: THEME_COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.card,
    padding: SPACING.xxl,
    alignItems: 'center',
    maxWidth: 300,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: THEME_COLORS.primaryText,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: THEME_COLORS.secondaryText,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeights.relaxed * TYPOGRAPHY.sizes.md,
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: THEME_COLORS.happy.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xxl,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: THEME_COLORS.happy.text,
  },
});