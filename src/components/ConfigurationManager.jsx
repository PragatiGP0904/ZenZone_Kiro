/**
 * Configuration Manager Component
 * Main interface for managing all AI configuration aspects
 */

import React, { useState, useEffect } from 'react';
import AISettingsPanel from './AISettingsPanel.jsx';
import AISetupWizard from './AISetupWizard.jsx';
import { aiConfig } from '../config/AIConfig.js';
import { secureConfig } from '../config/SecureConfigManager.js';
import { providerSwitcher } from '../utils/ProviderSwitcher.js';

/**
 * Configuration Manager Component
 */
export const ConfigurationManager = ({ children, onConfigurationChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentProvider, setCurrentProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize configuration state
  useEffect(() => {
    initializeConfiguration();
  }, []);

  const initializeConfiguration = async () => {
    try {
      setLoading(true);
      
      // Initialize provider switcher
      await providerSwitcher.initialize();
      
      // Check if any providers are configured
      const configuredProviders = await secureConfig.getConfiguredProviders();
      const hasConfiguration = configuredProviders.length > 0;
      
      setIsConfigured(hasConfiguration);
      
      if (hasConfiguration) {
        const config = aiConfig.getConfig();
        setCurrentProvider(config.provider);
      } else {
        // Show setup wizard for first-time users
        setShowSetupWizard(true);
      }
      
    } catch (error) {
      console.error('Failed to initialize configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleConfigChange = async (changes) => {
    try {
      // Update local state
      if (changes.provider) {
        setCurrentProvider(changes.provider);
      }
      
      // Notify parent component
      if (onConfigurationChange) {
        onConfigurationChange(changes);
      }
      
      // Check if configuration is now complete
      const configuredProviders = await secureConfig.getConfiguredProviders();
      setIsConfigured(configuredProviders.length > 0);
      
    } catch (error) {
      console.error('Failed to handle config change:', error);
    }
  };

  const handleSetupComplete = async (setupResult) => {
    try {
      setShowSetupWizard(false);
      
      if (setupResult.configured) {
        setIsConfigured(true);
        setCurrentProvider(setupResult.provider);
        
        if (onConfigurationChange) {
          onConfigurationChange({
            setupComplete: true,
            provider: setupResult.provider
          });
        }
      }
      
    } catch (error) {
      console.error('Failed to handle setup completion:', error);
    }
  };

  const handleSetupSkip = () => {
    setShowSetupWizard(false);
    // User can still access settings later to configure
  };

  const handleProviderSwitch = async (targetProvider) => {
    try {
      const success = await providerSwitcher.switchToProvider(targetProvider, {
        reason: 'user_request',
        validateConnection: true
      });
      
      if (success) {
        setCurrentProvider(targetProvider);
        
        if (onConfigurationChange) {
          onConfigurationChange({
            providerSwitched: true,
            provider: targetProvider
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Failed to switch provider:', error);
      return false;
    }
  };

  // Auto-switch on API failures
  const handleAutoSwitch = async (failureReason) => {
    try {
      const success = await providerSwitcher.autoSwitchOnFailure(failureReason);
      
      if (success) {
        const newProvider = providerSwitcher.getCurrentProviderInfo().name;
        setCurrentProvider(newProvider);
        
        if (onConfigurationChange) {
          onConfigurationChange({
            autoSwitched: true,
            provider: newProvider,
            reason: failureReason
          });
        }
      }
      
      return success;
    } catch (error) {
      console.error('Auto-switch failed:', error);
      return false;
    }
  };

  // Provide configuration context to children
  const configurationContext = {
    isConfigured,
    currentProvider,
    showSettings: handleShowSettings,
    switchProvider: handleProviderSwitch,
    autoSwitch: handleAutoSwitch,
    providerSwitcher
  };

  if (loading) {
    return (
      <div className="configuration-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="configuration-manager">
      {/* Pass configuration context to children */}
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { configurationContext })
          : child
      )}

      {/* Configuration Status Indicator */}
      {isConfigured && (
        <div className="config-status-indicator">
          <button 
            onClick={handleShowSettings}
            className="config-status-button"
            title="AI Configuration Settings"
          >
            <span className="provider-indicator">
              {currentProvider === 'huggingface' ? '🤗' : '🤖'}
            </span>
            <span className="status-dot configured"></span>
          </button>
        </div>
      )}

      {/* Setup Wizard */}
      {showSetupWizard && (
        <AISetupWizard
          onComplete={handleSetupComplete}
          onSkip={handleSetupSkip}
        />
      )}

      {/* Settings Panel */}
      {showSettings && (
        <AISettingsPanel
          onClose={handleCloseSettings}
          onConfigChange={handleConfigChange}
        />
      )}
    </div>
  );
};

/**
 * Hook for accessing configuration context
 */
export const useConfiguration = () => {
  const [context, setContext] = useState(null);
  
  useEffect(() => {
    // This would be provided by a React Context in a full implementation
    // For now, we'll create a simple context object
    const createContext = async () => {
      const configuredProviders = await secureConfig.getConfiguredProviders();
      const config = aiConfig.getConfig();
      
      setContext({
        isConfigured: configuredProviders.length > 0,
        currentProvider: config.provider,
        providerSwitcher
      });
    };
    
    createContext();
  }, []);
  
  return context;
};

export default ConfigurationManager;