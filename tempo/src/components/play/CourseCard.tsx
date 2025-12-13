/**
 * Course Card for Play Screen
 * Shows course with image background and course info overlay
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    <View style={Shadows.lg}>
      <TouchableOpacity style={[styles.container]} onPress={onPress} activeOpacity={0.8}>
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
          <TouchableOpacity 
            style={styles.playButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Icon name="play" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: 'rgba(99, 102, 241, 0.6)',
    padding: Spacing.lg,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
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
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  courseDetails: {
    fontSize: 13,
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
    fontSize: 18,
    marginLeft: 2,
  },
});
