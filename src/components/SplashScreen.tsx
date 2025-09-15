import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withDelay, 
  withTiming, 
  withRepeat,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { ASSETS } from '../constants/assets';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  console.log('🚀 SplashScreen rendering with proper assets...');

  // Animation values
  const logoScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(50);
  
  // Floating elements animations
  const bubble1Opacity = useSharedValue(0.6);
  const bubble1Y = useSharedValue(0);
  const polygon3Rotate = useSharedValue(0);
  const polygon3Opacity = useSharedValue(0.7);
  const polygon4Scale = useSharedValue(1);
  const polygon4Opacity = useSharedValue(0.8);

  // Button animation
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    // Logo pop-out animation
    logoScale.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.back(1.7)),
      })
    );

    // Text fade-in and slide-up animation
    textOpacity.value = withDelay(
      1000,
      withTiming(1, {
        duration: 600,
        easing: Easing.ease,
      })
    );
    
    textTranslateY.value = withDelay(
      1000,
      withTiming(0, {
        duration: 600,
        easing: Easing.ease,
      })
    );

    // Floating bubble animation
    bubble1Y.value = withRepeat(
      withTiming(15, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    bubble1Opacity.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Polygon3 rotation and shimmer
    polygon3Rotate.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    polygon3Opacity.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Polygon4 scale and shimmer
    polygon4Scale.value = withRepeat(
      withTiming(1.2, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    polygon4Opacity.value = withRepeat(
      withTiming(1, {
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const bubble1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bubble1Opacity.value,
    transform: [{ translateY: bubble1Y.value }],
  }));

  const polygon3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: polygon3Opacity.value,
    transform: [{ rotate: `${polygon3Rotate.value}deg` }],
  }));

  const polygon4AnimatedStyle = useAnimatedStyle(() => ({
    opacity: polygon4Opacity.value,
    transform: [{ scale: polygon4Scale.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPress = () => {
    console.log('🎯 GET STARTED button pressed!');
    
    // Button press animation
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 }, () => {
        runOnJS(onGetStarted)();
      });
    });
  };

  return (
    <View style={styles.container}>
      {/* Background using splash.png */}
      <ImageBackground 
        source={ASSETS.splash} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Floating decorative elements */}
        <View style={styles.floatingElements}>
          {/* Bubble floating animation */}
          <Animated.Image
            source={ASSETS.bubble}
            style={[styles.bubble, bubble1AnimatedStyle]}
            resizeMode="contain"
          />
          
          {/* Polygon3 with rotation and shimmer */}
          <Animated.Image
            source={ASSETS.polygon3}
            style={[styles.polygon3, polygon3AnimatedStyle]}
            resizeMode="contain"
          />
          
          {/* Polygon4 with scale and shimmer */}
          <Animated.Image
            source={ASSETS.polygon4}
            style={[styles.polygon4, polygon4AnimatedStyle]}
            resizeMode="contain"
          />
        </View>

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo with pop-out animation */}
          <Animated.Image
            source={ASSETS.logo}
            style={[styles.logo, logoAnimatedStyle]}
            resizeMode="contain"
          />

          {/* Text with fade-in animation */}
          <Animated.Image
            source={ASSETS.text}
            style={[styles.text, textAnimatedStyle]}
            resizeMode="contain"
          />

          {/* GET STARTED Button with blue gradient */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={handleButtonPress}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
              accessibilityHint="Tap to begin using ZenZone"
            >
              <LinearGradient
                colors={['#4A90E2', '#7BB3F0', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>GET STARTED</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  bubble: {
    position: 'absolute',
    top: height * 0.15,
    right: width * 0.1,
    width: 60,
    height: 60,
  },
  polygon3: {
    position: 'absolute',
    top: height * 0.25,
    left: width * 0.05,
    width: 80,
    height: 80,
  },
  polygon4: {
    position: 'absolute',
    bottom: height * 0.3,
    right: width * 0.08,
    width: 70,
    height: 70,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 2,
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 20,
  },
  text: {
    width: width * 0.8,
    height: 60,
    maxWidth: 400,
    marginBottom: 60,
  },
  buttonContainer: {
    marginTop: 40,
  },
  buttonTouchable: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingHorizontal: 50,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default SplashScreen;