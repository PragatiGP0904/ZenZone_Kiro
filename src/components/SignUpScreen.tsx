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

interface SignUpScreenProps {
  onSignUp: () => void;
  onBackToSignIn: () => void;
}

const { width, height } = Dimensions.get('window');

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUp, onBackToSignIn }) => {
  console.log('📝 SignUp screen rendering...');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animation values for floating clouds - more clouds for better atmosphere
  const fullcloud1Y = useSharedValue(0);
  const fullcloud2Y = useSharedValue(0);
  const fullcloud3Y = useSharedValue(0);
  const fullcloud4Y = useSharedValue(0);
  const fullcloud5Y = useSharedValue(0);
  const fullcloud6Y = useSharedValue(0);
  const fullcloud7Y = useSharedValue(0);
  const fullcloud8Y = useSharedValue(0);
  const fullcloud9Y = useSharedValue(0);
  const fullcloud10Y = useSharedValue(0);
  
  // Stars animation (same as sign-in but fewer)
  const star1Opacity = useSharedValue(0.3);
  const star2Opacity = useSharedValue(0.5);
  const star3Opacity = useSharedValue(0.4);
  const star4Opacity = useSharedValue(0.6);
  const star5Opacity = useSharedValue(0.2);
  const star6Opacity = useSharedValue(0.7);
  const star7Opacity = useSharedValue(0.4);
  const star8Opacity = useSharedValue(0.5);

  // Background stars
  const bgStar1Opacity = useSharedValue(0.2);
  const bgStar2Opacity = useSharedValue(0.3);
  const bgStar3Opacity = useSharedValue(0.25);
  const bgStar4Opacity = useSharedValue(0.35);
  const bgStar5Opacity = useSharedValue(0.15);

  useEffect(() => {
    // Floating clouds animation - 10 clouds with gentle movements
    fullcloud1Y.value = withRepeat(withTiming(20, { duration: 4000, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud2Y.value = withRepeat(withTiming(-15, { duration: 3500, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud3Y.value = withRepeat(withTiming(25, { duration: 5000, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud4Y.value = withRepeat(withTiming(-20, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud5Y.value = withRepeat(withTiming(18, { duration: 3800, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud6Y.value = withRepeat(withTiming(-22, { duration: 4200, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud7Y.value = withRepeat(withTiming(16, { duration: 3600, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud8Y.value = withRepeat(withTiming(-18, { duration: 4800, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud9Y.value = withRepeat(withTiming(24, { duration: 4100, easing: Easing.inOut(Easing.ease) }), -1, true);
    fullcloud10Y.value = withRepeat(withTiming(-14, { duration: 3900, easing: Easing.inOut(Easing.ease) }), -1, true);

    // Twinkling stars animation
    star1Opacity.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }), -1, true);
    star2Opacity.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true);
    star3Opacity.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }), -1, true);
    star4Opacity.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
    star5Opacity.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
    star6Opacity.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.ease) }), -1, true);
    star7Opacity.value = withRepeat(withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.ease) }), -1, true);
    star8Opacity.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.ease) }), -1, true);

    // Background stars
    bgStar1Opacity.value = withRepeat(withTiming(0.6, { duration: 2500, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar2Opacity.value = withRepeat(withTiming(0.7, { duration: 3000, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar3Opacity.value = withRepeat(withTiming(0.5, { duration: 2800, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar4Opacity.value = withRepeat(withTiming(0.8, { duration: 3200, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgStar5Opacity.value = withRepeat(withTiming(0.4, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  // Animated styles for all clouds
  const fullcloud1AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud1Y.value }] }));
  const fullcloud2AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud2Y.value }] }));
  const fullcloud3AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud3Y.value }] }));
  const fullcloud4AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud4Y.value }] }));
  const fullcloud5AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud5Y.value }] }));
  const fullcloud6AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud6Y.value }] }));
  const fullcloud7AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud7Y.value }] }));
  const fullcloud8AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud8Y.value }] }));
  const fullcloud9AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud9Y.value }] }));
  const fullcloud10AnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateY: fullcloud10Y.value }] }));

  const star1AnimatedStyle = useAnimatedStyle(() => ({ opacity: star1Opacity.value }));
  const star2AnimatedStyle = useAnimatedStyle(() => ({ opacity: star2Opacity.value }));
  const star3AnimatedStyle = useAnimatedStyle(() => ({ opacity: star3Opacity.value }));
  const star4AnimatedStyle = useAnimatedStyle(() => ({ opacity: star4Opacity.value }));
  const star5AnimatedStyle = useAnimatedStyle(() => ({ opacity: star5Opacity.value }));
  const star6AnimatedStyle = useAnimatedStyle(() => ({ opacity: star6Opacity.value }));
  const star7AnimatedStyle = useAnimatedStyle(() => ({ opacity: star7Opacity.value }));
  const star8AnimatedStyle = useAnimatedStyle(() => ({ opacity: star8Opacity.value }));

  const bgStar1AnimatedStyle = useAnimatedStyle(() => ({ opacity: bgStar1Opacity.value }));
  const bgStar2AnimatedStyle = useAnimatedStyle(() => ({ opacity: bgStar2Opacity.value }));
  const bgStar3AnimatedStyle = useAnimatedStyle(() => ({ opacity: bgStar3Opacity.value }));
  const bgStar4AnimatedStyle = useAnimatedStyle(() => ({ opacity: bgStar4Opacity.value }));
  const bgStar5AnimatedStyle = useAnimatedStyle(() => ({ opacity: bgStar5Opacity.value }));

  const handleSignUp = () => {
    if (name.trim() && email.trim() && password.trim()) {
      console.log('🎯 Sign up successful');
      Alert.alert('Success!', 'Account created successfully!');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleBackToSignIn = () => {
    console.log('← Back to Sign In...');
    onBackToSignIn();
  };

  return (
    <View style={styles.container}>
      {/* Background gradient (same as sign-in) */}
      <LinearGradient
        colors={['#87CEEB', '#B0E0E6', '#E0F6FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      >
        {/* Sun in top left (instead of moon in top right) */}
        <Animated.Image
          source={ASSETS.sun}
          style={styles.sun}
          resizeMode="contain"
        />

        {/* All floating fullclouds behind gradient with varying sizes and positions */}
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred1, fullcloud1AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred2, fullcloud2AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred3, fullcloud3AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred4, fullcloud4AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred5, fullcloud5AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred6, fullcloud6AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred7, fullcloud7AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred8, fullcloud8AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred9, fullcloud9AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.fullcloud} style={[styles.fullcloudBlurred10, fullcloud10AnimatedStyle]} resizeMode="contain" />

        {/* Background stars behind gradient */}
        <Animated.Image source={ASSETS.star} style={[styles.bgStar1, bgStar1AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar2, bgStar2AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar3, bgStar3AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar4, bgStar4AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.bgStar5, bgStar5AnimatedStyle]} resizeMode="contain" />

        {/* Main content area with gradient background */}
        <View style={styles.contentContainer}>
          <ImageBackground
            source={ASSETS.gradient}
            style={styles.gradientBackground}
            resizeMode="stretch"
          >
            {/* Get started text using start.png */}
            <Animated.Image
              source={ASSETS.start}
              style={styles.getStartedImage}
              resizeMode="contain"
            />

            {/* Sign up form */}
            <View style={styles.formContainer}>
              {/* Name input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>👤</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Name"
                  placeholderTextColor="#8896A2"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Email input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="E-mail address"
                  placeholderTextColor="#8896A2"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Password"
                  placeholderTextColor="#8896A2"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              {/* Create account button */}
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleSignUp}
                activeOpacity={0.8}
              >
                <Text style={styles.createAccountButtonText}>Create an account</Text>
              </TouchableOpacity>

              {/* Sign in link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleBackToSignIn}>
                  <Text style={styles.signInLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>



        {/* Foreground stars */}
        <Animated.Image source={ASSETS.star} style={[styles.star1, star1AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star2, star2AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star3, star3AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star4, star4AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star5, star5AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star6, star6AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star7, star7AnimatedStyle]} resizeMode="contain" />
        <Animated.Image source={ASSETS.star} style={[styles.star8, star8AnimatedStyle]} resizeMode="contain" />

        {/* ZenZonee logo (topmost) */}
        <View style={styles.zenzoneeContainer}>
          <Animated.Image
            source={ASSETS.zenzonee}
            style={styles.zenzonee}
            resizeMode="contain"
          />
        </View>

        {/* Blue color band at bottom */}
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
  // Sun positioning - top left (instead of moon top right)
  sun: {
    position: 'absolute',
    top: 50,
    left: 30,
    width: 120,
    height: 120,
    zIndex: 7,
  },
  // All floating clouds behind gradient (10 clouds with varying sizes and positions)
  fullcloudBlurred1: { position: 'absolute', top: 80, left: -20, width: 150, height: 100, opacity: 0.3, zIndex: 3 },
  fullcloudBlurred2: { position: 'absolute', bottom: height * 0.45, left: -40, width: 150, height: 100, opacity: 0.2, zIndex: 3 },
  fullcloudBlurred3: { position: 'absolute', bottom: height * 0.55, right: width * 0.1, width: 180, height: 120, opacity: 0.15, zIndex: 3 },
  fullcloudBlurred4: { position: 'absolute', bottom: height * 0.25, left: width * 0.2, width: 120, height: 80, opacity: 0.3, zIndex: 3 },
  fullcloudBlurred5: { position: 'absolute', bottom: height * 0.65, left: width * 0.6, width: 140, height: 90, opacity: 0.18, zIndex: 3 },
  fullcloudBlurred6: { position: 'absolute', bottom: height * 0.3, right: width * 0.3, width: 110, height: 70, opacity: 0.25, zIndex: 3 },
  fullcloudBlurred7: { position: 'absolute', top: 160, right: -25, width: 130, height: 85, opacity: 0.22, zIndex: 3 },
  fullcloudBlurred8: { position: 'absolute', top: 240, left: width * 0.1, width: 100, height: 65, opacity: 0.18, zIndex: 3 },
  fullcloudBlurred9: { position: 'absolute', bottom: 300, right: width * 0.05, width: 160, height: 105, opacity: 0.2, zIndex: 3 },
  fullcloudBlurred10: { position: 'absolute', bottom: 200, left: -30, width: 180, height: 120, opacity: 0.25, zIndex: 3 },
  
  // Background stars
  bgStar1: { position: 'absolute', top: height * 0.4, left: width * 0.1, width: 12, height: 12, zIndex: 3.5 },
  bgStar2: { position: 'absolute', top: height * 0.45, right: width * 0.15, width: 10, height: 10, zIndex: 3.5 },
  bgStar3: { position: 'absolute', top: height * 0.5, left: width * 0.3, width: 14, height: 14, zIndex: 3.5 },
  bgStar4: { position: 'absolute', top: height * 0.55, right: width * 0.25, width: 11, height: 11, zIndex: 3.5 },
  bgStar5: { position: 'absolute', top: height * 0.6, left: width * 0.05, width: 9, height: 9, zIndex: 3.5 },
  
  // Main content area (same as sign-in)
  contentContainer: {
    position: 'absolute',
    top: height * 0.35,
    left: width * 0.05,
    right: width * 0.05,
    height: height * 0.55,
    zIndex: 4,
    borderRadius: 25,
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
  // Get started image (using start.png)
  getStartedImage: {
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
  // Input styling with Quicksand font
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
    color: '#8896A2',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#4A90E2',
    fontFamily: 'Quicksand',
  },
  // Create account button
  createAccountButton: {
    backgroundColor: '#2C5282',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    marginTop: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '70%',
  },
  createAccountButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Quicksand',
    textAlign: 'center',
  },
  // Sign in section
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  signInText: {
    color: '#3C3C3C',
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  signInLink: {
    color: '#5A6C8F',
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },

  
  // Foreground stars
  star1: { position: 'absolute', top: 80, left: width * 0.15, width: 22, height: 22, zIndex: 6 },
  star2: { position: 'absolute', top: 120, right: width * 0.25, width: 18, height: 18, zIndex: 6 },
  star3: { position: 'absolute', top: 160, left: width * 0.1, width: 25, height: 25, zIndex: 6 },
  star4: { position: 'absolute', top: 100, left: width * 0.6, width: 20, height: 20, zIndex: 6 },
  star5: { position: 'absolute', top: 140, right: width * 0.1, width: 15, height: 15, zIndex: 6 },
  star6: { position: 'absolute', top: 200, left: width * 0.3, width: 28, height: 28, zIndex: 6 },
  star7: { position: 'absolute', top: 180, right: width * 0.4, width: 16, height: 16, zIndex: 6 },
  star8: { position: 'absolute', top: 220, left: width * 0.7, width: 19, height: 19, zIndex: 6 },
  
  // ZenZonee logo (topmost)
  zenzoneeContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 8,
  },
  zenzonee: {
    width: 180,
    height: 60,
  },
  
  // Blue color band at bottom
  bottomBlueBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 258,
    backgroundColor: '#6897E3',
    zIndex: 1,
  },
});

export default SignUpScreen;