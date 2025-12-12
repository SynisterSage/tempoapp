import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useAuth } from '../../store/AuthContext';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileSetup'>;

const SETUP_STEPS = [
  {
    id: 'handicap',
    title: 'What\'s your handicap?',
    description: 'This helps us personalize your experience',
    type: 'number',
  },
  {
    id: 'home_course',
    title: 'What\'s your home course?',
    description: 'Your favorite course to play',
    type: 'text',
  },
  {
    id: 'handedness',
    title: 'Which hand do you play?',
    description: 'Right-handed or left-handed',
    type: 'choice',
  },
  {
    id: 'unit_preference',
    title: 'Unit preference?',
    description: 'Yards/lbs or Meters/kg',
    type: 'choice',
  },
  {
    id: 'review',
    title: 'Review your profile',
    description: 'Make sure everything looks good',
    type: 'review',
  },
];

export const ProfileSetupWizard: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { completeProfile, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    handicap: '',
    home_course_name: '',
    handedness: null as 'left' | 'right' | null,
    unit_preference: 'imperial' as 'imperial' | 'metric',
  });
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  const currentStepData = SETUP_STEPS[currentStep];

  const handleNext = () => {
    setError(null);

    // Validation
    if (currentStepData.id === 'handicap') {
      if (!profileData.handicap) {
        setError('Please enter your handicap');
        return;
      }
    }

    if (currentStepData.id === 'home_course') {
      if (!profileData.home_course_name) {
        setError('Please enter your home course');
        return;
      }
    }

    if (currentStepData.id === 'handedness') {
      if (!profileData.handedness) {
        setError('Please select your handedness');
        return;
      }
    }

    if (currentStepData.id === 'unit_preference') {
      if (!profileData.unit_preference) {
        setError('Please select a unit preference');
        return;
      }
    }

    if (currentStep < SETUP_STEPS.length - 1) {
      animateStep();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      animateStep();
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setError(null);
    try {
      console.log('🎯 Completing profile with data:', {
        handicap: parseInt(profileData.handicap) || null,
        home_course_name: profileData.home_course_name,
        handedness: profileData.handedness,
        unit_preference: profileData.unit_preference,
      });
      await completeProfile({
        handicap: parseInt(profileData.handicap) || null,
        home_course_name: profileData.home_course_name,
        handedness: profileData.handedness,
        unit_preference: profileData.unit_preference,
      });
      console.log('✅ Profile completed successfully, should navigate to main app');
      // Navigation will happen automatically via auth context
    } catch (err: any) {
      console.error('❌ Error completing profile:', err.message);
      setError(err.message);
    }
  };

  const animateStep = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const progressPercentage = ((currentStep + 1) / SETUP_STEPS.length) * 100;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Step {currentStep + 1} of {SETUP_STEPS.length}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${progressPercentage}%` },
            ]}
          />
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Card Content */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.cardTitle}>{currentStepData.title}</Text>
          <Text style={styles.cardDescription}>{currentStepData.description}</Text>

          {/* Handicap Input */}
          {currentStepData.id === 'handicap' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your handicap"
                placeholderTextColor={Colors.lightGray}
                value={profileData.handicap}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, handicap: text })
                }
                keyboardType="decimal-pad"
              />
            </View>
          )}

          {/* Home Course Input */}
          {currentStepData.id === 'home_course' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your home course"
                placeholderTextColor={Colors.lightGray}
                value={profileData.home_course_name}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, home_course_name: text })
                }
              />
            </View>
          )}

          {/* Handedness Choice */}
          {currentStepData.id === 'handedness' && (
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  profileData.handedness === 'right' && styles.choiceButtonActive,
                ]}
                onPress={() =>
                  setProfileData({ ...profileData, handedness: 'right' })
                }
              >
                <Text
                  style={[
                    styles.choiceText,
                    profileData.handedness === 'right' && styles.choiceTextActive,
                  ]}
                >
                  Right-Handed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  profileData.handedness === 'left' && styles.choiceButtonActive,
                ]}
                onPress={() =>
                  setProfileData({ ...profileData, handedness: 'left' })
                }
              >
                <Text
                  style={[
                    styles.choiceText,
                    profileData.handedness === 'left' && styles.choiceTextActive,
                  ]}
                >
                  Left-Handed
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Unit Preference Choice */}
          {currentStepData.id === 'unit_preference' && (
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  profileData.unit_preference === 'imperial' && styles.choiceButtonActive,
                ]}
                onPress={() =>
                  setProfileData({ ...profileData, unit_preference: 'imperial' })
                }
              >
                <Text
                  style={[
                    styles.choiceText,
                    profileData.unit_preference === 'imperial' && styles.choiceTextActive,
                  ]}
                >
                  Imperial (Yards/lbs)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choiceButton,
                  profileData.unit_preference === 'metric' && styles.choiceButtonActive,
                ]}
                onPress={() =>
                  setProfileData({ ...profileData, unit_preference: 'metric' })
                }
              >
                <Text
                  style={[
                    styles.choiceText,
                    profileData.unit_preference === 'metric' && styles.choiceTextActive,
                  ]}
                >
                  Metric (Meters/kg)
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Review */}
          {currentStepData.id === 'review' && (
            <View style={styles.reviewContainer}>
              <ReviewItem label="Handicap" value={profileData.handicap || 'Not set'} />
              <ReviewItem label="Home Course" value={profileData.home_course_name || 'Not set'} />
              <ReviewItem
                label="Handedness"
                value={profileData.handedness ? profileData.handedness.charAt(0).toUpperCase() + profileData.handedness.slice(1) : 'Not set'}
              />
              <ReviewItem
                label="Units"
                value={profileData.unit_preference === 'imperial' ? 'Imperial' : 'Metric'}
              />
            </View>
          )}
        </Animated.View>

        {/* Buttons */}
        <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + Spacing.lg }]}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePrevious}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          {currentStep < SETUP_STEPS.length - 1 ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Complete</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

interface ReviewItemProps {
  label: string;
  value: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ label, value }) => (
  <View style={styles.reviewItem}>
    <Text style={styles.reviewLabel}>{label}</Text>
    <Text style={styles.reviewValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pale,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: Spacing['2xl'],
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.purple,
    borderRadius: 2,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    gap: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGray,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    fontSize: 16,
    color: Colors.navy,
  },
  choiceContainer: {
    gap: Spacing.md,
  },
  choiceButton: {
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  choiceButtonActive: {
    borderColor: Colors.purple,
    backgroundColor: Colors.pale,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  choiceTextActive: {
    color: Colors.purple,
  },
  reviewContainer: {
    gap: Spacing.md,
  },
  reviewItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  reviewLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: Spacing.xs,
  },
  reviewValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.navy,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.purple,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: Colors.lightGray,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: '600',
  },
});
