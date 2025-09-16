/**
 * Mobile Navigation Integration Example
 * Shows how to integrate the navigation system with the existing AI chat functionality
 * Demonstrates the complete mobile app structure with all navigation features
 */

import React, { useState, useEffect } from 'react';
import { 
  MobileNavigationContainer, 
  MobileHeader,
  MobileChatContainer 
} from '../components/index.js';
import { getAIResponse, isAIReady } from '../index.js';
import { colors, spacing, typography } from '../styles/MobileChatStyles.js';

/**
 * Complete Mobile App Example
 * This shows how to integrate navigation with the AI chat functionality
 */
const MobileAppExample = () => {
  const [currentTab, setCurrentTab] = useState('chat');
  const [aiStatus, setAiStatus] = useState('checking');

  useEffect(() => {
    // Check AI readiness on component mount
    const checkAI = async () => {
      try {
        const ready = isAIReady();
        setAiStatus(ready ? 'ready' : 'not-configured');
      } catch (error) {
        setAiStatus('error');
      }
    };
    
    checkAI();
  }, []);

  const handleTabChange = (newTab) => {
    setCurrentTab(newTab);
    console.log(`Navigated to: ${newTab}`);
  };

  const appStyle = {
    width: '100%',
    maxWidth: '414px',
    height: '896px',
    margin: '0 auto',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: colors.white,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={appStyle}>
      <MobileNavigationContainer
        initialTab="chat"
        onTabChange={handleTabChange}
      />
    </div>
  );
};

/**
 * Navigation with Custom Screens Example
 * Shows how to create custom screens that integrate with the navigation
 */
const CustomScreensExample = () => {
  const [activeTab, setActiveTab] = useState('home');

  // Custom Home Screen with AI status
  const CustomHomeScreen = () => (
    <div style={{
      padding: spacing.xl,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <MobileHeader title="Mental Health Companion" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{
          fontSize: typography.sizes.xxl,
          fontFamily: typography.fonts.primary,
          fontWeight: typography.weights.bold,
          color: colors.primary[600],
          marginBottom: spacing.lg,
        }}>
          Welcome to Your Journey
        </h1>
        <p style={{
          fontSize: typography.sizes.md,
          fontFamily: typography.fonts.secondary,
          color: colors.neutral[600],
          lineHeight: typography.lineHeights.relaxed,
          marginBottom: spacing.xl,
        }}>
          Your AI-powered mental health companion is here to support you every step of the way.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: spacing.md,
          marginTop: spacing.lg,
        }}>
          <button
            style={{
              padding: spacing.md,
              backgroundColor: colors.primary[500],
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              fontSize: typography.sizes.sm,
              fontFamily: typography.fonts.primary,
              fontWeight: typography.weights.semiBold,
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('chat')}
          >
            Start Chatting
          </button>
          <button
            style={{
              padding: spacing.md,
              backgroundColor: colors.success[500],
              color: colors.white,
              border: 'none',
              borderRadius: '8px',
              fontSize: typography.sizes.sm,
              fontFamily: typography.fonts.primary,
              fontWeight: typography.weights.semiBold,
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('mood')}
          >
            Track Mood
          </button>
        </div>
      </div>
    </div>
  );

  // Custom Settings Screen
  const CustomSettingsScreen = () => (
    <div style={{ padding: spacing.xl }}>
      <MobileHeader title="Settings" showBackButton={true} onBackPress={() => setActiveTab('home')} />
      <div style={{ marginTop: spacing.xl }}>
        <h2 style={{
          fontSize: typography.sizes.lg,
          fontFamily: typography.fonts.primary,
          fontWeight: typography.weights.semiBold,
          color: colors.neutral[800],
          marginBottom: spacing.lg,
        }}>
          App Preferences
        </h2>
        
        <div style={{ marginBottom: spacing.lg }}>
          <h3 style={{
            fontSize: typography.sizes.md,
            fontFamily: typography.fonts.primary,
            fontWeight: typography.weights.semiBold,
            color: colors.neutral[700],
            marginBottom: spacing.sm,
          }}>
            AI Provider
          </h3>
          <select style={{
            width: '100%',
            padding: spacing.md,
            border: `1px solid ${colors.neutral[300]}`,
            borderRadius: '6px',
            fontSize: typography.sizes.sm,
            fontFamily: typography.fonts.secondary,
          }}>
            <option value="openai">OpenAI GPT</option>
            <option value="huggingface">Hugging Face</option>
          </select>
        </div>

        <div style={{ marginBottom: spacing.lg }}>
          <h3 style={{
            fontSize: typography.sizes.md,
            fontFamily: typography.fonts.primary,
            fontWeight: typography.weights.semiBold,
            color: colors.neutral[700],
            marginBottom: spacing.sm,
          }}>
            Notifications
          </h3>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: typography.sizes.sm,
            fontFamily: typography.fonts.secondary,
            color: colors.neutral[600],
          }}>
            <input type="checkbox" style={{ marginRight: spacing.sm }} />
            Daily mood check-in reminders
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      width: '100%',
      maxWidth: '414px',
      height: '896px',
      margin: '0 auto',
      border: `1px solid ${colors.neutral[300]}`,
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: colors.white,
    }}>
      {/* Custom screen rendering based on active tab */}
      {activeTab === 'home' && <CustomHomeScreen />}
      {activeTab === 'chat' && <MobileChatContainer />}
      {activeTab === 'settings' && <CustomSettingsScreen />}
      {/* Add other custom screens as needed */}
      
      {/* Bottom Navigation */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {/* Navigation would be rendered here */}
      </div>
    </div>
  );
};

