# Requirements Document

## Introduction

The Zenbloom page is an interactive mood visualization feature for the ZenZone app that displays a sunflower (Zenbloom) in different emotional states. The page provides users with an engaging way to track and interact with their current mood through visual metaphors, animations, and progress tracking. The feature includes three distinct mood illusions (Happy, Sad, Angry) with corresponding visual themes, interactive buttons for mood and growth tracking, and smooth animations to create an immersive experience.

## Requirements

### Requirement 1

**User Story:** As a user, I want to see a central sunflower that reflects my current mood state, so that I can visually connect with my emotional well-being.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display a sunflower using the appropriate mood-specific asset (Sunflower_Happy.png, Sunflower_Sad.png, or Sunflower_Angry.png)
2. WHEN the current mood is Happy THEN the system SHALL use Sunflower_Happy.png with Happy_State.png facial expression
3. WHEN the current mood is Sad THEN the system SHALL use Sunflower_Sad.png with Sad_State.png facial expression
4. WHEN the current mood is Angry THEN the system SHALL use Sunflower_Angry.png with Angry_State.png facial expression
5. WHEN no specific mood is active THEN the system SHALL display Sunflower_Happy.png as the default state
6. WHEN the page is active THEN the sunflower SHALL continuously sway gently from side to side using CSS animations

### Requirement 2

**User Story:** As a user, I want to see different background environments that match my mood, so that the entire scene reinforces my emotional state.

#### Acceptance Criteria

1. WHEN the mood is Happy THEN the system SHALL display Background_Happy.png as the scene background
2. WHEN the mood is Sad THEN the system SHALL display Background_Sad.png with Rainlayer_sad.png overlay for falling rain effect
3. WHEN the mood is Angry THEN the system SHALL display Background_Angry.png with fire/spark particle effects
4. WHEN any mood is active THEN the system SHALL animate cloud assets (Cloud1.png through Cloud6.png) moving across the sky
5. WHEN the page is loaded THEN the system SHALL display butterfly animations using assets Butterfly1.png through Butterfly8.png with wing-flapping effects
6. WHEN mood transitions occur THEN the system SHALL smoothly fade between background assets

### Requirement 3

**User Story:** As a user, I want to interact with mood and growth buttons, so that I can access detailed information about my emotional state and progress.

#### Acceptance Criteria

1. WHEN the page loads THEN the system SHALL display Mood button using Mood_state_Happy.png or Mood_state_angry,sad.png based on current mood
2. WHEN the page loads THEN the system SHALL display Growth button using Growth_leaf_Happy.png or Growth_leaf_sad,angry.png based on current mood
3. WHEN the Mood button is tapped THEN the system SHALL show clicked state using Mood_State_clicked_happy.png or Mood_State_clicked_sad,angry.png
4. WHEN the Growth button is tapped THEN the system SHALL show clicked state using Growth_leaf_clicked_Happy.png or Growth_leaf_clicked_sad,angry.png
5. WHEN the Mood button is tapped THEN the system SHALL open a card showing the current mood emoji and descriptive text
6. WHEN the Growth button is tapped THEN the system SHALL open a Zenbloom Growth card with streak progress bar using appropriate Flower_Growthsate assets
7. WHEN buttons are in normal state THEN the system SHALL use appropriate mood-specific button assets

### Requirement 4

**User Story:** As a user, I want to switch between different mood states, so that I can update my current emotional state and see the corresponding visual changes.

#### Acceptance Criteria

1. WHEN the page is displayed THEN the system SHALL show a "Change Mood" button at the bottom
2. WHEN the "Change Mood" button is tapped THEN the system SHALL present options for Happy, Sad, and Angry moods
3. WHEN a new mood is selected THEN the system SHALL transition sunflower assets (Sunflower_Happy.png, Sunflower_Sad.png, or Sunflower_Angry.png)
4. WHEN a new mood is selected THEN the system SHALL update background assets (Background_Happy.png, Background_Sad.png, or Background_Angry.png)
5. WHEN a new mood is selected THEN the system SHALL update button assets to match the new mood state
6. WHEN a new mood is selected THEN the system SHALL update header logo using appropriate Zenbloom_logo asset
7. WHEN a new mood is selected THEN the system SHALL update petal assets (Petal_happy.png, Petal_sad.png, or Petal_angry.png)
8. WHEN a new mood is selected THEN the system SHALL update facial expression assets (Happy_State.png, Sad_State.png, or Angry_State.png)

