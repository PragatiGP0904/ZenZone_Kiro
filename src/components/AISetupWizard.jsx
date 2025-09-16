/**
 * AI Setup Wizard Component
 * Guides users through initial AI configuration setup
 */

import React, { useState, useEffect } from 'react';
import { AISetupWizard as SetupUtils } from '../utils/AISetup.js';
import { secureConfig } from '../config/SecureConfigManager.js';

/**
 * Setup Wizard Component
 */
export const AISetupWizard = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState('huggingface');
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [setupComplete, setSetupComplete] = useState(false);

  const steps = [
    'welcome',
    'provider-selection',
    'api-key-setup',
    'validation',
    'completion'
  ];

  // Check if setup is already complete
  useEffect(() => {
    checkExistingSetup();
  }, []);

  const checkExistingSetup = async () => {
    try {
      const configuredProviders = await secureConfig.getConfiguredProviders();
      if (configuredProviders.length > 0) {
        setSetupComplete(true);
        setCurrentStep(4); // Jump to completion step
      }
    } catch (error) {
      console.error('Failed to check existing setup:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setApiKey('');
    setValidationError('');
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);
    setValidationError('');
  };

  const validateAndSetup = async () => {
    try {
      setIsValidating(true);
      setValidationError('');

      // Validate API key format
      if (!SetupUtils.validateApiKeyFormat(selectedProvider, apiKey)) {
        throw new Error(`Invalid ${selectedProvider} API key format`);
      }

      // Attempt setup
      const success = await SetupUtils.quickSetup(selectedProvider, apiKey);
      
      if (success) {
        setSetupComplete(true);
        handleNext();
      } else {
        throw new Error('Failed to initialize AI service');
      }

    } catch (error) {
      setValidationError(error.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        provider: selectedProvider,
        configured: setupComplete
      });
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  const renderWelcomeStep = () => (
    <div className="wizard-step welcome-step">
      <div className="step-icon">🤖</div>
      <h2>Welcome to Mental Health AI</h2>
      <p>
        Let's set up your AI companion to provide personalized mental health support. 
        This setup will only take a few minutes.
      </p>
      <div className="step-benefits">
        <div className="benefit">
          <span className="benefit-icon">💬</span>
          <span>Natural conversations with AI</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">🔒</span>
          <span>Secure and private</span>
        </div>
        <div className="benefit">
          <span className="benefit-icon">📊</span>
          <span>Progress tracking</span>
        </div>
      </div>
      <div className="step-actions">
        <button onClick={handleNext} className="primary-button">
          Get Started
        </button>
        <button onClick={handleSkip} className="secondary-button">
          Skip Setup
        </button>
      </div>
    </div>
  );

  const renderProviderStep = () => (
    <div className="wizard-step provider-step">
      <h2>Choose Your AI Provider</h2>
      <p>Select the AI service you'd like to use for conversations:</p>
      
      <div className="provider-options">
        <div 
          className={`provider-card ${selectedProvider === 'huggingface' ? 'selected' : ''}`}
          onClick={() => handleProviderSelect('huggingface')}
        >
          <div className="provider-header">
            <h3>Hugging Face</h3>
            <span className="provider-badge free">Free Tier</span>
          </div>
          <div className="provider-features">
            <div className="feature">✓ Free tier available</div>
            <div className="feature">✓ Privacy-focused</div>
            <div className="feature">✓ Open source models</div>
            <div className="feature">⚠ May have slower responses</div>
          </div>
          <div className="provider-setup">
            <strong>Setup:</strong> Free account at huggingface.co
          </div>
        </div>

        <div 
          className={`provider-card ${selectedProvider === 'openai' ? 'selected' : ''}`}
          onClick={() => handleProviderSelect('openai')}
        >
          <div className="provider-header">
            <h3>OpenAI</h3>
            <span className="provider-badge paid">Paid</span>
          </div>
          <div className="provider-features">
            <div className="feature">✓ High-quality responses</div>
            <div className="feature">✓ Fast and reliable</div>
            <div className="feature">✓ Advanced capabilities</div>
            <div className="feature">💰 Usage-based pricing</div>
          </div>
          <div className="provider-setup">
            <strong>Setup:</strong> API key from platform.openai.com
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button onClick={handleBack} className="secondary-button">
          Back
        </button>
        <button onClick={handleNext} className="primary-button">
          Continue
        </button>
      </div>
    </div>
  );

  const renderApiKeyStep = () => {
    const instructions = SetupUtils.getSetupInstructions(selectedProvider);
    
    return (
      <div className="wizard-step api-key-step">
        <h2>Set Up {instructions.title}</h2>
        
        <div className="instructions">
          <h3>Instructions:</h3>
          <ol>
            {instructions.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="api-key-input">
          <label>Enter your API key:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder={`Paste your ${selectedProvider} API key here`}
            className={validationError ? 'error' : ''}
          />
          {validationError && (
            <div className="error-message">{validationError}</div>
          )}
        </div>

        <div className="notes">
          <h4>Notes:</h4>
          <ul>
            {instructions.notes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>

        <div className="step-actions">
          <button onClick={handleBack} className="secondary-button">
            Back
          </button>
          <button 
            onClick={validateAndSetup} 
            className="primary-button"
            disabled={!apiKey || isValidating}
          >
            {isValidating ? 'Validating...' : 'Validate & Setup'}
          </button>
        </div>
      </div>
    );
  };

  const renderValidationStep = () => (
    <div className="wizard-step validation-step">
      <div className="validation-spinner">
        <div className="spinner"></div>
        <h2>Validating Configuration</h2>
        <p>Testing your API key and connection...</p>
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="wizard-step completion-step">
      <div className="success-icon">✅</div>
      <h2>Setup Complete!</h2>
      <p>
        Your AI companion is ready to help with mental health support and conversations.
      </p>
      
      <div className="setup-summary">
        <div className="summary-item">
          <strong>Provider:</strong> {selectedProvider === 'huggingface' ? 'Hugging Face' : 'OpenAI'}
        </div>
        <div className="summary-item">
          <strong>Status:</strong> <span className="status-ready">Ready</span>
        </div>
      </div>

      <div className="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>Start a conversation with your AI companion</li>
          <li>Track your mood and progress</li>
          <li>Customize settings in the configuration panel</li>
        </ul>
      </div>

      <div className="step-actions">
        <button onClick={handleComplete} className="primary-button">
          Start Chatting
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return renderWelcomeStep();
      case 'provider-selection':
        return renderProviderStep();
      case 'api-key-setup':
        return renderApiKeyStep();
      case 'validation':
        return renderValidationStep();
      case 'completion':
        return renderCompletionStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <div className="ai-setup-wizard">
      <div className="wizard-container">
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="wizard-content">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default AISetupWizard;