/**
 * Featured Course Card
 * Shows a featured course near the user with course info overlay
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CourseCard } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface FeaturedCourseCardProps {
  course: CourseCard;
  onPress?: () => void;
}

export const FeaturedCourseCard: React.FC<FeaturedCourseCardProps> = ({ course, onPress }) => {
  return (
    <View style={[styles.container, Shadows.lg]}>
      <View style={styles.imageContainer}>
        {/* Badge section with Par and Yardage */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{course.par}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{course.yardage}y</Text>
          </View>
        </View>
      </View>

      {/* Course Info Card - With play button */}
      <View style={[styles.infoContainer, Shadows.md]}>
        <Text style={styles.label}>Near You</Text>
        
        <View style={styles.courseNameRow}>
          <View style={styles.textSection}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.location}>{course.location}</Text>
          </View>
          
          {/* Play button positioned to the right */}
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  imageContainer: {
    height: 180,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    padding: Spacing.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.6)',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignSelf: 'flex-end',
    width: '100%',
    justifyContent: 'flex-end',
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    minWidth: 45,
    alignItems: 'center',
  },
  badgeValue: {
    fontSize: 13,
    color: Colors.white,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  label: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  courseNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  textSection: {
    flex: 1,
  },
  courseName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  location: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: '500',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    flexShrink: 0,
  },
  playIcon: {
    color: Colors.white,
    fontSize: 24,
    marginLeft: 4,
  },
});
