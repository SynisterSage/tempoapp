/**
 * Course Card for Play Screen
 * Shows course with image background and course info overlay
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { CourseCard as CourseCardType } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface CourseCardProps {
  course: CourseCardType;
  onPress?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onPress }) => {
  return (
    <TouchableOpacity style={[styles.container, Shadows.md]} onPress={onPress}>
      {/* Background gradient (placeholder for course image) */}
      <View style={styles.imageContainer}>
        {/* Badges at top right */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{course.par}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeValue}>{course.yardage}y</Text>
          </View>
        </View>
      </View>

      {/* Course Info - White section with play button */}
      <View style={styles.infoContainer}>
        <View style={styles.courseNameRow}>
          <View style={styles.textSection}>
            <Text style={styles.courseName}>{course.name}</Text>
            <Text style={styles.courseDetails}>
              {course.location} • Holes {course.holes} • Slope {course.slope}
            </Text>
          </View>
          
          {/* Play button positioned to the right */}
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: 'rgba(99, 102, 241, 0.6)',
    padding: Spacing.lg,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  badgeValue: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
    textTransform: 'capitalize',
  },
  courseDetails: {
    fontSize: 12,
    color: Colors.darkGray,
    fontWeight: '500',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    flexShrink: 0,
  },
  playIcon: {
    color: Colors.white,
    fontSize: 18,
    marginLeft: 2,
  },
});