### Requirement 5

**User Story:** As a user, I want to see mood-specific visual elements and animations, so that each emotional state feels distinct and immersive.

#### Acceptance Criteria

1. WHEN the Happy mood is active THEN the system SHALL display Petal_happy.png for colorful, glowing petals with Happy_State.png facial expression
2. WHEN the Sad mood is active THEN the system SHALL display Petal_sad.png for droopy petals with Sad_State.png facial expression
3. WHEN the Angry mood is active THEN the system SHALL display Petal_angry.png for dry, curled petals with Angry_State.png facial expression
4. WHEN the Sad mood is active THEN the system SHALL animate Rainlayer_sad.png with falling raindrop effects
5. WHEN the Angry mood is active THEN the system SHALL display fire/spark particle effects overlaying the scene
6. WHEN mood transitions occur THEN the system SHALL smoothly animate between different petal and facial expression assets
7. WHEN the header logo is displayed THEN the system SHALL use appropriate Zenbloom_logo assets (Zenbloom_logo_Happy.png, Zenbloom_logo_Sad.png, or Zenbloom_logo_Angry.png)

### Requirement 6

**User Story:** As a user, I want to see consistent animations and visual feedback, so that the interface feels alive and responsive.

#### Acceptance Criteria

1. WHEN the page is active THEN the sunflower assets SHALL continuously sway with a gentle side-to-side CSS animation
2. WHEN the page is active THEN cloud assets (Cloud1.png through Cloud6.png) SHALL move slowly across the sky using CSS transforms
3. WHEN butterflies are visible THEN butterfly assets (Butterfly1.png through Butterfly8.png) SHALL display gentle wing-flapping animations using sprite animation or CSS keyframes
4. WHEN mood transitions occur THEN the system SHALL use smooth fade/crossfade animations between different asset sets
5. WHEN buttons are tapped THEN the system SHALL transition between normal and clicked button assets with smooth animations
6. WHEN cards are opened THEN the system SHALL use smooth slide or fade animations for card appearance
7. WHEN the Sad mood is active THEN Rainlayer_sad.png SHALL animate with falling raindrop effects

### Requirement 7

**User Story:** As a user, I want to see mood-specific text labels, so that I understand what each mood state represents.

#### Acceptance Criteria

1. WHEN the Happy mood card is displayed THEN the system SHALL show "Happy 🌼 – Your flower is blooming with joy today."
2. WHEN the Sad mood card is displayed THEN the system SHALL show "Sad 🌧️ – Your flower is wilting, cheer it up."
3. WHEN the Angry mood card is displayed THEN the system SHALL show "Angry 🔥 – Your flower is burning with frustration."
4. WHEN mood text is displayed THEN the system SHALL use appropriate emoji and encouraging language
5. WHEN the Growth card is displayed THEN the system SHALL show streak information using appropriate Flower_Growthsate assets with clear progress indicators
6. WHEN the header is displayed THEN the system SHALL show "Zenbloom" title with appropriate mood-specific logo asset

### Requirement 8

**User Story:** As a user, I want to see a back navigation button that matches the current mood theme, so that I can navigate consistently within the app.

#### Acceptance Criteria

1. WHEN the Happy mood is active THEN the system SHALL display Back_icon_happy.png for navigation
2. WHEN the Sad or Angry mood is active THEN the system SHALL display Back_icon_sad,angry.png for navigation
3. WHEN the back button is tapped THEN the system SHALL navigate to the previous screen
4. WHEN the back button is displayed THEN the system SHALL position it in the top-left area of the screen