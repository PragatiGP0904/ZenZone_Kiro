/**
 * Main Mobile App Component
 * Integrates all components into a cohesive mobile app experience
 * Handles navigation, state management, and user journey flow
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import MobileNavigationContainer from './MobileNavigationContainer.jsx';
import MobileChatContainer from './MobileChatContainer.jsx';
import ProgressChart from '../ProgressChart.jsx';
import { AISetupWizard } from './AISetupWizard.jsx';
import { ConfigurationManager } from './ConfigurationManager.jsx';
import { EmergencyResourcesDisplay } from './EmergencyResourcesDisplay.jsx';
import { HabitCorrelationChart } from './HabitCorrelationChart.jsx';
import { isAIReady } from '../index.js';
import { 
  getConversationHistory, 
  getUserProgress
} from '../Memory.js';
import { colors, spacing, typography } from '../styles/MobileChatStyles.js';

// Enhanced screen components with full functionality
const HomeScreen = ({ userProgress, onNavigate }) => {
  const welcomeStyle = {
    padding: spacing.xl,
    textAlign: 'center',
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: spacing.lg,
    margin: `${spacing.md} 0`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={welcomeStyle}>
      <div style={{ fontSize: '48px', marginBottom: spacing.lg }}>🌸</div>
      <h1 style={{ 
        fontSize: typography.sizes.xxl, 
        fontWeight: typography.weights.bold,
        color: colors.primary[700],
        marginBottom: spacing.md,
        fontFamily: typography.fonts.primary
      }}>
        Welcome to ZenBloom
      </h1>
      <p style={{ 
        fontSize: typography.sizes.lg,
        color: colors.gray[600],
        marginBottom: spacing.xl,
        fontFamily: typography.fonts.secondary
      }}>
        Your personal mental health companion
      </p>
      
      <div style={cardStyle}>
        <h3 style={{ 
          fontSize: typography.sizes.lg,
          fontWeight: typography.weights.semiBold,
          color: colors.primary[700],
          marginBottom: spacing.sm
        }}>
          Today's Progress
        </h3>
        <p style={{ color: colors.gray[600] }}>
          Mood: {userProgress?.currentMood || 'Not set'} | 
          Streak: {userProgress?.streak || 0} days
        </p>
      </div>

      <div style={cardStyle}>
        <button 
          onClick={() => onNavigate('chat')}
          style={{
            width: '100%',
            padding: spacing.md,
            backgroundColor: colors.primary[600],
            color: colors.white,
            border: 'none',
            borderRadius: '12px',
            fontSize: typography.sizes.md,
            fontWeight: typography.weights.semiBold,
            cursor: 'pointer'
          }}
        >
          Start Conversation 💬
        </button>
      </div>
    </div>
  );
};

const ChatScreen = ({ onNavigate }) => (
  <MobileChatContainer onNavigate={onNavigate} />
);

const CalendarScreen = () => {
  const calendarStyle = {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    minHeight: '100%'
  };

  return (
    <div style={calendarStyle}>
      <h2 style={{ 
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[700],
        marginBottom: spacing.lg,
        textAlign: 'center'
      }}>
        Mood Calendar
      </h2>
      <ProgressChart />
    </div>
  );
};

const ProfileScreen = () => {
  const profileStyle = {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    minHeight: '100%'
  };

  return (
    <div style={profileStyle}>
      <h2 style={{ 
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[700],
        marginBottom: spacing.lg,
        textAlign: 'center'
      }}>
        Settings & Profile
      </h2>
      <ConfigurationManager />
    </div>
  );
};

const ZenBloomScreen = () => {
  const zenStyle = {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    minHeight: '100%'
  };

  return (
    <div style={zenStyle}>
      <h2 style={{ 
        fontSize: typography.sizes.xl,
        fontWeight: typography.weights.bold,
        color: colors.primary[700],
        marginBottom: spacing.lg,
        textAlign: 'center'
      }}>
        Habit Insights
      </h2>
      <HabitCorrelationChart />
    </div>
  );
};

/**
 * Main Mobile App Component
 */
const MobileApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userProgress, setUserProgress] = useState(null);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showEmergencyResources, setShowEmergencyResources] = useState(false);

  // Initialize app data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check AI configuration
        const aiReady = isAIReady();
        
        if (!aiReady) {
          setShowSetupWizard(true);
        }

        // Load user progress
        const progress = getUserProgress();
        setUserProgress(progress);

      } catch (error) {
        console.error('Error initializing mobile app:', error);
      }
    };

    initializeApp();
  }, []);

  // Handle navigation between screens
  const handleNavigation = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  // Handle AI setup completion
  const handleSetupComplete = useCallback(() => {
    setShowSetupWizard(false);
  }, []);

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen userProgress={userProgress} onNavigate={handleNavigation} />;
      case 'chat':
        return <ChatScreen onNavigate={handleNavigation} />;
      case 'calendar':
        return <CalendarScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'zenbloom':
        return <ZenBloomScreen />;
      default:
        return <HomeScreen userProgress={userProgress} onNavigate={handleNavigation} />;
    }
  };

  // Main app container style
  const appStyle = {
    fontFamily: typography.fonts.primary,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.gray[50],
    overflow: 'hidden'
  };

  const contentStyle = {
    flex: 1,
    overflow: 'auto',
    paddingBottom: '80px' // Space for bottom navigation
  };

  return (
    <div style={appStyle}>
      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <AISetupWizard onComplete={handleSetupComplete} />
        </div>
      )}

      {/* Emergency Resources Modal */}
      {showEmergencyResources && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <EmergencyResourcesDisplay 
            onClose={() => setShowEmergencyResources(false)} 
          />
        </div>
      )}

      {/* Main Content */}
      <div style={contentStyle}>
        {renderCurrentScreen()}
      </div>

      {/* Bottom Navigation */}
      <MobileNavigationContainer
        currentScreen={currentScreen}
        onNavigate={handleNavigation}
      />
    </div>
  );
};

export default MobileApp;