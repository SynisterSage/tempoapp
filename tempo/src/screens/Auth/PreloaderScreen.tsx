import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../store/AuthContext';
import { AuthStackParamList } from '../../navigation/types';

const { height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Preloader'>;

export const PreloaderScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, userProfile, loading, markPreloaderSeen } = useAuth();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const hasNavigated = useRef(false);
  const animationComplete = useRef(false);

  // Handle animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      animationComplete.current = true;
    });

    // Minimum display time
    const timer = setTimeout(() => {
      animationComplete.current = true;
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle navigation based on auth state - reactive to changes
  useEffect(() => {
    // Don't navigate while loading or if already navigated
    if (loading || hasNavigated.current) return;

    // Wait for animation to complete
    const checkAndNavigate = () => {
      if (hasNavigated.current) return;
      
      console.log('🧭 PreloaderScreen checking navigation:', { 
        user: !!user, 
        userProfile: !!userProfile, 
        profileCompleted: userProfile?.profile_completed 
      });

      if (user && userProfile) {
        // User is authenticated with profile
        if (!userProfile.has_seen_preloader) {
          markPreloaderSeen();
        }
        
        if (!userProfile.profile_completed) {
          console.log('🧭 Navigating to ProfileSetup');
          hasNavigated.current = true;
          navigation.replace('ProfileSetup');
        }
        // If profile is completed, RootNavigator will show Main stack
      } else if (user && !userProfile) {
        // User authenticated but no profile yet - wait for profile creation
        console.log('🧭 User exists but no profile yet, waiting...');
      } else if (!user) {
        // Not authenticated, go to Welcome
        console.log('🧭 Navigating to Welcome');
        hasNavigated.current = true;
        navigation.replace('Welcome');
      }
    };

    // Small delay to let animation show, then check
    const timer = setTimeout(checkAndNavigate, 1500);

    return () => clearTimeout(timer);
  }, [user, userProfile, loading, navigation, markPreloaderSeen]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo/Brand */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.flagPin} />
          </View>
        </View>

        {/* Tempo Text */}
        <Animated.Text
          style={[
            styles.brandText,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          TEMPO
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: Colors.purple,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  flagPin: {
    width: 24,
    height: 24,
    backgroundColor: Colors.white,
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
  },
  brandText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 2,
  },
});
