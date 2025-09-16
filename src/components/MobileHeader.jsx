/**
 * Mobile Header Component
 * Provides consistent header across all screens with navigation support
 * Includes back button, title, and optional action buttons
 */

import React from 'react';
import { Icon, actionIcons } from '../utils/IconUtils.js';
import { colors, spacing, typography, mobileStyles, shadows } from '../styles/MobileChatStyles.js';

const MobileHeader = ({
  title = '',
  showBackButton = false,
  onBackPress = () => {},
  rightAction = null,
  backgroundColor = colors.white,
  textColor = colors.neutral[800],
  style = {},
  className = ''
}) => {
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.md} ${spacing.lg}`,
    paddingTop: `calc(${mobileStyles.safeArea.top} + ${spacing.md})`,
    backgroundColor,
    borderBottom: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    minHeight: mobileStyles.minTouchTarget,
    ...style,
  };

  const leftSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: '60px',
  };

  const centerSectionStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    minWidth: '60px',
    justifyContent: 'flex-end',
  };

  const titleStyle = {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.primary,
    fontWeight: typography.weights.semiBold,
    color: textColor,
    textAlign: 'center',
    lineHeight: typography.lineHeights.tight,
    margin: 0,
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: mobileStyles.minTouchTarget,
    height: mobileStyles.minTouchTarget,
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    WebkitTapHighlightColor: 'transparent',
  };

  const handleBackPress = () => {
    // Add haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onBackPress();
  };

  return (
    <header style={headerStyle} className={className}>
      <div style={leftSectionStyle}>
        {showBackButton && (
          <button
            style={backButtonStyle}
            onClick={handleBackPress}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = colors.neutral[100];
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            onTouchStart={(e) => {
              e.target.style.backgroundColor = colors.neutral[100];
              if (navigator.vibrate) {
                navigator.vibrate(5);
              }
            }}
            onTouchEnd={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="Go back"
            type="button"
          >
            <Icon
              iconPath={actionIcons.back}
              alt="Back"
              size={20}
              style={{
                filter: `brightness(0) saturate(100%) invert(45%) sepia(8%) saturate(1000%) hue-rotate(200deg) brightness(95%) contrast(85%)`,
              }}
            />
          </button>
        )}
      </div>

      <div style={centerSectionStyle}>
        {title && <h1 style={titleStyle}>{title}</h1>}
      </div>

      <div style={rightSectionStyle}>
        {rightAction}
      </div>
    </header>
  );
};

export default MobileHeader;