import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Animated, Image, Dimensions, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import theme configuration
import { COLORS, SPACING, FONTS, GLASS_EFFECTS, ICON_PATHS } from '../../constants/theme';

// Import card data configuration
import { AFFIRMATION_CARDS } from '../../constants/cardData';

// Import card component
import AffirmationCard from './AffirmationCard';

/**
 * Create responsive animation configuration based on screen dimensions
 * Defines the stacking positions and transforms for each card position
 * Optimized with smooth easing and timing for better performance
 */
const createAnimationConfig = (screenWidth) => ({
  // Card positions in stacked arrangement (Requirements 1.2, 1.3, 1.4, 1.5)
  // Responsive translateX values based on screen width
  positions: [
    { translateX: 0, rotate: 0, opacity: 1, scale: 1 },      // Front card: 0% rotation, 100% opacity
    { translateX: screenWidth * 0.025, rotate: 7, opacity: 0.75, scale: 0.95 }, // Second card: 2.5% of screen width
    { translateX: screenWidth * 0.05, rotate: -5, opacity: 0.75, scale: 0.9 }, // Third card: 5% of screen width
    { translateX: screenWidth * 0.075, rotate: 0, opacity: 0, scale: 0.85 },    // Fourth card: 7.5% of screen width
  ],
  // Animation timing with smooth easing for better performance
  duration: 800,
  easing: Easing.out(Easing.cubic), // Smooth cubic easing for natural motion
  // Off-screen position for animations (responsive)
  offScreenLeft: -screenWidth * 1.2, // 120% of screen width to the left
});

/**
 * Create responsive styles based on calculated dimensions and safe area insets
 * Ensures proper layout on different Android screen sizes (Requirement 6.4)
 */
const createResponsiveStyles = (dimensions, insets) => ({
  container: {
    // Add safe area padding for status bar
    paddingTop: insets.top,
  },
  header: {
    paddingHorizontal: dimensions.screenPadding,
    height: dimensions.headerHeight,
    // Ensure header doesn't overlap with status bar
    paddingTop: Math.max(10, insets.top * 0.5),
  },
  centerContainer: {
    paddingHorizontal: dimensions.screenPadding,
  },
  cardStackContainer: {
    width: dimensions.cardWidth,
    height: dimensions.cardHeight,
  },
  stackedCard: {
    width: dimensions.cardWidth,
    height: dimensions.cardHeight,
  },
  navigationControls: {
    paddingHorizontal: dimensions.controlButtonSpacing,
  },
  controlButton: {
    width: dimensions.controlButtonSize,
    height: dimensions.controlButtonSize,
    borderRadius: dimensions.controlButtonSize / 2,
  },
  navigationContainer: {
    paddingHorizontal: dimensions.screenPadding,
    // Add safe area padding for navigation area
    paddingBottom: Math.max(20, insets.bottom + 10),
  },
  navigationBar: {
    height: dimensions.navbarHeight,
  },
});

/**
 * Helper function to create animation references for a single card
 * Creates Animated.Value references for translateX, rotate, opacity, and scale
 */
const createCardAnimationRefs = () => ({
  translateX: new Animated.Value(0),
  rotate: new Animated.Value(0),
  opacity: new Animated.Value(1),
  scale: new Animated.Value(1),
});

/**
 * Helper function to set immediate animation values without animation
 * Used for initial positioning and instant value updates
 */
const setAnimationValues = (animationRefs, values) => {
  animationRefs.translateX.setValue(values.translateX);
  animationRefs.rotate.setValue(values.rotate);
  animationRefs.opacity.setValue(values.opacity);
  animationRefs.scale.setValue(values.scale);
};

/**
 * Helper function to get initial card positioning based on stack position
 * Implements the stacking arrangement as specified in requirements
 */
const getInitialCardPosition = (position, animationConfig) => {
  if (position < animationConfig.positions.length) {
    return animationConfig.positions[position];
  }
  // Cards beyond the 4th position are hidden off-screen
  return { translateX: 0, rotate: 0, opacity: 0, scale: 1 };
};

/**
 * Helper function to validate animation cycle integrity
 * Ensures all cards maintain proper positioning throughout the cycle
 */
