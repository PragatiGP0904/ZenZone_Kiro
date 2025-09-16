/**
 * Mobile Bottom Navigation Component
 * Implements the 5-tab navigation system using provided icons
 * Optimized for mobile touch interactions
 */

import React from 'react';
import { NavIcon, navigationIcons } from '../utils/IconUtils.js';
import { colors, spacing, typography, mobileStyles, shadows } from '../styles/MobileChatStyles.js';

const MobileBottomNavigation = ({ 
  activeTab = 'chat', 
  onTabChange = () => {},
  style = {},
  className = '' 
}) => {
  const navigationTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: navigationIcons.home,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: navigationIcons.chat,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: navigationIcons.calendar,
    },
    {
      id: 'mood',
      label: 'Mood',
      icon: navigationIcons.mood,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: navigationIcons.settings,
    },
  ];

  const handleTabPress = (tabId) => {
    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onTabChange(tabId);
  };

  const containerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.neutral[200]}`,
    paddingBottom: mobileStyles.safeArea.bottom,
    paddingTop: spacing.md,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: shadows.lg,
    zIndex: 1000,
    ...style,
  };

  const tabStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    minWidth: mobileStyles.minTouchTarget,
    minHeight: mobileStyles.minTouchTarget,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: colors.primary[50],
    transform: 'scale(1.05)',
  };

  const labelStyle = {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.primary,
    fontWeight: typography.weights.semiBold,
    marginTop: '2px',
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight,
  };

  const activeLabelStyle = {
    ...labelStyle,
    color: colors.primary[600],
  };

  const inactiveLabelStyle = {
    ...labelStyle,
    color: colors.neutral[500],
  };

  return (
    <nav style={containerStyle} className={className} role="navigation" aria-label="Main navigation">
      {navigationTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            style={isActive ? activeTabStyle : tabStyle}
            onClick={() => handleTabPress(tab.id)}
            onTouchStart={() => {
              // Add touch feedback
              if (navigator.vibrate) {
                navigator.vibrate(5);
              }
            }}
            aria-label={`Navigate to ${tab.label}`}
            aria-current={isActive ? 'page' : undefined}
            type="button"
          >
            <NavIcon
              iconPath={tab.icon}
              alt={`${tab.label} icon`}
              isActive={isActive}
              size={24}
              activeColor={colors.primary[600]}
              inactiveColor={colors.neutral[500]}
            />
            <span style={isActive ? activeLabelStyle : inactiveLabelStyle}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileBottomNavigation;