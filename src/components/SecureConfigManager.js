/**
 * Secure configuration manager for API keys and sensitive settings
 * Provides encryption and secure storage for API credentials
 */

/**
 * Simple encryption/decryption using Web Crypto API
 * Note: This provides basic obfuscation. For production, use proper key management.
 */
class SimpleEncryption {
  constructor() {
    this.key = null;
    this.initKey();
  }

  async initKey() {
    // Generate or retrieve encryption key
    const stored = localStorage.getItem('config_key_v1');
    if (stored) {
      this.key = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(JSON.parse(stored)),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    } else {
      this.key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      const exported = await crypto.subtle.exportKey('raw', this.key);
      localStorage.setItem('config_key_v1', JSON.stringify(Array.from(new Uint8Array(exported))));
    }
  }

  async encrypt(text) {
    if (!this.key) await this.initKey();
    
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      data
    );
    
    return {
      data: Array.from(new Uint8Array(encrypted)),
      iv: Array.from(iv)
    };
  }

  async decrypt(encryptedData) {
    if (!this.key) await this.initKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
      this.key,
      new Uint8Array(encryptedData.data)
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
}

/**
 * Secure configuration manager
 */
export class SecureConfigManager {
  constructor() {
    this.encryption = new SimpleEncryption();
    this.config = null;
    this.loadConfig();
  }

  /**
   * Load configuration from secure storage
   */
  async loadConfig() {
    try {
      const stored = localStorage.getItem('secure_ai_config_v1');
      if (stored) {
        const encryptedConfig = JSON.parse(stored);
        const decrypted = await this.encryption.decrypt(encryptedConfig);
        this.config = JSON.parse(decrypted);
      } else {
        this.config = {
          apiKeys: {},
          preferences: {
            defaultProvider: 'huggingface',
            autoSwitchOnFailure: true,
            enableAnalytics: false,
            dataRetentionDays: 30
          }
        };
      }
    } catch (error) {
      console.warn('Failed to load secure config:', error);
      this.config = {
        apiKeys: {},
        preferences: {
          defaultProvider: 'huggingface',
          autoSwitchOnFailure: true,
          enableAnalytics: false,
          dataRetentionDays: 30
        }
      };
    }
  }

  /**
   * Save configuration to secure storage
   */
  async saveConfig() {
    try {
      const configJson = JSON.stringify(this.config);
      const encrypted = await this.encryption.encrypt(configJson);
      localStorage.setItem('secure_ai_config_v1', JSON.stringify(encrypted));
    } catch (error) {
      console.error('Failed to save secure config:', error);
      throw new Error('Failed to save configuration securely');
    }
  }

  /**
   * Set API key for a provider
   * @param {'huggingface'|'openai'} provider - Provider name
   * @param {string} apiKey - API key to store
   */
  async setApiKey(provider, apiKey) {
    if (!this.config) await this.loadConfig();
    
    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('API key must be a non-empty string');
    }

    this.config.apiKeys[provider] = apiKey;
    await this.saveConfig();
  }

  /**
   * Get API key for a provider
   * @param {'huggingface'|'openai'} provider - Provider name
   * @returns {string|null} API key or null if not set
   */
  async getApiKey(provider) {
    if (!this.config) await this.loadConfig();
    return this.config.apiKeys[provider] || null;
  }

  /**
   * Remove API key for a provider
   * @param {'huggingface'|'openai'} provider - Provider name
   */
  async removeApiKey(provider) {
    if (!this.config) await this.loadConfig();
    delete this.config.apiKeys[provider];
    await this.saveConfig();
  }

  /**
   * Check if API key exists for provider
   * @param {'huggingface'|'openai'} provider - Provider name
   * @returns {boolean} Whether API key exists
   */
  async hasApiKey(provider) {
    if (!this.config) await this.loadConfig();
    return !!(this.config.apiKeys[provider]);
  }

  /**
   * Get user preferences
   * @returns {Object} User preferences
   */
  async getPreferences() {
    if (!this.config) await this.loadConfig();
    return { ...this.config.preferences };
  }

  /**
   * Update user preferences
   * @param {Object} preferences - Preferences to update
   */
  async updatePreferences(preferences) {
    if (!this.config) await this.loadConfig();
    this.config.preferences = { ...this.config.preferences, ...preferences };
    await this.saveConfig();
  }

  /**
   * Get list of configured providers
   * @returns {string[]} Array of provider names with API keys
   */
  async getConfiguredProviders() {
    if (!this.config) await this.loadConfig();
    return Object.keys(this.config.apiKeys);
  }

  /**
   * Clear all configuration data
   */
  async clearAll() {
    this.config = {
      apiKeys: {},
      preferences: {
        defaultProvider: 'huggingface',
        autoSwitchOnFailure: true,
        enableAnalytics: false,
        dataRetentionDays: 30
      }
    };
    
    try {
      localStorage.removeItem('secure_ai_config_v1');
      localStorage.removeItem('config_key_v1');
    } catch (error) {
      console.error('Failed to clear secure config:', error);
    }
  }

  /**
   * Export configuration (without API keys for security)
   * @returns {Object} Exportable configuration
   */
  async exportConfig() {
    if (!this.config) await this.loadConfig();
    
    return {
      preferences: { ...this.config.preferences },
      configuredProviders: Object.keys(this.config.apiKeys),
      exportDate: new Date().toISOString()
    };
  }

  /**
   * Import preferences (API keys must be set separately)
   * @param {Object} configData - Configuration to import
   */
  async importConfig(configData) {
    if (!this.config) await this.loadConfig();
    
    if (configData.preferences) {
      this.config.preferences = { ...this.config.preferences, ...configData.preferences };
      await this.saveConfig();
    }
  }
}

// Export singleton instance
export const secureConfig = new SecureConfigManager();