const validateAnimationCycle = (cardOrder, cardAnimations, animationConfig) => {
  // Verify that all cards are accounted for in the order
  const expectedCards = [...Array(cardAnimations.length).keys()];
  const hasAllCards = expectedCards.every(cardIndex => cardOrder.includes(cardIndex));
  
  if (!hasAllCards) {
    console.warn('Animation cycle validation failed: Missing cards in order');
    return false;
  }
  
  // Verify no duplicate cards in order
  const uniqueCards = new Set(cardOrder);
  if (uniqueCards.size !== cardOrder.length) {
    console.warn('Animation cycle validation failed: Duplicate cards in order');
    return false;
  }
  
  return true;
};

const AffirmationScreen = () => {
  // Get screen dimensions for responsive design (Requirement 6.4)
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  // Get safe area insets for proper spacing around status bar and navigation areas
  // Provide fallback values if SafeAreaProvider is not available (e.g., in tests)
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    // Fallback values for when SafeAreaProvider is not available
    insets = { top: 0, bottom: 0, left: 0, right: 0 };
  }
  
  // Memoize responsive dimensions to prevent unnecessary recalculations
  const responsiveDimensions = useMemo(() => ({
    // Card dimensions: 80% of screen width, maintaining aspect ratio
    cardWidth: Math.min(screenWidth * 0.8, 320), // Max width of 320
    cardHeight: Math.min(screenWidth * 0.8 * 1.43, 460), // Maintain 1:1.43 aspect ratio, max height 460
    
    // Responsive spacing based on screen size
    screenPadding: screenWidth * 0.05, // 5% of screen width
    controlButtonSize: Math.min(screenWidth * 0.12, 60), // 12% of screen width, max 60
    controlButtonSpacing: screenWidth * 0.1, // 10% of screen width
    
    // Navigation bar height responsive to screen size
    navbarHeight: Math.max(screenHeight * 0.1, 80), // 10% of screen height, min 80
    
    // Header height with safe area consideration
    headerHeight: Math.max(60 + insets.top, 80), // Base height + status bar, min 80
  }), [screenWidth, screenHeight, insets.top]);
  
  // Create animation reference arrays for all cards
  // Each card gets its own set of animation values for translateX, rotate, opacity, and scale
  const cardAnimations = useRef(
    AFFIRMATION_CARDS.map(() => createCardAnimationRefs())
  ).current;

  // Track current card order for navigation
  const cardOrder = useRef([...Array(AFFIRMATION_CARDS.length).keys()]).current;

  // State for tracking animation in progress to control button active/inactive state
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for tracking current cycle position to ensure seamless transitions
  const [currentCycle, setCurrentCycle] = useState(0);
  
  // Ref to track if component is mounted for cleanup
  const isMounted = useRef(true);
  
  // Memoize animation configuration to prevent unnecessary recalculations
  const ANIMATION_CONFIG = useMemo(() => createAnimationConfig(screenWidth), [screenWidth]);

  // Initialize card positions on component mount
  useEffect(() => {
    // Set initial positions for all cards based on their stack position
    AFFIRMATION_CARDS.forEach((_, index) => {
      const initialPosition = getInitialCardPosition(index, ANIMATION_CONFIG);
      setAnimationValues(cardAnimations[index], initialPosition);
    });
  }, [ANIMATION_CONFIG, cardAnimations]);

  // Cleanup effect for animation state management and performance optimization
  useEffect(() => {
    return () => {
      // Mark component as unmounted
      isMounted.current = false;
      
      // Stop any ongoing animations to prevent memory leaks and improve performance
      cardAnimations.forEach((cardAnimation) => {
        // Stop all animation values and clear listeners
        cardAnimation.translateX.stopAnimation();
        cardAnimation.rotate.stopAnimation();
        cardAnimation.opacity.stopAnimation();
        cardAnimation.scale.stopAnimation();
        
        // Remove any listeners to prevent memory leaks
        cardAnimation.translateX.removeAllListeners();
        cardAnimation.rotate.removeAllListeners();
        cardAnimation.opacity.removeAllListeners();
        cardAnimation.scale.removeAllListeners();
      });
    };
  }, [cardAnimations]);

  // Validation effect to ensure animation cycle integrity
  useEffect(() => {
    // Validate animation cycle on every cycle change
    const isValid = validateAnimationCycle(cardOrder, cardAnimations, ANIMATION_CONFIG);
    if (!isValid && isMounted.current) {
      // Reset to initial state if validation fails
      resetAnimationCycle();
    }
  }, [currentCycle, cardAnimations, ANIMATION_CONFIG]);

  /**
   * Reset animation cycle to initial state
   * Used for recovery from invalid states and cleanup
   * Memoized for performance optimization
   */
  const resetAnimationCycle = useCallback(() => {
    // Stop any ongoing animations
    cardAnimations.forEach((cardAnimation) => {
      cardAnimation.translateX.stopAnimation();
      cardAnimation.rotate.stopAnimation();
      cardAnimation.opacity.stopAnimation();
      cardAnimation.scale.stopAnimation();
    });
    
    // Reset card order to initial state
    cardOrder.splice(0, cardOrder.length, ...Array(AFFIRMATION_CARDS.length).keys());
    
    // Reset all card positions to initial stack arrangement
    AFFIRMATION_CARDS.forEach((_, index) => {
      const initialPosition = getInitialCardPosition(index, ANIMATION_CONFIG);
      setAnimationValues(cardAnimations[index], initialPosition);
    });
    
    // Reset cycle counter and animation state
    setCurrentCycle(0);
    setIsAnimating(false);
  }, [cardAnimations, ANIMATION_CONFIG]);

  /**
   * Handle forward navigation animation (Requirements 2.1, 2.2, 2.3, 2.4, 2.5)
   * Animates the front card moving left off-screen and all other cards to new positions
   * Ensures seamless cycling through all 4 positions
   * Optimized with useNativeDriver for better performance
   */
  const handleNext = useCallback(() => {
    // Prevent multiple animations from running simultaneously (Requirement 2.6)
    if (isAnimating || !isMounted.current) return;
    
    setIsAnimating(true);
    
    // Get current front card index
    const frontCardIndex = cardOrder[0];
    
    // Create animation array for all cards
    const animations = [];

    // Animate front card sliding left off-screen (Requirement 2.1)
    // Use useNativeDriver: true for transform animations for better performance
    animations.push(
      Animated.timing(cardAnimations[frontCardIndex].translateX, {
        toValue: ANIMATION_CONFIG.offScreenLeft, // Move left off-screen (responsive)
        duration: ANIMATION_CONFIG.duration, // 800ms duration
        easing: ANIMATION_CONFIG.easing, // Smooth cubic easing
        useNativeDriver: true, // Enable native driver for better performance
      })
    );

    // Animate all other cards to their new positions (Requirements 2.2, 2.3, 2.4)
    cardOrder.forEach((cardIndex, position) => {
      if (position === 0) return; // Skip front card (already animated above)
      
      // Calculate new position (move one position forward)
      const newPosition = position - 1;
      const newPositionConfig = getInitialCardPosition(newPosition, ANIMATION_CONFIG);
      
      // Animate to new position with native driver for transforms
      animations.push(
        Animated.parallel([
          Animated.timing(cardAnimations[cardIndex].translateX, {
            toValue: newPositionConfig.translateX,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
          Animated.timing(cardAnimations[cardIndex].rotate, {
            toValue: newPositionConfig.rotate,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
          Animated.timing(cardAnimations[cardIndex].opacity, {
            toValue: newPositionConfig.opacity,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for opacity
          }),
          Animated.timing(cardAnimations[cardIndex].scale, {
            toValue: newPositionConfig.scale,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
        ])
      );
    });

    // Run all animations in parallel
    Animated.parallel(animations).start((finished) => {
      // Only proceed if animation completed successfully and component is still mounted
      if (!finished || !isMounted.current) {
        setIsAnimating(false);
        return;
      }
      
      // After animation completes, reorder the card array (Requirement 2.5)
      // Move the front card to the back position
      const frontCard = cardOrder.shift();
      cardOrder.push(frontCard);
      
      // Reset the front card (now at back) to hidden position for seamless cycling
      const backPosition = getInitialCardPosition(AFFIRMATION_CARDS.length - 1, ANIMATION_CONFIG);
      setAnimationValues(cardAnimations[frontCard], backPosition);
      
      // Update cycle counter for seamless transition tracking
      setCurrentCycle((prev) => (prev + 1) % AFFIRMATION_CARDS.length);
      
      // Re-enable navigation controls
      setIsAnimating(false);
    });
  }, [isAnimating, cardOrder, cardAnimations, ANIMATION_CONFIG, currentCycle]);

  /**
   * Handle backward navigation animation (Requirements 3.1, 3.2, 3.3, 3.4, 3.5)
   * Brings the back card from off-screen left into the front position
   * Ensures seamless cycling through all 4 positions
   * Optimized with useNativeDriver for better performance
   */
  const handlePrev = useCallback(() => {
    // Prevent multiple animations from running simultaneously (Requirement 3.1)
    if (isAnimating || !isMounted.current) return;
    
    setIsAnimating(true);
    
    // Get current back card index (last card in the order)
    const backCardIndex = cardOrder[cardOrder.length - 1];
    
    // Reorder cards first - move back card to front (Requirement 3.1)
    const backCard = cardOrder.pop();
    cardOrder.unshift(backCard);
    
    // Set up off-screen positioning for the new front card (Requirement 3.3)
    // Position the card at off-screen left (responsive)
    setAnimationValues(cardAnimations[backCardIndex], {
      translateX: ANIMATION_CONFIG.offScreenLeft, // Off-screen left position (responsive)
      rotate: 0,
      opacity: 1,
      scale: 1,
    });
    
    // Create animation array for all cards
    const animations = [];
    
    // Animate the new front card sliding in from left (Requirements 3.1, 3.2, 3.3)
    const frontPosition = getInitialCardPosition(0, ANIMATION_CONFIG); // Front card position
    animations.push(
      Animated.parallel([
        Animated.timing(cardAnimations[backCardIndex].translateX, {
          toValue: frontPosition.translateX, // Move to center position
          duration: ANIMATION_CONFIG.duration, // 800ms duration (Requirement 3.2)
          easing: ANIMATION_CONFIG.easing, // Smooth cubic easing
          useNativeDriver: true, // Enable native driver for better performance
        }),
        Animated.timing(cardAnimations[backCardIndex].rotate, {
          toValue: frontPosition.rotate,
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          useNativeDriver: true, // Enable native driver for transform
        }),
        Animated.timing(cardAnimations[backCardIndex].opacity, {
          toValue: frontPosition.opacity,
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          useNativeDriver: true, // Enable native driver for opacity
        }),
        Animated.timing(cardAnimations[backCardIndex].scale, {
          toValue: frontPosition.scale,
          duration: ANIMATION_CONFIG.duration,
          easing: ANIMATION_CONFIG.easing,
          useNativeDriver: true, // Enable native driver for transform
        }),
      ])
    );
    
    // Animate all other cards to their new positions (Requirement 3.4)
    cardOrder.forEach((cardIndex, position) => {
      if (position === 0) return; // Skip the new front card (already animated above)
      
      // Calculate new position (move one position back)
      const newPosition = position;
      const newPositionConfig = getInitialCardPosition(newPosition, ANIMATION_CONFIG);
      
      // Animate to new position with native driver for transforms
      animations.push(
        Animated.parallel([
          Animated.timing(cardAnimations[cardIndex].translateX, {
            toValue: newPositionConfig.translateX,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
          Animated.timing(cardAnimations[cardIndex].rotate, {
            toValue: newPositionConfig.rotate,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
          Animated.timing(cardAnimations[cardIndex].opacity, {
            toValue: newPositionConfig.opacity,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for opacity
          }),
          Animated.timing(cardAnimations[cardIndex].scale, {
            toValue: newPositionConfig.scale,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true, // Enable native driver for transform
          }),
        ])
      );
    });
    
    // Run all animations in parallel
    Animated.parallel(animations).start((finished) => {
      // Only proceed if animation completed successfully and component is still mounted
      if (!finished || !isMounted.current) {
        setIsAnimating(false);
        return;
      }
      
      // Animation complete - positions are already properly set (Requirement 3.5)
      // The card positions now match the standard stacking arrangement
      
      // Update cycle counter for seamless transition tracking (backward direction)
      setCurrentCycle((prev) => (prev - 1 + AFFIRMATION_CARDS.length) % AFFIRMATION_CARDS.length);
      
      // Re-enable navigation controls
      setIsAnimating(false);
    });
  }, [isAnimating, cardOrder, cardAnimations, ANIMATION_CONFIG, currentCycle]);

  // Create responsive styles based on calculated dimensions - memoized for performance
  const responsiveStyles = useMemo(() => createResponsiveStyles(responsiveDimensions, insets), [responsiveDimensions, insets]);

  return (
    <SafeAreaView style={[styles.container, responsiveStyles.container]}>
      {/* Main background gradient */}
      <LinearGradient
        colors={COLORS.backgroundGradient}
        style={styles.backgroundGradient}
      >
        {/* Header section with back button and title */}
        <View style={[styles.header, responsiveStyles.header]}>
          <TouchableOpacity style={styles.backButton}>
            {/* Back icon will be added in later tasks */}
            <View style={styles.backIconPlaceholder} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Affirmations</Text>
        </View>

        {/* Center area container for card stack */}
        <View style={[styles.centerContainer, responsiveStyles.centerContainer]}>
          <View style={[styles.cardStackContainer, responsiveStyles.cardStackContainer]}>
            {/* Render cards in reverse order for proper z-index stacking */}
            {/* Reverse the card order so the front card renders last and appears on top */}
            {[...cardOrder].reverse().map((cardIndex) => {
              const card = AFFIRMATION_CARDS[cardIndex];
              const cardAnimation = cardAnimations[cardIndex];
              
              // Calculate z-index based on position in stack (front card has highest z-index)
              const stackPosition = cardOrder.indexOf(cardIndex);
              const zIndex = AFFIRMATION_CARDS.length - stackPosition;
              
              // Create animated style transforms
              const animatedStyle = {
                transform: [
                  {
                    translateX: cardAnimation.translateX,
                  },
                  {
                    rotate: cardAnimation.rotate.interpolate({
                      inputRange: [-360, 360],
                      outputRange: ['-360deg', '360deg'],
                      extrapolate: 'clamp',
                    }),
                  },
                  {
                    scale: cardAnimation.scale,
                  },
                ],
                opacity: cardAnimation.opacity,
                zIndex: zIndex, // Ensure proper layering based on stack position
              };
              
              return (
                <Animated.View
                  key={card.id}
                  style={[styles.stackedCard, responsiveStyles.stackedCard, animatedStyle]}
                >
                  <AffirmationCard card={card} dimensions={responsiveDimensions} />
                </Animated.View>
              );
            })}
          </View>

          {/* Navigation controls - Left and Right arrow buttons (Requirements 2.6, 3.1) */}
          <View style={[styles.navigationControls, responsiveStyles.navigationControls]} testID="navigation-controls">
            {/* Left arrow button for backward navigation with glass morphism */}
            <TouchableOpacity 
              style={[
                styles.controlButton,
                responsiveStyles.controlButton,
                styles.leftControlButton,
                isAnimating && styles.controlButtonDisabled
              ]}
              onPress={handlePrev}
              disabled={isAnimating}
              activeOpacity={isAnimating ? 1 : 0.7}
              testID="left-control-button"
              accessibilityRole="button"
              accessibilityLabel="Previous card"
              accessibilityHint="Navigate to the previous affirmation card"
            >
              <BlurView 
                intensity={GLASS_EFFECTS?.blurConfig?.controlButton?.intensity || 15}
                tint={GLASS_EFFECTS?.blurConfig?.controlButton?.tint || 'light'}
                style={styles.controlButtonBlur}
              >
                <View style={styles.controlButtonOverlay}>
                  <Image 
                    source={isAnimating ? ICON_PATHS.moveInactive : ICON_PATHS.moveActive}
                    style={[styles.controlIcon, styles.leftArrowIcon]}
                    resizeMode="contain"
                    testID="left-arrow-icon"
                  />
                </View>
              </BlurView>
            </TouchableOpacity>

            {/* Right arrow button for forward navigation with glass morphism */}
            <TouchableOpacity 
              style={[
                styles.controlButton,
                responsiveStyles.controlButton,
                styles.rightControlButton,
                isAnimating && styles.controlButtonDisabled
              ]}
              onPress={handleNext}
              disabled={isAnimating}
              activeOpacity={isAnimating ? 1 : 0.7}
              testID="right-control-button"
              accessibilityRole="button"
              accessibilityLabel="Next card"
              accessibilityHint="Navigate to the next affirmation card"
            >
              <BlurView 
                intensity={GLASS_EFFECTS?.blurConfig?.controlButton?.intensity || 15}
                tint={GLASS_EFFECTS?.blurConfig?.controlButton?.tint || 'light'}
                style={styles.controlButtonBlur}
              >
                <View style={styles.controlButtonOverlay}>
                  <Image 
                    source={isAnimating ? ICON_PATHS.moveInactive : ICON_PATHS.moveActive}
                    style={[styles.controlIcon, styles.rightArrowIcon]}
                    resizeMode="contain"
                    testID="right-arrow-icon"
                  />
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom navigation bar with enhanced glass effect */}
        <View style={[styles.navigationContainer, responsiveStyles.navigationContainer]}>
          <BlurView 
            intensity={GLASS_EFFECTS?.blurConfig?.navbar?.intensity || 25} 
            tint={GLASS_EFFECTS?.blurConfig?.navbar?.tint || 'light'}
            style={[styles.navigationBar, responsiveStyles.navigationBar]}
          >
            {/* Additional glass morphism overlay */}
            <View style={styles.glassOverlay}>
              <View style={styles.navigationContent}>
                {/* Navigation icons */}
                <TouchableOpacity style={styles.navItem}>
                  <View style={styles.navIconPlaceholder} />
                  <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                  <View style={styles.navIconPlaceholder} />
                  <Text style={styles.navLabel}>Zenbloom</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                  <View style={styles.navIconPlaceholder} />
                  <Text style={styles.navLabel}>Chatbot</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                  <View style={styles.navIconPlaceholder} />
                  <Text style={styles.navLabel}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                  <View style={styles.navIconPlaceholder} />
                  <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: 10,
    height: SPACING.headerHeight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.iconPrimary,
    borderRadius: 4,
  },
  headerTitle: {
    fontFamily: FONTS.primary,
    fontSize: FONTS.sizeTitle,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  // Center container styles
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
  },
  cardStackContainer: {
    width: SPACING.cardWidth,
    height: SPACING.cardHeight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stackedCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SPACING.cardWidth,
    height: SPACING.cardHeight,
  },
  // Navigation bar styles with enhanced glass morphism
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navigationBar: {
    ...GLASS_EFFECTS.navbar,
    height: SPACING.navbarHeight,
    justifyContent: 'center',
  },
  glassOverlay: {
    flex: 1,
    backgroundColor: GLASS_EFFECTS.navbar.overlayColor,
    borderRadius: GLASS_EFFECTS.navbar.borderRadius,
    justifyContent: 'center',
  },
  navigationContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.iconPrimary,
    borderRadius: 4,
    marginBottom: 4,
  },
  navLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizeNavbar,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  // Navigation controls styles (Requirements 2.6, 3.1)
  navigationControls: {
    position: 'absolute',
    bottom: -100, // Position below the card stack
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.controlButtonSpacing,
  },
  controlButton: {
    width: SPACING.controlButtonSize,
    height: SPACING.controlButtonSize,
    borderRadius: SPACING.controlButtonSize / 2,
    ...GLASS_EFFECTS.controlButton,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensure blur effect stays within bounds
  },
  controlButtonBlur: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: SPACING.controlButtonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonOverlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GLASS_EFFECTS?.controlButton?.overlayColor || 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.controlButtonSize / 2,
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  leftControlButton: {
    // Additional styling for left button if needed
  },
  rightControlButton: {
    // Additional styling for right button if needed
  },
  controlIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.textPrimary,
  },
  leftArrowIcon: {
    transform: [{ rotate: '180deg' }], // Rotate the move icon to point left
  },
  rightArrowIcon: {
    // No rotation needed for right arrow
  },
});

export default AffirmationScreen;