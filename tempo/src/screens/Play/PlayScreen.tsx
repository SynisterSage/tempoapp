/**
 * Play Screen - Search & Browse Courses
 * Find and select courses to play
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { CourseCard } from '../../components/play/CourseCard';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { CourseCard as CourseCardType } from '../../types/home';

type Props = MainTabScreenProps<'PlayTab'>;

// Mock course data
const mockCourses: CourseCardType[] = [
  {
    id: 'torrey-pines',
    name: 'Torrey Pines',
    location: 'La Jolla, CA',
    par: 72,
    yardage: 7258,
    holes: 18,
    slope: 143,
    rating: 75.9,
  },
  {
    id: 'pebble-beach',
    name: 'Pebble Beach',
    location: 'Monterey, CA',
    par: 72,
    yardage: 6816,
    holes: 18,
    slope: 138,
    rating: 74.5,
  },
  {
    id: 'cypress-point',
    name: 'Cypress Point',
    location: 'Monterey, CA',
    par: 72,
    yardage: 6506,
    holes: 18,
    slope: 141,
    rating: 73.2,
  },
];

export const PlayScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);

  const handleSettingsPress = () => {
    navigation.navigate('SettingsTab');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    // Filter courses based on search query
    const filtered = mockCourses.filter(
      (course) =>
        course.name.toLowerCase().includes(text.toLowerCase()) ||
        course.location.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleFilterPress = () => {
    // TODO: Show filter modal/bottom sheet
    console.log('Filter pressed');
  };

  const handleCoursePress = (courseId: string) => {
    // TODO: Navigate to course detail or start round
    console.log('Course pressed:', courseId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]} edges={[]}>
      <Header
        title="play"
        onSettingsPress={handleSettingsPress}
        onNotificationPress={handleNotificationPress}
        notificationBadge={0}
      />

      {/* Search Bar & Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Courses, Cities"
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Filter Button */}
        <TouchableOpacity style={[styles.filterButton]} onPress={handleFilterPress}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Course Cards */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.coursesList}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => handleCoursePress(course.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No courses found</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    alignItems: 'center',
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.purple,
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
  },
  searchIcon: {
    fontSize: 18,
    marginLeft: Spacing.md,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: 20,
  },
  coursesList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['5xl'],
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
});
