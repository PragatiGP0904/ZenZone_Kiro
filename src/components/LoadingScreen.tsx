import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, ImageBackground } from 'react-native';
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

interface LoadingScreenProps {
  onComplete: () => void;
}

const { width, height } = Dimensions.get('window');

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  console.log('☁️ Loading screen rendering with cloud and textt...');

  // Animation values - logo is static, cloud and textt animate together
  const cloudOpacity = useSharedValue(0);
  const cloudTranslateY = useSharedValue(30);
  const texttOpacity = useSharedValue(0);
  const texttTranslateY = useSharedValue(30);
  
  // Floating elements animations - same as splash screen
  const bubble1Opacity = useSharedValue(0.6);
  const bubble1Y = useSharedValue(0);
  const polygon3Rotate = useSharedValue(0);
  const polygon3Opacity = useSharedValue(0.7);
  const polygon4Scale = useSharedValue(1);
  const polygon4Opacity = useSharedValue(0.8);

  useEffect(() => {
    // Cloud and textt fade-in together (textt is inside cloud)
    cloudOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
        easing: Easing.ease,
      })
    );
    
    cloudTranslateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 800,
        easing: Easing.ease,
      })
    );

    // Textt fades in with cloud (same timing)
    texttOpacity.value = withDelay(
      500,
      withTiming(1, {
        duration: 800,
        easing: Easing.ease,
      })
    );
    
    texttTranslateY.value = withDelay(
      500,
      withTiming(0, {
        duration: 800,
        easing: Easing.ease,
      })
    );

    // Floating bubble animation - same as splash
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

    // Polygon3 rotation and shimmer - same as splash
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

    // Polygon4 scale and shimmer - same as splash
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

    // Auto-navigate to next screen after 3 seconds
    const timer = setTimeout(() => {
      console.log('⏰ Loading complete - moving to next screen...');
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Animated styles
  const cloudAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cloudOpacity.value,
    transform: [{ translateY: cloudTranslateY.value }],
  }));

  const texttAnimatedStyle = useAnimatedStyle(() => ({
    opacity: texttOpacity.value,
    transform: [{ translateY: texttTranslateY.value }],
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

  return (
    <View style={styles.container}>
      {/* Same background as splash screen */}
      <ImageBackground 
        source={ASSETS.splash} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Same floating decorative elements as splash screen */}
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

        {/* Logo in left corner - small and static */}
        <View style={styles.logoCorner}>
          <Animated.Image
            source={ASSETS.logo}
            style={styles.logoSmall}
            resizeMode="contain"
          />
        </View>

        {/* Main content - cloud with textt inside */}
        <View style={styles.content}>
          {/* Cloud container with textt inside */}
          <View style={styles.cloudContainer}>
            <Animated.Image
              source={ASSETS.cloud}
              style={[styles.cloud, cloudAnimatedStyle]}
              resizeMode="contain"
            />
            
            {/* Textt positioned inside the cloud */}
            <Animated.Image
              source={ASSETS.textt}
              style={[styles.textt, texttAnimatedStyle]}
              resizeMode="contain"
            />
          </View>
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
  // Same floating elements positioning as splash screen
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
  // Logo in left corner
  logoCorner: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 3,
  },
  logoSmall: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 2,
  },
  // Cloud container to position textt inside cloud
  cloudContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Cloud styling - larger to contain textt
  cloud: {
    width: width * 0.7,
    height: width * 0.5,
    maxWidth: 350,
    maxHeight: 250,
  },
  // Textt styling - positioned inside cloud
  textt: {
    position: 'absolute',
    width: width * 0.5,
    height: 60,
    maxWidth: 250,
  },
});

export default LoadingScreen;