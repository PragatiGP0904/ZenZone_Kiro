/**
 * Mobile App Component for Expo/React Native
 * Integrates all components into a cohesive mobile app experience
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Color scheme
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    600: '#0284c7',
    700: '#0369a1'
  },
  gray: {
    50: '#f9fafb',
    600: '#4b5563'
  },
  white: '#ffffff'
};

// Typography
const typography = {
  fonts: {
    primary: Platform.OS === 'ios' ? 'System' : 'Roboto'
  },
  sizes: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32
  },
  weights: {
    normal: '400',
    semiBold: '600',
    bold: '700'
  }
};

// Home Screen Component
const HomeScreen = ({ userProgress, onNavigate }) => {
  const handleStartChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNavigate('chat');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.homeContent}>
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100]]}
        style={styles.welcomeContainer}
      >
        <Text style={styles.emoji}>🌸</Text>
        <Text style={styles.title}>Welcome to ZenBloom</Text>
        <Text style={styles.subtitle}>Your personal mental health companion</Text>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Today's Progress</Text>
          <Text style={styles.cardText}>
            Mood: {userProgress?.currentMood || 'Not set'} | 
            Streak: {userProgress?.streak || 0} days
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={handleStartChat}>
          <Text style={styles.startButtonText}>Start Conversation 💬</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

// Chat Screen Component
const ChatScreen = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! I'm your mental health companion. How are you feeling today?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      isAI: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "Thank you for sharing that with me. I'm here to support you. Can you tell me more about how you're feeling?",
        isAI: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={styles.chatContainer}>
      <View style={styles.chatHeader}>
        <TouchableOpacity onPress={() => onNavigate('home')}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chatTitle}>Mental Health Companion</Text>
      </View>
      
      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isAI ? styles.aiMessage : styles.userMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isAI ? styles.aiMessageText : styles.userMessageText
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Calendar Screen Component
const CalendarScreen = ({ onNavigate }) => (
  <SafeAreaView style={styles.screenContainer}>
    <View style={styles.screenHeader}>
      <TouchableOpacity onPress={() => onNavigate('home')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Mood Calendar</Text>
    </View>
    <View style={styles.screenContent}>
      <Text style={styles.placeholderText}>📊 Your mood tracking chart will appear here</Text>
    </View>
  </SafeAreaView>
);

// Profile Screen Component
const ProfileScreen = ({ onNavigate }) => (
  <SafeAreaView style={styles.screenContainer}>
    <View style={styles.screenHeader}>
      <TouchableOpacity onPress={() => onNavigate('home')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Settings & Profile</Text>
    </View>
    <View style={styles.screenContent}>
      <Text style={styles.placeholderText}>⚙️ Settings and configuration options</Text>
    </View>
  </SafeAreaView>
);

// Insights Screen Component
const InsightsScreen = ({ onNavigate }) => (
  <SafeAreaView style={styles.screenContainer}>
    <View style={styles.screenHeader}>
      <TouchableOpacity onPress={() => onNavigate('home')}>
        <Text style={styles.backButton}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Habit Insights</Text>
    </View>
    <View style={styles.screenContent}>
      <Text style={styles.placeholderText}>📈 Your habit correlation insights</Text>
    </View>
  </SafeAreaView>
);

// Bottom Navigation Component
const BottomNavigation = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'chat', label: 'Chat', icon: '💬' },
    { key: 'calendar', label: 'Calendar', icon: '📅' },
    { key: 'insights', label: 'Insights', icon: '📊' },
    { key: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.navItem,
            currentScreen === item.key && styles.activeNavItem
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onNavigate(item.key);
          }}
        >
          <Text style={styles.navIcon}>{item.icon}</Text>
          <Text style={[
            styles.navLabel,
            currentScreen === item.key && styles.activeNavLabel
          ]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main Mobile App Component
const MobileAppExpo = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [userProgress] = useState({
    currentMood: 7,
    streak: 5,
    conversationCount: 10
  });

  const handleNavigation = useCallback((screen) => {
    setCurrentScreen(screen);
  }, []);

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen userProgress={userProgress} onNavigate={handleNavigation} />;
      case 'chat':
        return <ChatScreen onNavigate={handleNavigation} />;
      case 'calendar':
        return <CalendarScreen onNavigate={handleNavigation} />;
      case 'insights':
        return <InsightsScreen onNavigate={handleNavigation} />;
      case 'profile':
        return <ProfileScreen onNavigate={handleNavigation} />;
      default:
        return <HomeScreen userProgress={userProgress} onNavigate={handleNavigation} />;
    }
  };

  return (
    <View style={styles.app}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        {renderCurrentScreen()}
      </View>
      <BottomNavigation currentScreen={currentScreen} onNavigate={handleNavigation} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  homeContent: {
    flexGrow: 1,
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.primary[700],
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.primary[700],
    marginBottom: 8,
  },
  cardText: {
    color: colors.gray[600],
  },
  startButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: colors.white,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semiBold,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    color: colors.primary[600],
    fontSize: typography.sizes.md,
    marginRight: 16,
  },
  chatTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.primary[700],
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  aiMessage: {
    backgroundColor: '#f3f4f6',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: colors.primary[600],
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: typography.sizes.md,
  },
  aiMessageText: {
    color: '#374151',
  },
  userMessageText: {
    color: colors.white,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sendButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: typography.weights.semiBold,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  screenTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semiBold,
    color: colors.primary[700],
  },
  screenContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  placeholderText: {
    fontSize: typography.sizes.lg,
    color: colors.gray[600],
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 20,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    // Active state styling handled by text color
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    color: colors.gray[600],
  },
  activeNavLabel: {
    color: colors.primary[600],
    fontWeight: typography.weights.semiBold,
  },
});

export default MobileAppExpo;