# Requirements Document

## Introduction

This feature implements an interactive affirmation cards screen for a React Native wellness app. The screen displays inspirational affirmation cards in a stacked layout with smooth animations for card shuffling. Users can navigate through different affirmation cards using directional controls, with each card featuring unique gradient backgrounds, icons, and motivational text. The interface includes a glass-effect navigation bar and follows a specific design system with custom fonts, colors, and spacing.

## Requirements

### Requirement 1

**User Story:** As a user, I want to view affirmation cards in an attractive stacked layout, so that I can see multiple cards at once with visual depth.

#### Acceptance Criteria

1. WHEN the screen loads THEN the system SHALL display 4 affirmation cards in a stacked arrangement
2. WHEN cards are stacked THEN the front card SHALL have 0% rotation and 100% opacity
3. WHEN cards are stacked THEN the second card SHALL have 7% rotation and 75% opacity
4. WHEN cards are stacked THEN the third card SHALL have -5% rotation and 75% opacity  
5. WHEN cards are stacked THEN the fourth card SHALL have 0% rotation and 0% opacity (hidden)
6. WHEN cards are displayed THEN each card SHALL show a unique gradient background, icon, and affirmation text as seen in the UI images.

### Requirement 2

**User Story:** As a user, I want to navigate forward through affirmation cards with smooth animations, so that I can discover new inspirational content.

#### Acceptance Criteria

1. WHEN I tap the active move button (right arrow) THEN the system SHALL animate the front card moving left off-screen in 800ms
2. WHEN the front card moves off-screen THEN the second card SHALL animate to become the new front card with 0% rotation and 100% opacity
3. WHEN cards rotate forward THEN the third card SHALL animate to second position with 7% rotation and 75% opacity
4. WHEN cards rotate forward THEN the fourth card SHALL animate to third position with -5% rotation and 75% opacity
5. WHEN the animation completes THEN the previously front card SHALL move to the back position behind all other cards
6. WHEN I tap the inactive move button THEN the system SHALL NOT perform any animation

### Requirement 3

**User Story:** As a user, I want to navigate backward through affirmation cards, so that I can revisit previous affirmations.

#### Acceptance Criteria

1. WHEN I tap the left arrow button THEN the system SHALL bring the back card from off-screen left into the front position
2. WHEN navigating backward THEN the animation SHALL take 800ms to complete
3. WHEN the back card becomes front THEN it SHALL animate from -100% screen width to center position
4. WHEN navigating backward THEN all other cards SHALL adjust their positions and rotations accordingly
5. WHEN backward navigation completes THEN the card positions SHALL match the standard stacking arrangement

### Requirement 4

**User Story:** As a user, I want each affirmation card to have a unique visual design, so that the experience feels varied and engaging.

#### Acceptance Criteria

1. WHEN cards are displayed THEN each card SHALL use a different gradient background from the predefined color schemes
2. WHEN cards are displayed THEN each card SHALL show a unique icon (music note, heart, footsteps, or plant)
3. WHEN cards are displayed THEN each card SHALL display different affirmation text with appropriate color gradients
4. WHEN cards are displayed THEN the text SHALL use the Caveat-Bold font at 28px size
5. WHEN cards are displayed THEN the text SHALL use the gradient specification

### Requirement 5

**User Story:** As a user, I want the interface to include a navigation bar and header, so that I can access other app features and understand the current screen.

#### Acceptance Criteria

1. WHEN the screen loads THEN the system SHALL display a header with back button and "Affirmations" title placed in the left upper corner
2. WHEN the screen loads THEN the system SHALL display a glass-effect navigation bar at the bottom
3. WHEN the navigation bar is displayed THEN it SHALL include Home, Zenbloom, Chatbot, Calendar, and Profile icons
4. WHEN the navigation bar is displayed THEN it SHALL use the glass effect styling with blur and transparency
5. WHEN the header is displayed THEN it SHALL use the Quicksand-Bold font and proper spacing

### Requirement 6

**User Story:** As a user, I want the app to follow consistent design patterns, so that the interface feels cohesive and professional.

#### Acceptance Criteria

1. WHEN the screen is displayed THEN the background SHALL use the specified gradient from light lavender-pink to soft pink
2. WHEN elements are styled THEN the system SHALL use the predefined color palette, spacing, and font specifications
3. WHEN animations occur THEN they SHALL use smooth easing and the specified 800ms duration
4. WHEN the screen is displayed THEN all measurements SHALL be responsive to different screen sizes
5. WHEN glass effects are applied THEN they SHALL use consistent blur intensity and transparency values