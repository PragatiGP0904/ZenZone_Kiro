import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  Text,
  Alert,
  ImageBackground 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ASSETS } from '../constants/assets';

interface SignInScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

const { width, height } = Dimensions.get('window');

const SignInScreen: React.FC<SignInScreenProps> = ({ onSignIn, onSignUp }) => {
  console.log('🔐 SignIn screen rendering...');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Animation values for floating and twinkling effects
  const fullcloud1Y = useSharedValue(0);
  const fullcloud2Y = useSharedValue(0);
  const fullcloud3Y = useSharedValue(0);
  const fullcloud4Y = useSharedValue(0);
  const fullcloud5Y = useSharedValue(0);
  
  // 15 stars with different opacity values for twinkling (foreground)
  const star1Opacity = useSharedValue(0.3);
  const star2Opacity = useSharedValue(0.5);
  const star3Opacity = useSharedValue(0.4);
  const star4Opacity = useSharedValue(0.6);
  const star5Opacity = useSharedValue(0.2);
  const star6Opacity = useSharedValue(0.7);
  const star7Opacity = useSharedValue(0.4);
  const star8Opacity = useSharedValue(0.5);
  const star9Opacity = useSharedValue(0.3);
  const star10Opacity = useSharedValue(0.6);
  const star11Opacity = useSharedValue(0.4);
  const star12Opacity = useSharedValue(0.5);
  const star13Opacity = useSharedValue(0.3);
  const star14Opacity = useSharedValue(0.7);
  const star15Opacity = useSharedValue(0.4);

  // Additional 10 stars behind gradient (background stars)
  const bgStar1Opacity = useSharedValue(0.2);
  const bgStar2Opacity = useSharedValue(0.3);
  const bgStar3Opacity = useSharedValue(0.25);
  const bgStar4Opacity = useSharedValue(0.35);
  const bgStar5Opacity = useSharedValue(0.15);
  const bgStar6Opacity = useSharedValue(0.4);
  const bgStar7Opacity = useSharedValue(0.2);
  const bgStar8Opacity = useSharedValue(0.3);
  const bgStar9Opacity = useSharedValue(0.25);
  const bgStar10Opacity = useSharedValue(0.35);

  useEffect(() => {
    // Floating clouds animation with different speeds
    fullcloud1Y.value = withRepeat(
      withTiming(20, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    fullcloud2Y.value = withRepeat(
      withTiming(-15, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    fullcloud3Y.value = withRepeat(
      withTiming(25, {
        duration: 5000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    fullcloud4Y.value = withRepeat(
      withTiming(-20, {
        duration: 4500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    fullcloud5Y.value = withRepeat(
      withTiming(18, {
        duration: 3800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Twinkling stars animation - 15 foreground stars with different durations for natural effect
    star1Opacity.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    star2Opacity.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    star3Opacity.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
    star4Opacity.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
    star5Opacity.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
    star6Opacity.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true);
    star7Opacity.value = withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true);
    star8Opacity.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.ease) }), -1, true);
    star9Opacity.value = withRepeat(withTiming(1, { duration: 2100, easing: Easing.inOut(Easing.ease) }), -1, true);
    star10Opacity.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    star11Opacity.value = withRepeat(withTiming(1, { duration: 2300, easing: Easing.inOut(Easing.ease) }), -1, true);
    star12Opacity.value = withRepeat(withTiming(1, { duration: 1750, easing: Easing.inOut(Easing.ease) }), -1, true);
    star13Opacity.value = withRepeat(withTiming(1, { duration: 2050, easing: Easing.inOut(Easing.ease) }), -1, true);
    star14Opacity.value = withRepeat(withTiming(1, { duration: 1650, easing: Easing.inOut(Easing.ease) }), -1, true);
    star15Opacity.value = withRepeat(withTiming(1, { duration: 2250, easing: Easing.inOut(Easing.ease) }), -1, true);

    // Background stars animation - 10 additional stars behind gradient (slower, more subtle)
    bgStar1Opacity.value = withRepeat(withTiming(0.6, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar2Opacity.value = withRepeat(withTiming(0.7, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar3Opacity.value = withRepeat(withTiming(0.5, { duration: 2800, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar4Opacity.value = withRepeat(withTiming(0.8, { duration: 3200, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar5Opacity.value = withRepeat(withTiming(0.4, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar6Opacity.value = withRepeat(withTiming(0.9, { duration: 3400, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar7Opacity.value = withRepeat(withTiming(0.5, { duration: 2700, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar8Opacity.value = withRepeat(withTiming(0.7, { duration: 2900, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar9Opacity.value = withRepeat(withTiming(0.6, { duration: 3100, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar10Opacity.value = withRepeat(withTiming(0.8, { duration: 2750, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  // Animated styles
  const fullcloud1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fullcloud1Y.value }],
  }));

  const fullcloud2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fullcloud2Y.value }],
  }));

  const fullcloud3AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fullcloud3Y.value }],
  }));

  const fullcloud4AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fullcloud4Y.value }],
  }));

  const fullcloud5AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: fullcloud5Y.value }],
  }));

  const star1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star1Opacity.value,
  }));

  const star2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star2Opacity.value,
  }));

  const star3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star3Opacity.value,
  }));

  const star4AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star4Opacity.value,
  }));

  const star5AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star5Opacity.value,
  }));

  const star6AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star6Opacity.value,
  }));

  const star7AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star7Opacity.value,
  }));

  const star8AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star8Opacity.value,
  }));

  const star9AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star9Opacity.value,
  }));

  const star10AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star10Opacity.value,
  }));

  const star11AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star11Opacity.value,
  }));

  const star12AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star12Opacity.value,
  }));

  const star13AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star13Opacity.value,
  }));

  const star14AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star14Opacity.value,
  }));

  const star15AnimatedStyle = useAnimatedStyle(() => ({
    opacity: star15Opacity.value,
  }));

  // Background stars animated styles
  const bgStar1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar1Opacity.value,
  }));

  const bgStar2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar2Opacity.value,
  }));

  const bgStar3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar3Opacity.value,
  }));

  const bgStar4AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar4Opacity.value,
  }));

  const bgStar5AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar5Opacity.value,
  }));

  const bgStar6AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar6Opacity.value,
  }));

  const bgStar7AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar7Opacity.value,
  }));

  const bgStar8AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar8Opacity.value,
  }));

  const bgStar9AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar9Opacity.value,
  }));

  const bgStar10AnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgStar10Opacity.value,
  }));

  const handleSignIn = () => {
    if (username.trim() && password.trim()) {
      console.log('🎯 Sign in successful - navigating to home');
      onSignIn();
    } else {
      Alert.alert('Error', 'Please enter both username and password');
    }
  };

  const handleSignUp = () => {
    console.log('📝 Navigating to sign up page');
    onSignUp();
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#87CEEB', '#B0E0E6', '#E0F6FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Moon in top right */}
        <Animated.Image
          source={ASSETS.moon}
          style={styles.moon}
          resizeMode="contain"
        />





        {/* Layer 3: Multiple blurred fullclouds behind gradient with varying sizes */}
        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloudBlurred1, fullcloud2AnimatedStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloudBlurred2, fullcloud3AnimatedStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloudBlurred3, fullcloud4AnimatedStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloudBlurred4, fullcloud5AnimatedStyle]}
          resizeMode="contain"
        />

        {/* Layer 3.5: Background stars behind gradient */}
        <Animated.Image source={ASSETS.star} style={[styles.bgStar1, bgStar1AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar2, bgStar2AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar3, bgStar3AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar4, bgStar4AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar5, bgStar5AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar6, bgStar6AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar7, bgStar7AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar8, bgStar8AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar9, bgStar9AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar10, bgStar10AnimatedStyle]} resizeMode="contain" />

        {/* Layer 4: Main content area with gradient background */}
        <View style={styles.contentContainer}>
          <ImageBackground
            source={ASSETS.gradient}
            style={styles.gradientBackground}
            resizeMode="stretch"
          >
            {/* Welcome back text */}
            <Animated.Image
              source={ASSETS.welcomeback}
              style={styles.welcomeback}
              resizeMode="contain"
            />

            {/* Login form */}
            <View style={styles.formContainer}>
              {/* Username input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Username"
                  placeholderTextColor="#B0C4DE"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* Password input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#B0C4DE"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Login button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleSignIn}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot your password</Text>
              </TouchableOpacity>

              {/* Social login options under forgot password */}
              <Animated.Image
                source={ASSETS.options}
                style={styles.options}
                resizeMode="contain"
              />

              {/* Sign up link under options */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signUpLink}>sign up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* Layer 5: Floating clouds (above gradient) */}
        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloud1, fullcloud1AnimatedStyle]}
          resizeMode="contain"
        />

        <Animated.Image
          source={ASSETS.fullcloud}
          style={[styles.fullcloud2, fullcloud2AnimatedStyle]}
          resizeMode="contain"
        />

        {/* Layer 6: 15 Twinkling stars */}
        <Animated.Image source={ASSETS.star} style={[styles.star1, star1AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star2, star2AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star3, star3AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star4, star4AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star5, star5AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star6, star6AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star7, star7AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star8, star8AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star9, star9AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star10, star10AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star11, star11AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star12, star12AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star13, star13AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star14, star14AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star15, star15AnimatedStyle]} resizeMode="contain" />

        {/* Layer 7: Moon */}
        <Animated.Image
          source={ASSETS.moon}
          style={styles.moon}
          resizeMode="contain"
        />

        {/* Layer 8: ZenZonee logo (topmost) */}
        <View style={styles.zenzoneeContainer}>
          <Animated.Image
            source={ASSETS.zenzonee}
            style={styles.zenzonee}
            resizeMode="contain"
          />
        </View>

        {/* Mountain.png just above the blue box - temporarily commented out until mountain.png is added to assets */}
        {/* <Animated.Image
          source={ASSETS.mountain}
          style={styles.mountainAboveBlue}
          resizeMode="cover"
        /> */}

        {/* Blue color band at bottom of page */}
        <View style={styles.bottomBlueBox} />

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  // Mountain.png positioned just above the blue box
  mountainAboveBlue: {
    position: 'absolute',
    bottom: 258, // Just above the blue box (height 258)
    left: 0,
    right: 0,
    height: 150, // Adjust height as needed
    zIndex: 2, // Above the blue box but below other elements
  },

  // Blue color band at bottom of page
  bottomBlueBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 258,
    backgroundColor: '#6897E3',
    zIndex: 1, // Behind everything else
  },
  
  // Layer 3: Multiple blurred fullclouds behind gradient with varying sizes
  fullcloudBlurred1: {
    position: 'absolute',
    bottom: height * 0.35,
    right: -50,
    width: 200,
    height: 130,
    opacity: 0.25, // Blurred effect
    zIndex: 3,
  },
  fullcloudBlurred2: {
    position: 'absolute',
    bottom: height * 0.45,
    left: -40,
    width: 150,
    height: 100,
    opacity: 0.2, // More subtle
    zIndex: 3,
  },
  fullcloudBlurred3: {
    position: 'absolute',
    bottom: height * 0.55,
    right: width * 0.1,
    width: 180,
    height: 120,
    opacity: 0.15, // Very subtle
    zIndex: 3,
  },
  fullcloudBlurred4: {
    position: 'absolute',
    bottom: height * 0.25,
    left: width * 0.2,
    width: 120,
    height: 80,
    opacity: 0.3, // Slightly more visible
    zIndex: 3,
  },
  
  // Layer 5: Floating clouds (above gradient)
  fullcloud1: {
    position: 'absolute',
    top: 80,
    left: -20,
    width: 150,
    height: 100,
    opacity: 0.7,
    zIndex: 5,
  },
  fullcloud2: {
    position: 'absolute',
    bottom: 200,
    left: -30,
    width: 180,
    height: 120,
    opacity: 0.5,
    zIndex: 5,
  },
  // Layer 6: 15 Twinkling stars with varying sizes and positions
  star1: { position: 'absolute', top: 80, left: width * 0.15, width: 22, height: 22, zIndex: 6 },
  star2: { position: 'absolute', top: 120, right: width * 0.25, width: 18, height: 18, zIndex: 6 },
  star3: { position: 'absolute', top: 160, left: width * 0.1, width: 25, height: 25, zIndex: 6 },
  star4: { position: 'absolute', top: 100, left: width * 0.6, width: 20, height: 20, zIndex: 6 },
  star5: { position: 'absolute', top: 140, right: width * 0.1, width: 15, height: 15, zIndex: 6 },
  star6: { position: 'absolute', top: 200, left: width * 0.3, width: 28, height: 28, zIndex: 6 },
  star7: { position: 'absolute', top: 180, right: width * 0.4, width: 16, height: 16, zIndex: 6 },
  star8: { position: 'absolute', top: 220, left: width * 0.7, width: 19, height: 19, zIndex: 6 },
  star9: { position: 'absolute', top: 90, left: width * 0.4, width: 17, height: 17, zIndex: 6 },
  star10: { position: 'absolute', top: 130, left: width * 0.8, width: 21, height: 21, zIndex: 6 },
  star11: { position: 'absolute', top: 170, left: width * 0.05, width: 14, height: 14, zIndex: 6 },
  star12: { position: 'absolute', top: 210, right: width * 0.15, width: 23, height: 23, zIndex: 6 },
  star13: { position: 'absolute', top: 110, left: width * 0.5, width: 16, height: 16, zIndex: 6 },
  star14: { position: 'absolute', top: 190, left: width * 0.25, width: 26, height: 26, zIndex: 6 },
  star15: { position: 'absolute', top: 150, right: width * 0.05, width: 18, height: 18, zIndex: 6 },

  // Layer 3.5: Background stars behind gradient with varying sizes (smaller and more subtle)
  bgStar1: { position: 'absolute', top: height * 0.4, left: width * 0.1, width: 12, height: 12, zIndex: 3.5 },
  bgStar2: { position: 'absolute', top: height * 0.45, right: width * 0.15, width: 10, height: 10, zIndex: 3.5 },
  bgStar3: { position: 'absolute', top: height * 0.5, left: width * 0.3, width: 14, height: 14, zIndex: 3.5 },
  bgStar4: { position: 'absolute', top: height * 0.55, right: width * 0.25, width: 11, height: 11, zIndex: 3.5 },
  bgStar5: { position: 'absolute', top: height * 0.6, left: width * 0.05, width: 9, height: 9, zIndex: 3.5 },
  bgStar6: { position: 'absolute', top: height * 0.65, right: width * 0.35, width: 15, height: 15, zIndex: 3.5 },
  bgStar7: { position: 'absolute', top: height * 0.7, left: width * 0.2, width: 10, height: 10, zIndex: 3.5 },
  bgStar8: { position: 'absolute', top: height * 0.75, right: width * 0.1, width: 13, height: 13, zIndex: 3.5 },
  bgStar9: { position: 'absolute', top: height * 0.42, left: width * 0.6, width: 11, height: 11, zIndex: 3.5 },
  bgStar10: { position: 'absolute', top: height * 0.58, right: width * 0.45, width: 12, height: 12, zIndex: 3.5 },
  
  // Layer 7: Moon positioning - top right
  moon: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 120,
    height: 120,
    zIndex: 7,
  },
  
  // Layer 8: ZenZonee logo positioning - topmost
  zenzoneeContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 8, // Topmost layer
  },
  zenzonee: {
    width: 180,
    height: 60,
  },
  // Layer 4: Main content area - properly sized gradient container
  contentContainer: {
    position: 'absolute',
    top: height * 0.35, // Position in middle area
    left: width * 0.05, // Add side margins
    right: width * 0.05, // Add side margins
    height: height * 0.55, // Smaller, more compact height
    zIndex: 4,
    borderRadius: 25, // Rounded corners like in image
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  // Welcome back text
  welcomeback: {
    width: 180,
    height: 40,
    marginBottom: 25,
  },
  // Form container
  formContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  // Input styling
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
    color: '#4682B4',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#4A90E2',
  },
  // Login button
  loginButton: {
    backgroundColor: '#2C5282',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '70%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Forgot password
  forgotPassword: {
    marginBottom: 15,
  },
  forgotPasswordText: {
    color: '#1B212C',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '600', // Semibold
  },
  // Social options (positioned under forgot password)
  options: {
    width: 160,
    height: 40,
    marginBottom: 20,
    marginTop: 10,
  },
  // Sign up section (positioned under options)
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpText: {
    color: '#5A6C8F',
    fontSize: 13,
    fontFamily: 'Poppins',
  },
  signUpLink: {
    color: '#3C3C3C',
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
});

export default SignInScreen;