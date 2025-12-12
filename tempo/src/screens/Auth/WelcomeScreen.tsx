import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../store/AuthContext';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

interface HeroSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Track Every Shot',
    description: 'Log your shots and analyze your game with precision',
    icon: '⛳',
  },
  {
    id: 2,
    title: 'Live GPS',
    description: 'Get accurate distances to the pin and hazards',
    icon: '📍',
  },
  {
    id: 3,
    title: 'AI Insights',
    description: 'Get personalized recommendations to improve your game',
    icon: '🤖',
  },
  {
    id: 4,
    title: 'AR Preview',
    description: 'Visualize your shots with augmented reality',
    icon: '🎯',
  },
];

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signInWithGoogle, user, userProfile } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Navigate to ProfileSetup when user becomes authenticated
  useEffect(() => {
    console.log('🧭 WelcomeScreen auth check:', { user: !!user, userProfile: !!userProfile });
    if (user && userProfile && !userProfile.profile_completed) {
      console.log('🧭 User authenticated, navigating to ProfileSetup');
      navigation.replace('ProfileSetup');
    }
  }, [user, userProfile, navigation]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('🔐 Starting Google Sign In...');
      await signInWithGoogle();
      console.log('🔐 Google Sign In initiated, waiting for callback...');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign in with Google');
    }
  };

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % HERO_SLIDES.length;
        scrollViewRef.current?.scrollTo({
          x: next * width,
          animated: true,
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const slide = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentSlide(slide);
      },
    }
  );

  const dotAnimatedStyle = (index: number) => ({
    opacity: scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    }),
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Hero Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
        >
          {HERO_SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              <View style={styles.slideContent}>
                <Text style={styles.slideIcon}>{slide.icon}</Text>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideDescription}>{slide.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          {HERO_SLIDES.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: dotAnimatedStyle(index).opacity as any,
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
        {/* Primary Button - Sign Up */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Google Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.googleButtonIcon}>🔍</Text>
          <Text style={styles.googleButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  carouselContainer: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
  },
  slideIcon: {
    fontSize: 80,
    marginBottom: Spacing['2xl'],
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: Colors.darkGray,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purple,
  },
  buttonContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  googleButtonIcon: {
    fontSize: 20,
  },
  googleButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  loginText: {
    color: Colors.darkGray,
    fontSize: 14,
  },
  loginLink: {
    color: Colors.purple,
    fontSize: 14,
    fontWeight: '600',
  },
});
