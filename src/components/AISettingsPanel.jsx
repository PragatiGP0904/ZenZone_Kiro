/**
 * AI Settings Panel Component
 * Provides user interface for managing AI configuration and preferences
 */

import React, { useState, useEffect } from 'react';
import { aiConfig } from '../config/AIConfig.js';
import { secureConfig } from '../config/SecureConfigManager.js';
import { AISetupWizard } from '../utils/AISetup.js';

/**
 * AI Settings Panel Component
 */
export const AISettingsPanel = ({ onClose, onConfigChange }) => {
  const [currentConfig, setCurrentConfig] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [apiKeys, setApiKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [errors, setErrors] = useState({});

  // Load current configuration
  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      const config = aiConfig.getConfig();
      const prefs = await secureConfig.getPreferences();
      const configuredProviders = await secureConfig.getConfiguredProviders();
      
      setCurrentConfig(config);
      setPreferences(prefs);
      
      // Load API key status (not the actual keys for security)
      const keyStatus = {};
      for (const provider of ['huggingface', 'openai']) {
        keyStatus[provider] = {
          configured: configuredProviders.includes(provider),
          value: configuredProviders.includes(provider) ? '••••••••••••••••' : ''
        };
      }
      setApiKeys(keyStatus);
      
    } catch (error) {
      console.error('Failed to load configuration:', error);
      setErrors({ general: 'Failed to load configuration' });
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (provider) => {
    try {
      aiConfig.setProvider(provider);
      setCurrentConfig({ ...currentConfig, provider });
      setErrors({ ...errors, provider: null });
      
      if (onConfigChange) {
        onConfigChange({ provider });
      }
    } catch (error) {
      setErrors({ ...errors, provider: error.message });
    }
  };

  const handleApiKeyChange = async (provider, value) => {
    setApiKeys({
      ...apiKeys,
      [provider]: { ...apiKeys[provider], value }
    });
  };

  const handleApiKeySave = async (provider) => {
    try {
      setSaving(true);
      const apiKey = apiKeys[provider].value;
      
      if (!apiKey || apiKey === '••••••••••••••••') {
        return;
      }

      // Validate API key format
      if (!AISetupWizard.validateApiKeyFormat(provider, apiKey)) {
        throw new Error(`Invalid ${provider} API key format`);
      }

      await secureConfig.setApiKey(provider, apiKey);
      aiConfig.setApiKey(apiKey);
      
      setApiKeys({
        ...apiKeys,
        [provider]: { configured: true, value: '••••••••••••••••' }
      });
      
      setErrors({ ...errors, [provider]: null });
      
      if (onConfigChange) {
        onConfigChange({ apiKey: provider });
      }
      
    } catch (error) {
      setErrors({ ...errors, [provider]: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleParameterChange = (param, value) => {
    try {
      const numValue = parseFloat(value);
      
      if (param === 'maxTokens') {
        aiConfig.setGenerationParams({ maxTokens: Math.round(numValue) });
      } else if (param === 'temperature') {
        aiConfig.setGenerationParams({ temperature: numValue });
      }
      
      setCurrentConfig({ ...currentConfig, [param]: numValue });
      setErrors({ ...errors, [param]: null });
      
      if (onConfigChange) {
        onConfigChange({ [param]: numValue });
      }
    } catch (error) {
      setErrors({ ...errors, [param]: error.message });
    }
  };

  const handlePreferenceChange = async (pref, value) => {
    try {
      const newPrefs = { ...preferences, [pref]: value };
      await secureConfig.updatePreferences({ [pref]: value });
      setPreferences(newPrefs);
      setErrors({ ...errors, [pref]: null });
    } catch (error) {
      setErrors({ ...errors, [pref]: error.message });
    }
  };

  const handleTestConfiguration = async () => {
    try {
      setTestResults({ testing: true });
      const results = await AISetupWizard.testConfiguration();
      setTestResults(results);
    } catch (error) {
      setTestResults({ error: error.message });
    }
  };

  const handleResetConfiguration = async () => {
    if (window.confirm('Are you sure you want to reset all AI configuration? This will remove all API keys and settings.')) {
      try {
        aiConfig.reset();
        await secureConfig.clearAll();
        await loadConfiguration();
        
        if (onConfigChange) {
          onConfigChange({ reset: true });
        }
      } catch (error) {
        setErrors({ general: 'Failed to reset configuration' });
      }
    }
  };

  if (loading) {
    return (
      <div className="ai-settings-panel loading">
        <div className="loading-spinner">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="ai-settings-panel">
      <div className="settings-header">
        <h2>AI Configuration</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      {/* Provider Selection */}
      <div className="settings-section">
        <h3>AI Provider</h3>
        <div className="provider-selection">
          <label className={`provider-option ${currentConfig?.provider === 'huggingface' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="huggingface"
              checked={currentConfig?.provider === 'huggingface'}
              onChange={() => handleProviderChange('huggingface')}
            />
            <div className="provider-info">
              <strong>Hugging Face</strong>
              <span>Free tier available, privacy-focused</span>
            </div>
          </label>
          
          <label className={`provider-option ${currentConfig?.provider === 'openai' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="provider"
              value="openai"
              checked={currentConfig?.provider === 'openai'}
              onChange={() => handleProviderChange('openai')}
            />
            <div className="provider-info">
              <strong>OpenAI</strong>
              <span>Higher quality responses, usage-based pricing</span>
            </div>
          </label>
        </div>
        {errors.provider && <div className="error-message">{errors.provider}</div>}
      </div>

      {/* API Keys */}
      <div className="settings-section">
        <h3>API Keys</h3>
        
        {['huggingface', 'openai'].map(provider => (
          <div key={provider} className="api-key-input">
            <label>{provider === 'huggingface' ? 'Hugging Face' : 'OpenAI'} API Key:</label>
            <div className="input-group">
              <input
                type="password"
                value={apiKeys[provider]?.value || ''}
                onChange={(e) => handleApiKeyChange(provider, e.target.value)}
                placeholder={`Enter ${provider} API key`}
                className={errors[provider] ? 'error' : ''}
              />
              <button
                onClick={() => handleApiKeySave(provider)}
                disabled={saving || !apiKeys[provider]?.value || apiKeys[provider]?.value === '••••••••••••••••'}
                className="save-key-button"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
            {apiKeys[provider]?.configured && (
              <div className="key-status configured">✓ API key configured</div>
            )}
            {errors[provider] && <div className="error-message">{errors[provider]}</div>}
          </div>
        ))}
      </div>

      {/* Generation Parameters */}
      <div className="settings-section">
        <h3>Response Parameters</h3>
        
        <div className="parameter-input">
          <label>Max Tokens: {currentConfig?.maxTokens}</label>
          <input
            type="range"
            min="50"
            max="500"
            value={currentConfig?.maxTokens || 150}
            onChange={(e) => handleParameterChange('maxTokens', e.target.value)}
          />
          <span className="parameter-help">Controls response length</span>
        </div>

        <div className="parameter-input">
          <label>Creativity: {currentConfig?.temperature?.toFixed(1)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={currentConfig?.temperature || 0.7}
            onChange={(e) => handleParameterChange('temperature', e.target.value)}
          />
          <span className="parameter-help">0 = focused, 1 = creative</span>
        </div>
      </div>

      {/* User Preferences */}
      {preferences && (
        <div className="settings-section">
          <h3>Preferences</h3>
          
          <div className="preference-input">
            <label>
              <input
                type="checkbox"
                checked={preferences.autoSwitchOnFailure}
                onChange={(e) => handlePreferenceChange('autoSwitchOnFailure', e.target.checked)}
              />
              Auto-switch providers on failure
            </label>
          </div>

          <div className="preference-input">
            <label>
              <input
                type="checkbox"
                checked={preferences.enableAnalytics}
                onChange={(e) => handlePreferenceChange('enableAnalytics', e.target.checked)}
              />
              Enable usage analytics
            </label>
          </div>

          <div className="preference-input">
            <label>Data retention (days):</label>
            <input
              type="number"
              min="1"
              max="365"
              value={preferences.dataRetentionDays}
              onChange={(e) => handlePreferenceChange('dataRetentionDays', parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {/* Test Configuration */}
      <div className="settings-section">
        <h3>Test Configuration</h3>
        <button onClick={handleTestConfiguration} className="test-button">
          Test AI Connection
        </button>
        
        {testResults && (
          <div className="test-results">
            {testResults.testing ? (
              <div>Testing connection...</div>
            ) : testResults.error ? (
              <div className="error-message">Test failed: {testResults.error}</div>
            ) : (
              <div>
                <div className={`test-result ${testResults.configValid ? 'success' : 'error'}`}>
                  Config Valid: {testResults.configValid ? '✓' : '✗'}
                </div>
                <div className={`test-result ${testResults.connectionTest ? 'success' : 'error'}`}>
                  Connection: {testResults.connectionTest ? '✓' : '✗'}
                </div>
                <div className={`test-result ${testResults.responseTest ? 'success' : 'error'}`}>
                  Response: {testResults.responseTest ? '✓' : '✗'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="settings-actions">
        <button onClick={handleResetConfiguration} className="reset-button">
          Reset All Settings
        </button>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default AISettingsPanel;