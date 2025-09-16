/**
 * Mobile Navigation Container
 * Handles screen switching and navigation state management
 * Provides the main app structure with bottom navigation
 */

import React, { useState, useCallback } from 'react';
import MobileBottomNavigation from './MobileBottomNavigation.jsx';
import MobileChatContainer from './MobileChatContainer.jsx';
import { colors, mobileStyles, spacing } from '../styles/MobileChatStyles.js';

// Placeholder screen components (to be implemented in future tasks)
const HomeScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.neutral[600],
  }}>
    <div>
      <h2 style={{ marginBottom: spacing.md, color: colors.primary[600] }}>Welcome Home</h2>
      <p>Your mental health journey starts here</p>
    </div>
  </div>
);

const CalendarScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.neutral[600],
  }}>
    <div>
      <h2 style={{ marginBottom: spacing.md, color: colors.primary[600] }}>Calendar</h2>
      <p>Track your mood and appointments</p>
    </div>
  </div>
);

const MoodScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.neutral[600],
  }}>
    <div>
      <h2 style={{ marginBottom: spacing.md, color: colors.primary[600] }}>Mood Tracker</h2>
      <p>Monitor your emotional wellbeing</p>
    </div>
  </div>
);

const SettingsScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.neutral[600],
  }}>
    <div>
      <h2 style={{ marginBottom: spacing.md, color: colors.primary[600] }}>Settings</h2>
      <p>Customize your experience</p>
    </div>
  </div>
);

const MobileNavigationContainer = ({ 
  initialTab = 'chat',
  onTabChange,
  style = {},
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
    if (onTabChange) {
      onTabChange(newTab);
    }
  }, [onTabChange]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'chat':
        return <MobileChatContainer />;
      case 'calendar':
        return <CalendarScreen />;
      case 'mood':
        return <MoodScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <MobileChatContainer />;
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: mobileStyles.fullHeight,
    width: mobileStyles.fullWidth,
    backgroundColor: colors.neutral[50],
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const screenContainerStyle = {
    flex: 1,
    overflow: 'hidden',
    paddingBottom: '80px', // Space for bottom navigation
    position: 'relative',
  };

  const screenStyle = {
    height: '100%',
    width: '100%',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={screenContainerStyle}>
        <div style={screenStyle}>
          {renderScreen()}
        </div>
      </div>
      
      <MobileBottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default MobileNavigationContainer;