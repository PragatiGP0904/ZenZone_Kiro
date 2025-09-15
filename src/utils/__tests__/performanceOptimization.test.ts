import { 
  detectDeviceCapabilities, 
  getOptimizedAnimationConfig,
  PerformanceMonitor,
  AnimationMemoryManager,
  AnimationScheduler
} from '../performanceOptimization';

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    Version: 28,
    select: jest.fn((config) => config.android || config.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
}));

describe('Performance Optimization Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('detectDeviceCapabilities', () => {
    it('should detect device capabilities correctly', () => {
      const capabilities = detectDeviceCapabilities();
      
      expect(capabilities).toHaveProperty('isLowEndDevice');
      expect(capabilities).toHaveProperty('supportsComplexAnimations');
      expect(capabilities).toHaveProperty('recommendedAnimationDuration');
      expect(capabilities).toHaveProperty('maxConcurrentAnimations');
      expect(capabilities).toHaveProperty('shouldUseNativeDriver');
    });

    it('should identify low-end devices correctly', () => {
      // Mock small screen dimensions
      const { Dimensions } = require('react-native');
      Dimensions.get.mockReturnValue({ width: 320, height: 480 });
      
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.isLowEndDevice).toBe(true);
      expect(capabilities.recommendedAnimationDuration).toBe(200);
    });

    it('should identify high-end devices correctly', () => {
      // Mock large screen dimensions
      const { Dimensions } = require('react-native');
      Dimensions.get.mockReturnValue({ width: 414, height: 896 });
      
      const capabilities = detectDeviceCapabilities();
      expect(capabilities.isLowEndDevice).toBe(false);
      expect(capabilities.recommendedAnimationDuration).toBe(600);
    });
  });

  describe('getOptimizedAnimationConfig', () => {
    it('should optimize animations for reduced motion', () => {
      const baseConfig = { duration: 1000, isReduceMotionEnabled: true };
      const deviceCapabilities = {
        isLowEndDevice: false,
        supportsComplexAnimations: true,
        recommendedAnimationDuration: 600,
        maxConcurrentAnimations: 6,
        shouldUseNativeDriver: true,
      };

      const optimizedConfig = getOptimizedAnimationConfig(baseConfig, deviceCapabilities);
      
      expect(optimizedConfig.duration).toBeLessThan(baseConfig.duration);
      expect(optimizedConfig.shouldReduceMotion).toBe(true);
      expect(optimizedConfig.enableComplexEasing).toBe(false);
    });

    it('should optimize animations for low-end devices', () => {
      const baseConfig = { duration: 800, isReduceMotionEnabled: false };
      const deviceCapabilities = {
        isLowEndDevice: true,
        supportsComplexAnimations: false,
        recommendedAnimationDuration: 200,
        maxConcurrentAnimations: 2,
        shouldUseNativeDriver: true,
      };

      const optimizedConfig = getOptimizedAnimationConfig(baseConfig, deviceCapabilities);
      
      expect(optimizedConfig.duration).toBe(200);
      expect(optimizedConfig.maxConcurrentAnimations).toBe(2);
      expect(optimizedConfig.enableComplexEasing).toBe(false);
    });
  });

  describe('PerformanceMonitor', () => {
    it('should start and stop monitoring correctly', () => {
      PerformanceMonitor.startMonitoring();
      expect(PerformanceMonitor['isMonitoring']).toBe(true);
      
      PerformanceMonitor.stopMonitoring();
      expect(PerformanceMonitor['isMonitoring']).toBe(false);
    });

    it('should track frame drops during monitoring', () => {
      PerformanceMonitor.startMonitoring();
      
      // Simulate frame drops
      PerformanceMonitor.reportFrameDrop();
      PerformanceMonitor.reportFrameDrop();
      
      expect(PerformanceMonitor['frameDropCount']).toBe(2);
      
      PerformanceMonitor.stopMonitoring();
    });
  });

  describe('AnimationMemoryManager', () => {
    beforeEach(() => {
      AnimationMemoryManager.clearAllAnimations();
    });

    it('should register and unregister animations', () => {
      const success = AnimationMemoryManager.registerAnimation('test-animation');
      expect(success).toBe(true);
      expect(AnimationMemoryManager.getActiveAnimationCount()).toBe(1);
      
      AnimationMemoryManager.unregisterAnimation('test-animation');
      expect(AnimationMemoryManager.getActiveAnimationCount()).toBe(0);
    });

    it('should prevent too many concurrent animations', () => {
      // Register maximum animations
      for (let i = 0; i < 6; i++) {
        AnimationMemoryManager.registerAnimation(`animation-${i}`);
      }
      
      // Try to register one more
      const success = AnimationMemoryManager.registerAnimation('overflow-animation');
      expect(success).toBe(false);
    });

    it('should clear all animations', () => {
      AnimationMemoryManager.registerAnimation('animation-1');
      AnimationMemoryManager.registerAnimation('animation-2');
      
      expect(AnimationMemoryManager.getActiveAnimationCount()).toBe(2);
      
      AnimationMemoryManager.clearAllAnimations();
      expect(AnimationMemoryManager.getActiveAnimationCount()).toBe(0);
    });
  });

  describe('AnimationScheduler', () => {
    it('should schedule animations by priority', async () => {
      const executedOrder: string[] = [];
      
      // Schedule animations with different priorities
      AnimationScheduler.scheduleAnimation('low-priority', 1, () => {
        executedOrder.push('low-priority');
      });
      
      AnimationScheduler.scheduleAnimation('high-priority', 10, () => {
        executedOrder.push('high-priority');
      });
      
      AnimationScheduler.scheduleAnimation('medium-priority', 5, () => {
        executedOrder.push('medium-priority');
      });
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(executedOrder).toEqual(['high-priority', 'medium-priority', 'low-priority']);
    });
  });
});