import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Text,
  ScrollView,
  ImageBackground 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  runOnJS
} from 'react-native-reanimated';
import { ASSETS } from '../constants/assets';

interface HomeScreenProps {
  onLogout: () => void;
}

type MoodType = 'happy' | 'sad' | 'angry' | 'cry' | 'depress' | null;

const { width, height } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  console.log('🏠 Home screen rendering...');

  const [selectedMood, setSelectedMood] = useState<MoodType>(null);

  // Floating animations for cn.png and nc.png (puffing effect)
  const cnScale = useSharedValue(1);
  const ncScale = useSharedValue(1);

  // Mood-based animations for gra.png
  const graShimmer = useSharedValue(0);
  const rainOpacity = useSharedValue(0);
  const volcanoScale = useSharedValue(1);
  const thunderOpacity = useSharedValue(0);
  const darknessOpacity = useSharedValue(0);

  useEffect(() => {
    // Floating puffing animations for cn and nc
    cnScale.value = withRepeat(
      withTiming(1.2, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    ncScale.value = withRepeat(
      withTiming(1.15, {
        duration: 2200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // Mood-based animations
  useEffect(() => {
    // Reset all animations first
    graShimmer.value = 0;
    rainOpacity.value = 0;
    volcanoScale.value = 1;
    thunderOpacity.value = 0;
    darknessOpacity.value = 0;

    switch (selectedMood) {
      case 'happy':
        // Shimmering effect
        graShimmer.value = withRepeat(
          withTiming(1, {
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
        break;

      case 'sad':
        // Rain effect
        rainOpacity.value = withRepeat(
          withSequence(
            withTiming(0.8, { duration: 300 }),
            withTiming(0.3, { duration: 200 }),
            withTiming(0.9, { duration: 400 }),
            withTiming(0.1, { duration: 100 })
          ),
          -1,
          false
        );
        break;

      case 'angry':
        // Volcano burst effect
        volcanoScale.value = withRepeat(
          withSequence(
            withTiming(1.3, { duration: 200, easing: Easing.out(Easing.quad) }),
            withTiming(0.9, { duration: 100 }),
            withTiming(1.2, { duration: 150 }),
            withTiming(1, { duration: 200 })
          ),
          -1,
          false
        );
        break;

      case 'cry':
      case 'depress':
        // Dark with thunder
        darknessOpacity.value = withTiming(0.6, { duration: 1000 });
        thunderOpacity.value = withRepeat(
          withSequence(
            withTiming(0, { duration: 2000 }),
            withTiming(1, { duration: 50 }),
            withTiming(0, { duration: 100 }),
            withTiming(0.8, { duration: 30 }),
            withTiming(0, { duration: 50 })
          ),
          -1,
          false
        );
        break;
    }
  }, [selectedMood]);

  // Animated styles
  const cnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cnScale.value }],
  }));

  const ncAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ncScale.value }],
  }));

  const graAnimatedStyle = useAnimatedStyle(() => {
    const shimmerOpacity = interpolate(graShimmer.value, [0, 1], [1, 0.7]);
    return {
      opacity: selectedMood === 'happy' ? shimmerOpacity : 1,
      transform: [{ scale: volcanoScale.value }],
    };
  });

  const rainAnimatedStyle = useAnimatedStyle(() => ({
    opacity: rainOpacity.value,
  }));

  const thunderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: thunderOpacity.value,
  }));

  const darknessAnimatedStyle = useAnimatedStyle(() => ({
    opacity: darknessOpacity.value,
  }));

  const handleMoodSelect = (mood: MoodType) => {
    console.log(`😊 Mood selected: ${mood}`);
    setSelectedMood(mood);
  };

  const handleProfilePress = () => {
    console.log('👤 Profile pressed');
    // Navigate to profile page
  };

  const handleSettingsPress = () => {
    console.log('⚙️ Settings pressed');
    // Navigate to settings page
  };

  const renderMoodButton = (
    mood: MoodType,
    normalAsset: any,
    activeAsset: any,
    label: string
  ) => {
    const isSelected = selectedMood === mood;
    
    return (
      <TouchableOpacity
        style={[styles.moodButton, isSelected && styles.moodButtonSelected]}
        onPress={() => handleMoodSelect(mood)}
        activeOpacity={0.8}
      >
        <Animated.Image
          source={isSelected ? activeAsset : normalAsset}
          style={styles.moodIcon}
          resizeMode="contain"
        />
        <Text style={[styles.moodText, isSelected && styles.moodTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background using home.png */}
      <ImageBackground 
        source={ASSETS.home} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Top section with top.png */}
        <View style={styles.topSection}>
          <Animated.Image
            source={ASSETS.top}
            style={styles.topImage}
            resizeMode="cover"
          />
          
          {/* Logo in top left corner */}
          <Animated.Image
            source={ASSETS.logo}
            style={styles.logoTopLeft}
            resizeMode="contain"
          />
          
          {/* Settings icon */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Animated.Image
              source={ASSETS.settings}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          
          {/* Profile icon (girl.png) */}
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={handleProfilePress}
          >
            <Animated.Image
              source={ASSETS.girl}
              style={styles.profileIcon}
              resizeMode="cover"
            />
          </TouchableOpacity>
          
          {/* Cute.png at bottom of top section */}
          <Animated.Image
            source={ASSETS.cute}
            style={styles.cuteImage}
            resizeMode="contain"
          />
        </View>

        {/* Scrollable content */}
        <ScrollView 
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Gra.png section with mood effects */}
          <View style={styles.graSection}>
            <Animated.Image
              source={ASSETS.gra}
              style={[styles.graImage, graAnimatedStyle]}
              resizeMode="contain"
            />
            
            {/* Floating cn.png and nc.png inside gra */}
            <Animated.Image
              source={ASSETS.cn}
              style={[styles.cnImage, cnAnimatedStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={ASSETS.nc}
              style={[styles.ncImage, ncAnimatedStyle]}
              resizeMode="contain"
            />
            
            {/* bc.png positioned as shown */}
            <Animated.Image
              source={ASSETS.bc}
              style={styles.bcImage}
              resizeMode="contain"
            />

            {/* Mood effect overlays */}
            {selectedMood === 'sad' && (
              <Animated.View style={[styles.rainOverlay, rainAnimatedStyle]} />
            )}
            
            {(selectedMood === 'cry' || selectedMood === 'depress') && (
              <>
                <Animated.View style={[styles.darknessOverlay, darknessAnimatedStyle]} />
                <Animated.View style={[styles.thunderOverlay, thunderAnimatedStyle]} />
              </>
            )}

            {/* "How are you feeling today?" text */}
            <Text style={styles.feelingText}>How are you feeling today?</Text>

            {/* Mood selection buttons */}
            <View style={styles.moodContainer}>
              <View style={styles.moodRow}>
                {renderMoodButton('happy', ASSETS.happy, ASSETS.h1, 'HAPPY')}
                {renderMoodButton('sad', ASSETS.sad, ASSETS.s1, 'SAD')}
              </View>
              <View style={styles.moodRow}>
                {renderMoodButton('angry', ASSETS.angry, ASSETS.a1, 'ANGRY')}
                {renderMoodButton('cry', ASSETS.cry, ASSETS.c1, 'CRYING')}
              </View>
              <View style={styles.moodRow}>
                {renderMoodButton('depress', ASSETS.depress, ASSETS.d1, 'DEPRESS')}
              </View>
            </View>
          </View>

          {/* Additional scrollable content can be added here */}
          <View style={styles.additionalContent}>
            <Text style={styles.placeholderText}>More content can be added here...</Text>
          </View>
        </ScrollView>

        {/* Fixed navigation bar at bottom */}
        <View style={styles.navigationBar}>
          <Animated.Image
            source={ASSETS.nav}
            style={styles.navImage}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topSection: {
    height: height * 0.4,
    position: 'relative',
  },
  topImage: {
    width: '100%',
    height: '100%',
  },
  logoTopLeft: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 80,
    height: 40,
    zIndex: 2,
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 80,
    zIndex: 2,
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  profileButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cuteImage: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    width: 120,
    height: 100,
    zIndex: 2,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100, // Space for navigation bar
  },
  graSection: {
    position: 'relative',
    alignItems: 'center',
    marginTop: 20,
  },
  graImage: {
    width: width * 0.9,
    height: 300,
  },
  cnImage: {
    position: 'absolute',
    top: 50,
    left: 50,
    width: 60,
    height: 60,
  },
  ncImage: {
    position: 'absolute',
    top: 80,
    right: 60,
    width: 50,
    height: 50,
  },
  bcImage: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    width: 80,
    height: 60,
  },
  // Mood effect overlays
  rainOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A90E2',
    borderRadius: 15,
  },
  darknessOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2C3E50',
    borderRadius: 15,
  },
  thunderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F39C12',
    borderRadius: 15,
  },
  feelingText: {
    fontSize: 15,
    fontFamily: 'Comfortaa',
    color: '#A332FF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  moodContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 15,
  },
  moodButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moodButtonSelected: {
    backgroundColor: '#A332FF',
    transform: [{ scale: 1.05 }],
  },
  moodIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#333',
  },
  moodTextSelected: {
    color: '#FFFFFF',
  },
  additionalContent: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  navigationBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 10,
  },
  navImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;