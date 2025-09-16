import React, { memo, useMemo } from 'react';
import { View, StyleSheet, Text, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Import theme configuration
import { SPACING, FONTS, GLASS_EFFECTS } from '../../constants/theme';

/**
 * Create responsive styles for the card based on dimensions
 * Ensures proper sizing on different screen sizes
 */
const createCardResponsiveStyles = (dimensions) => ({
  cardContainer: {
    width: dimensions.cardWidth,
    height: dimensions.cardHeight,
    borderRadius: Math.min(dimensions.cardWidth * 0.07, 20), // Responsive border radius
  },
  iconContainer: {
    marginTop: dimensions.cardHeight * 0.05, // 5% of card height
  },
  cardIcon: {
    width: Math.min(dimensions.cardWidth * 0.15, 50), // 15% of card width, max 50
    height: Math.min(dimensions.cardWidth * 0.15, 50),
  },
  textContainer: {
    paddingHorizontal: dimensions.cardWidth * 0.07, // 7% of card width
    marginBottom: dimensions.cardHeight * 0.05, // 5% of card height
  },
  textGradientBackground: {
    borderRadius: Math.min(dimensions.cardWidth * 0.04, 12), // Responsive border radius
    paddingHorizontal: dimensions.cardWidth * 0.05, // 5% of card width
    paddingVertical: dimensions.cardHeight * 0.025, // 2.5% of card height
  },
  affirmationText: {
    fontSize: Math.min(dimensions.cardWidth * 0.1, 28), // 10% of card width, max 28
    lineHeight: Math.min(dimensions.cardWidth * 0.12, 34), // Responsive line height
  },
});

/**
 * AffirmationCard Component
 * Renders an individual affirmation card with glass effect, background image, icon, and gradient text
 * Optimized with React.memo and useMemo for better performance
 * 
 * Props:
 * - card: Card data object containing backgroundImage, icon, gradient, textGradient, affirmationText
 * - style: Additional styles to apply to the card container
 * - dimensions: Responsive dimensions object for proper sizing
 */
const AffirmationCard = memo(({ card, style, dimensions }) => {
  if (!card) {
    return null;
  }

  // Memoize responsive styles to prevent unnecessary recalculations
  const responsiveStyles = useMemo(() => {
    return dimensions ? createCardResponsiveStyles(dimensions) : {};
  }, [dimensions]);

  return (
    <View style={[styles.cardContainer, responsiveStyles.cardContainer, style]}>
      {/* Card background with image and gradient overlay */}
      <ImageBackground
        source={card.backgroundImage}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        {/* Gradient overlay for better text readability */}
        <LinearGradient
          colors={[...card.gradient, 'rgba(255, 255, 255, 0.1)']}
          style={styles.gradientOverlay}
        >
          {/* Card content with solid gradient - no glass effects */}
          <View style={styles.cardContent}>
            {/* Card icon */}
            <View style={[styles.iconContainer, responsiveStyles.iconContainer]}>
              <Image
                source={card.icon}
                style={[styles.cardIcon, responsiveStyles.cardIcon]}
                resizeMode="contain"
              />
            </View>

            {/* Affirmation text with gradient background */}
            <View style={[styles.textContainer, responsiveStyles.textContainer]}>
              <LinearGradient
                colors={card.textGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.textGradientBackground, responsiveStyles.textGradientBackground]}
              >
                <Text style={[styles.affirmationText, responsiveStyles.affirmationText]}>
                  {card.affirmationText}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    width: SPACING.cardWidth,
    height: SPACING.cardHeight,
    borderRadius: SPACING.cardBorderRadius,
    overflow: 'hidden',
    ...GLASS_EFFECTS.card,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundImageStyle: {
    borderRadius: SPACING.cardBorderRadius,
    opacity: 0.7, // Proper opacity for background image as specified
  },
  gradientOverlay: {
    flex: 1,
    borderRadius: SPACING.cardBorderRadius,
  },

  cardContent: {
    flex: 1,
    padding: SPACING.cardPadding,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    width: 40,
    height: 40,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  textGradientBackground: {
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    opacity: 0.8,
  },
  affirmationText: {
    fontFamily: FONTS.card, // Caveat-Bold font as specified
    fontSize: FONTS.sizeAffirmation, // 28px size as specified
    textAlign: 'center',
    lineHeight: 34,
    color: '#FFFFFF', // White text for better contrast against gradient background
    fontWeight: 'bold',
  },
});

// Add display name for debugging
AffirmationCard.displayName = 'AffirmationCard';

export default AffirmationCard;