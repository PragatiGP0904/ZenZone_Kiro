import { Platform, Dimensions } from 'react-native';
import { ErrorLogger, ErrorType } from './errorHandling';

// Device capability detection
export interface DeviceCapabilities {
  isLowEndDevice: boolean;
  supportsComplexAnimations: boolean;
  recommendedAnimationDuration: number;
  maxConcurrentAnimations: number;
  shouldUseNativeDriver: boolean;
}

// Performance monitoring
export class PerformanceMonitor {
  private static frameDropCount = 0;
  private static animationStartTime = 0;
  private static isMonitoring = false;

  static startMonitoring() {
    this.isMonitoring = true;
    this.frameDropCount = 0;
    this.animationStartTime = Date.now();
  }

  static stopMonitoring() {
    this.isMonitoring = false;
    const duration = Date.now() - this.animationStartTime;
    
    if (this.frameDropCount > 10) {
      ErrorLogger.logError(
        ErrorType.PERFORMANCE_DEGRADATION,
        `High frame drop count: ${this.frameDropCount} in ${duration}ms`,
        undefined,
        { frameDrops: this.frameDropCount, duration }
      );
    }
  }

  static reportFrameDrop() {
    if (this.isMonitoring) {
      this.frameDropCount++;
    }
  }
}

// Device capability detection
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const { width, height } = Dimensions.get('window');
  const screenArea = width * height;
  
  // Heuristics for device capability detection
  const isLowEndDevice = Platform.select({
    ios: screenArea < 800000, // Roughly iPhone SE and below
    android: screenArea < 1000000, // Lower-end Android devices
    web: false, // Assume web can handle animations
    default: false,
  });

  const supportsComplexAnimations = Platform.select({
    ios: !isLowEndDevice,
    android: !isLowEndDevice && Platform.Version >= 21, // Android 5.0+
    web: true,
    default: true,
  });

  return {
    isLowEndDevice,
    supportsComplexAnimations,
    recommendedAnimationDuration: isLowEndDevice ? 200 : 600,
    maxConcurrentAnimations: isLowEndDevice ? 2 : 6,
    shouldUseNativeDriver: Platform.OS !== 'web',
  };
};

// Animation optimization configuration
export interface OptimizedAnimationConfig {
  duration: number;
  useNativeDriver: boolean;
  enableComplexEasing: boolean;
  maxConcurrentAnimations: number;
  shouldReduceMotion: boolean;
}

export const getOptimizedAnimationConfig = (
  baseConfig: {
    duration: number;
    isReduceMotionEnabled: boolean;
  },
  deviceCapabilities: DeviceCapabilities
): OptimizedAnimationConfig => {
  const { duration, isReduceMotionEnabled } = baseConfig;
  
  return {
    duration: isReduceMotionEnabled 
      ? Math.min(duration * 0.3, 200) 
      : Math.min(duration, deviceCapabilities.recommendedAnimationDuration),
    useNativeDriver: deviceCapabilities.shouldUseNativeDriver,
    enableComplexEasing: deviceCapabilities.supportsComplexAnimations && !isReduceMotionEnabled,
    maxConcurrentAnimations: deviceCapabilities.maxConcurrentAnimations,
    shouldReduceMotion: isReduceMotionEnabled || deviceCapabilities.isLowEndDevice,
  };
};

// Memory management for animations
export class AnimationMemoryManager {
  private static activeAnimations = new Set<string>();
  private static maxActiveAnimations = 6;

  static registerAnimation(id: string): boolean {
    if (this.activeAnimations.size >= this.maxActiveAnimations) {
      ErrorLogger.logError(
        ErrorType.PERFORMANCE_DEGRADATION,
        `Too many concurrent animations: ${this.activeAnimations.size}`,
        undefined,
        { activeAnimations: Array.from(this.activeAnimations) }
      );
      return false;
    }

    this.activeAnimations.add(id);
    return true;
  }

  static unregisterAnimation(id: string) {
    this.activeAnimations.delete(id);
  }

  static getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }

  static clearAllAnimations() {
    this.activeAnimations.clear();
  }
}

// Asset loading optimization
export interface AssetLoadingStrategy {
  preloadCritical: boolean;
  lazyLoadDecorative: boolean;
  useCompression: boolean;
  maxConcurrentLoads: number;
}

export const getAssetLoadingStrategy = (
  deviceCapabilities: DeviceCapabilities
): AssetLoadingStrategy => ({
  preloadCritical: true,
  lazyLoadDecorative: deviceCapabilities.isLowEndDevice,
  useCompression: deviceCapabilities.isLowEndDevice,
  maxConcurrentLoads: deviceCapabilities.isLowEndDevice ? 2 : 4,
});

// Performance-aware animation scheduler
export class AnimationScheduler {
  private static animationQueue: Array<{
    id: string;
    priority: number;
    execute: () => void;
  }> = [];
  private static isProcessing = false;

  static scheduleAnimation(
    id: string,
    priority: number,
    execute: () => void
  ) {
    this.animationQueue.push({ id, priority, execute });
    this.animationQueue.sort((a, b) => b.priority - a.priority); // Higher priority first
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private static async processQueue() {
    this.isProcessing = true;
    
    while (this.animationQueue.length > 0) {
      const animation = this.animationQueue.shift();
      if (animation && AnimationMemoryManager.registerAnimation(animation.id)) {
        try {
          animation.execute();
          // Small delay to prevent overwhelming the animation thread
          await new Promise(resolve => setTimeout(resolve, 16)); // ~1 frame
        } catch (error) {
          ErrorLogger.logError(
            ErrorType.ANIMATION_FAILURE,
            `Animation ${animation.id} failed`,
            error as Error
          );
        } finally {
          AnimationMemoryManager.unregisterAnimation(animation.id);
        }
      }
    }
    
    this.isProcessing = false;
  }
}