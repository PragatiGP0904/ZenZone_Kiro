import { 
  ErrorLogger, 
  ErrorType, 
  AssetRetryManager,
  createInitialFallbackState,
  handleNavigationError,
  safeNavigate
} from '../errorHandling';

describe('Error Handling Utils', () => {
  beforeEach(() => {
    ErrorLogger.clearErrors();
    AssetRetryManager.resetRetries();
  });

  describe('ErrorLogger', () => {
    it('should log errors correctly', () => {
      const error = new Error('Test error');
      const context = { test: 'context' };
      
      ErrorLogger.logError(ErrorType.ASSET_LOADING, 'Test message', error, context);
      
      const errors = ErrorLogger.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.ASSET_LOADING);
      expect(errors[0].message).toBe('Test message');
      expect(errors[0].originalError).toBe(error);
      expect(errors[0].context).toBe(context);
    });

    it('should filter errors by type', () => {
      ErrorLogger.logError(ErrorType.ASSET_LOADING, 'Asset error');
      ErrorLogger.logError(ErrorType.ANIMATION_FAILURE, 'Animation error');
      ErrorLogger.logError(ErrorType.ASSET_LOADING, 'Another asset error');
      
      const assetErrors = ErrorLogger.getErrorsByType(ErrorType.ASSET_LOADING);
      expect(assetErrors).toHaveLength(2);
      
      const animationErrors = ErrorLogger.getErrorsByType(ErrorType.ANIMATION_FAILURE);
      expect(animationErrors).toHaveLength(1);
    });

    it('should limit the number of stored errors', () => {
      // Log more than the maximum number of errors
      for (let i = 0; i < 60; i++) {
        ErrorLogger.logError(ErrorType.ASSET_LOADING, `Error ${i}`);
      }
      
      const errors = ErrorLogger.getErrors();
      expect(errors.length).toBeLessThanOrEqual(50);
    });

    it('should clear errors', () => {
      ErrorLogger.logError(ErrorType.ASSET_LOADING, 'Test error');
      expect(ErrorLogger.getErrors()).toHaveLength(1);
      
      ErrorLogger.clearErrors();
      expect(ErrorLogger.getErrors()).toHaveLength(0);
    });
  });

  describe('AssetRetryManager', () => {
    it('should retry asset loading on failure', async () => {
      let attempts = 0;
      const mockLoadFunction = jest.fn(() => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Loading failed');
        }
        return Promise.resolve();
      });

      const result = await AssetRetryManager.retryAssetLoad('test-asset', mockLoadFunction);
      
      expect(result).toBe(true);
      expect(mockLoadFunction).toHaveBeenCalledTimes(3);
    });

    it('should fail after maximum retry attempts', async () => {
      const mockLoadFunction = jest.fn(() => {
        throw new Error('Always fails');
      });

      const result = await AssetRetryManager.retryAssetLoad('test-asset', mockLoadFunction);
      
      expect(result).toBe(false);
      expect(mockLoadFunction).toHaveBeenCalledTimes(1); // Initial attempt only
    });

    it('should reset retry attempts on success', async () => {
      let attempts = 0;
      const mockLoadFunction = jest.fn(() => {
        attempts++;
        if (attempts === 1) {
          throw new Error('First attempt fails');
        }
        return Promise.resolve();
      });

      // First call should succeed after retry
      await AssetRetryManager.retryAssetLoad('test-asset', mockLoadFunction);
      
      // Reset the mock
      attempts = 0;
      mockLoadFunction.mockClear();
      
      // Second call should succeed immediately
      const result = await AssetRetryManager.retryAssetLoad('test-asset', mockLoadFunction);
      expect(result).toBe(true);
      expect(mockLoadFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe('createInitialFallbackState', () => {
    it('should create correct initial fallback state', () => {
      const state = createInitialFallbackState();
      
      expect(state.hasAssetErrors).toBe(false);
      expect(state.hasAnimationErrors).toBe(false);
      expect(state.hasNavigationErrors).toBe(false);
      expect(state.degradedMode).toBe(false);
      expect(state.failedAssets).toBeInstanceOf(Set);
      expect(state.failedAssets.size).toBe(0);
    });
  });

  describe('handleNavigationError', () => {
    it('should log navigation errors', () => {
      const error = new Error('Navigation failed');
      const context = { screen: 'splash' };
      
      const result = handleNavigationError(error, context);
      
      expect(result).toBe(false);
      
      const errors = ErrorLogger.getErrors();
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe(ErrorType.NAVIGATION_FAILURE);
    });
  });

  describe('safeNavigate', () => {
    it('should execute navigation function successfully', async () => {
      const mockNavigation = jest.fn();
      
      const result = await safeNavigate(mockNavigation);
      
      expect(result).toBe(true);
      expect(mockNavigation).toHaveBeenCalled();
    });

    it('should handle navigation errors and use fallback', async () => {
      const mockNavigation = jest.fn(() => {
        throw new Error('Navigation failed');
      });
      const mockFallback = jest.fn();
      
      const result = await safeNavigate(mockNavigation, mockFallback);
      
      expect(result).toBe(true);
      expect(mockNavigation).toHaveBeenCalled();
      expect(mockFallback).toHaveBeenCalled();
    });

    it('should fail if both navigation and fallback fail', async () => {
      const mockNavigation = jest.fn(() => {
        throw new Error('Navigation failed');
      });
      const mockFallback = jest.fn(() => {
        throw new Error('Fallback failed');
      });
      
      const result = await safeNavigate(mockNavigation, mockFallback);
      
      expect(result).toBe(false);
      expect(mockNavigation).toHaveBeenCalled();
      expect(mockFallback).toHaveBeenCalled();
    });

    it('should handle async navigation functions', async () => {
      const mockAsyncNavigation = jest.fn(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      const result = await safeNavigate(mockAsyncNavigation);
      
      expect(result).toBe(true);
      expect(mockAsyncNavigation).toHaveBeenCalled();
    });
  });
});