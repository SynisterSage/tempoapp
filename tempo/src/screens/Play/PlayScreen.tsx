/**
 * Play Screen - Search & Browse Courses
 * Find and select courses to play
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { CourseCard } from '../../components/play/CourseCard';
import { FilterBottomSheet } from '../../components/play/FilterBottomSheet';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import { CourseFilters, DEFAULT_FILTERS } from '../../types/filters';
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
  const [filters, setFilters] = useState<CourseFilters>(DEFAULT_FILTERS);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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
    setFilterModalVisible(true);
  };

  const handleApplyFilters = (newFilters: CourseFilters) => {
    setFilters(newFilters);
    // TODO: Apply filters to course list
    // For now, just close the modal
    console.log('Filters applied:', newFilters);
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (filters.holes && filters.holes.length > 0) count++;
    if (filters.location) count++;
    // Add more conditions as needed for ranges that differ from defaults
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

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
        <View style={[styles.searchBarContainer, searchFocused && styles.searchBarFocused, Shadows.sm]}>
          <Icon name="magnify" size={20} color={searchFocused ? Colors.purple : Colors.darkGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Courses, Cities"
            placeholderTextColor={Colors.lightGray}
            value={searchQuery}
            onChangeText={handleSearchChange}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity 
          style={[styles.filterButton, activeFilterCount > 0 ? styles.filterButtonActive : styles.filterButtonInactive, Shadows.sm]} 
          onPress={handleFilterPress}
          activeOpacity={0.7}
        >
          <Icon name="tune-variant" size={22} color={Colors.white} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>
                {activeFilterCount > 9 ? '9+' : activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

      {/* Course Cards */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
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
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    height: 48,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  searchBarFocused: {
    borderColor: Colors.purple,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    opacity: 1,
  },
  filterButtonInactive: {
    opacity: 0.8,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.purple,
    width: 22,
    height: 22,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
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
