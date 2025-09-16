/**
 * Configuration system for AI provider selection and settings
 * Supports Hugging Face Inference API and OpenAI API
 * Integrates with SecureConfigManager for API key management
 */

import { secureConfig } from './SecureConfigManager.js';

/**
 * @typedef {Object} AIConfig
 * @property {'huggingface'|'openai'} provider - AI provider to use
 * @property {string} apiKey - API key for the selected provider
 * @property {string} [model] - Specific model to use (optional)
 * @property {number} [maxTokens] - Maximum tokens for response
 * @property {number} [temperature] - Response creativity (0-1)
 * @property {boolean} [enableSafetyFilter] - Enable additional safety filtering
 * @property {number} [timeout] - Request timeout in milliseconds
 */

/**
 * Default configuration values
 */
const DEFAULT_CONFIG = {
  provider: 'huggingface',
  maxTokens: 150,
  temperature: 0.7,
  enableSafetyFilter: true,
  timeout: 10000,
  // Default models for each provider
  models: {
    huggingface: 'microsoft/DialoGPT-medium',
    openai: 'gpt-3.5-turbo'
  }
};

/**
 * Configuration manager for AI services
 */
export class AIConfigManager {
  constructor() {
    this.config = null;
    this.initialized = false;
    this.init();
  }

  async init() {
    this.config = await this.loadConfig();
    this.initialized = true;
  }

  /**
   * Load configuration from localStorage or use defaults
   * @returns {AIConfig} Current configuration
   */
  async loadConfig() {
    try {
      const stored = localStorage.getItem('ai_config_v1');
      let config = { ...DEFAULT_CONFIG };
      
      if (stored) {
        const parsed = JSON.parse(stored);
        config = { ...config, ...parsed };
      }
      
      // Load API key from secure storage if available
      if (config.provider) {
        const apiKey = await secureConfig.getApiKey(config.provider);
        if (apiKey) {
          config.apiKey = apiKey;
        }
      }
      
      return config;
    } catch (error) {
      console.warn('Failed to load AI config from storage:', error);
      return { ...DEFAULT_CONFIG };
    }
  }

  /**
   * Save configuration to localStorage
   * @param {Partial<AIConfig>} newConfig - Configuration updates
   */
  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    try {
      localStorage.setItem('ai_config_v1', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save AI config:', error);
    }
  }

  /**
   * Get current configuration
   * @returns {AIConfig} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Update API provider
   * @param {'huggingface'|'openai'} provider - New provider
   */
  setProvider(provider) {
    if (!['huggingface', 'openai'].includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`);
    }
    
    this.saveConfig({ 
      provider,
      model: DEFAULT_CONFIG.models[provider]
    });
  }

  /**
   * Set API key for current provider
   * @param {string} apiKey - API key
   */
  async setApiKey(apiKey) {
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }
    
    // Store API key securely
    await secureConfig.setApiKey(this.config.provider, apiKey);
    this.saveConfig({ apiKey });
  }

  /**
   * Set model for current provider
   * @param {string} model - Model identifier
   */
  setModel(model) {
    if (!model || typeof model !== 'string') {
      throw new Error('Model must be a non-empty string');
    }
    
    this.saveConfig({ model });
  }

  /**
   * Update generation parameters
   * @param {Object} params - Generation parameters
   * @param {number} [params.maxTokens] - Maximum tokens
   * @param {number} [params.temperature] - Temperature (0-1)
   */
  setGenerationParams({ maxTokens, temperature }) {
    const updates = {};
    
    if (maxTokens !== undefined) {
      if (typeof maxTokens !== 'number' || maxTokens < 1 || maxTokens > 1000) {
        throw new Error('maxTokens must be a number between 1 and 1000');
      }
      updates.maxTokens = maxTokens;
    }
    
    if (temperature !== undefined) {
      if (typeof temperature !== 'number' || temperature < 0 || temperature > 1) {
        throw new Error('temperature must be a number between 0 and 1');
      }
      updates.temperature = temperature;
    }
    
    this.saveConfig(updates);
  }

  /**
   * Check if current configuration is valid
   * @returns {boolean} Whether configuration is valid
   */
  isValid() {
    const config = this.getConfig();
    
    // Check required fields
    if (!config.provider || !['huggingface', 'openai'].includes(config.provider)) {
      return false;
    }
    
    if (!config.apiKey || typeof config.apiKey !== 'string') {
      return false;
    }
    
    // Check parameter ranges
    if (config.maxTokens < 1 || config.maxTokens > 1000) {
      return false;
    }
    
    if (config.temperature < 0 || config.temperature > 1) {
      return false;
    }
    
    return true;
  }

  /**
   * Get validation errors for current configuration
   * @returns {string[]} Array of validation error messages
   */
  getValidationErrors() {
    const errors = [];
    const config = this.getConfig();
    
    if (!config.provider) {
      errors.push('Provider is required');
    } else if (!['huggingface', 'openai'].includes(config.provider)) {
      errors.push('Provider must be either "huggingface" or "openai"');
    }
    
    if (!config.apiKey) {
      errors.push('API key is required');
    } else if (typeof config.apiKey !== 'string') {
      errors.push('API key must be a string');
    }
    
    if (config.maxTokens < 1 || config.maxTokens > 1000) {
      errors.push('maxTokens must be between 1 and 1000');
    }
    
    if (config.temperature < 0 || config.temperature > 1) {
      errors.push('temperature must be between 0 and 1');
    }
    
    return errors;
  }

  /**
   * Reset configuration to defaults
   */
  reset() {
    this.config = { ...DEFAULT_CONFIG };
    try {
      localStorage.removeItem('ai_config_v1');
    } catch (error) {
      console.error('Failed to clear AI config:', error);
    }
  }

  /**
   * Get provider-specific configuration
   * @returns {Object} Provider-specific config
   */
  getProviderConfig() {
    const config = this.getConfig();
    
    const baseConfig = {
      apiKey: config.apiKey,
      model: config.model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      timeout: config.timeout
    };
    
    if (config.provider === 'huggingface') {
      return {
        ...baseConfig,
        baseURL: 'https://api-inference.huggingface.co/models/',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      };
    }
    
    if (config.provider === 'openai') {
      return {
        ...baseConfig,
        baseURL: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json'
        }
      };
    }
    
    throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// Export singleton instance
export const aiConfig = new AIConfigManager();

// Export configuration constants
export { DEFAULT_CONFIG };