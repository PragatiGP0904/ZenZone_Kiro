import { Platform } from 'react-native';

// Error types for better error handling
export enum ErrorType {
  ASSET_LOADING = 'ASSET_LOADING',
  ANIMATION_FAILURE = 'ANIMATION_FAILURE',
  NAVIGATION_FAILURE = 'NAVIGATION_FAILURE',
  PERFORMANCE_DEGRADATION = 'PERFORMANCE_DEGRADATION',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  timestamp: number;
  context?: Record<string, any>;
}

// Error logging utility
export class ErrorLogger {
  private static errors: AppError[] = [];
  private static maxErrors = 50; // Keep last 50 errors

  static logError(type: ErrorType, message: string, originalError?: Error, context?: Record<string, any>) {
    const error: AppError = {
      type,
      message,
      originalError,
      timestamp: Date.now(),
      context,
    };

    this.errors.push(error);
    
    // Keep only the last maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.warn(`[${type}] ${message}`, originalError, context);
    }

    return error;
  }

  static getErrors(): AppError[] {
    return [...this.errors];
  }

  static getErrorsByType(type: ErrorType): AppError[] {
    return this.errors.filter(error => error.type === type);
  }

  static clearErrors() {
    this.errors = [];
  }
}

// Fallback state management
export interface FallbackState {
  hasAssetErrors: boolean;
  hasAnimationErrors: boolean;
  hasNavigationErrors: boolean;
  degradedMode: boolean;
  failedAssets: Set<string>;
}

export const createInitialFallbackState = (): FallbackState => ({
  hasAssetErrors: false,
  hasAnimationErrors: false,
  hasNavigationErrors: false,
  degradedMode: false,
  failedAssets: new Set(),
});

// Asset loading retry mechanism
export class AssetRetryManager {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 second

  static async retryAssetLoad(
    assetKey: string,
    loadFunction: () => Promise<void>
  ): Promise<boolean> {
    const currentAttempts = this.retryAttempts.get(assetKey) || 0;
    
    if (currentAttempts >= this.maxRetries) {
      ErrorLogger.logError(
        ErrorType.ASSET_LOADING,
        `Asset ${assetKey} failed after ${this.maxRetries} attempts`,
        undefined,
        { assetKey, attempts: currentAttempts }
      );
      return false;
    }

    try {
      await loadFunction();
      this.retryAttempts.delete(assetKey); // Reset on success
      return true;
    } catch (error) {
      this.retryAttempts.set(assetKey, currentAttempts + 1);
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      
      ErrorLogger.logError(
        ErrorType.ASSET_LOADING,
        `Asset ${assetKey} retry ${currentAttempts + 1}/${this.maxRetries}`,
        error as Error,
        { assetKey, attempts: currentAttempts + 1 }
      );
      
      return false;
    }
  }

  static resetRetries(assetKey?: string) {
    if (assetKey) {
      this.retryAttempts.delete(assetKey);
    } else {
      this.retryAttempts.clear();
    }
  }
}

// Navigation error handling
export const handleNavigationError = (error: Error, context?: Record<string, any>) => {
  ErrorLogger.logError(
    ErrorType.NAVIGATION_FAILURE,
    'Navigation failed',
    error,
    context
  );
  
  // Could implement fallback navigation or user notification here
  return false;
};

// Safe navigation wrapper
export const safeNavigate = async (
  navigationFunction: () => void | Promise<void>,
  fallbackFunction?: () => void
): Promise<boolean> => {
  try {
    await navigationFunction();
    return true;
  } catch (error) {
    handleNavigationError(error as Error);
    
    if (fallbackFunction) {
      try {
        fallbackFunction();
        return true;
      } catch (fallbackError) {
        ErrorLogger.logError(
          ErrorType.NAVIGATION_FAILURE,
          'Fallback navigation also failed',
          fallbackError as Error
        );
      }
    }
    
    return false;
  }
};