/**
 * Icon Integration Example
 * Shows how to use the provided icons in custom components
 */
const IconIntegrationExample = () => {
  const { Icon, NavIcon, navigationIcons, actionIcons } = require('../utils/IconUtils.js');

  return (
    <div style={{ padding: spacing.xl }}>
      <h2 style={{
        fontSize: typography.sizes.lg,
        fontFamily: typography.fonts.primary,
        fontWeight: typography.weights.bold,
        color: colors.primary[600],
        marginBottom: spacing.lg,
      }}>
        Icon Integration Examples
      </h2>

      <div style={{ marginBottom: spacing.lg }}>
        <h3 style={{ marginBottom: spacing.md, color: colors.neutral[700] }}>
          Navigation Icons
        </h3>
        <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          {Object.entries(navigationIcons).map(([name, path]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <Icon iconPath={path} alt={name} size={32} />
              <p style={{ fontSize: typography.sizes.xs, marginTop: spacing.xs }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: spacing.lg }}>
        <h3 style={{ marginBottom: spacing.md, color: colors.neutral[700] }}>
          Active/Inactive States
        </h3>
        <div style={{ display: 'flex', gap: spacing.lg, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <NavIcon iconPath={navigationIcons.chat} alt="Chat" isActive={false} size={32} />
            <p style={{ fontSize: typography.sizes.xs, marginTop: spacing.xs }}>
              Inactive
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <NavIcon iconPath={navigationIcons.chat} alt="Chat" isActive={true} size={32} />
            <p style={{ fontSize: typography.sizes.xs, marginTop: spacing.xs }}>
              Active
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: spacing.md, color: colors.neutral[700] }}>
          Action Icons
        </h3>
        <div style={{ display: 'flex', gap: spacing.md, flexWrap: 'wrap' }}>
          {Object.entries(actionIcons).map(([name, path]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <Icon iconPath={path} alt={name} size={24} />
              <p style={{ fontSize: typography.sizes.xs, marginTop: spacing.xs }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Export all examples
export {
  MobileAppExample,
  CustomScreensExample,
  IconIntegrationExample
};

export default MobileAppExample;