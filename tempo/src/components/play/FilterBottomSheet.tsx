/**
 * Filter Bottom Sheet Modal
 * Displays course filters with checkbox, slider, and range inputs
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius, Layout } from '../../theme/spacing';
import { CourseFilters, MOCK_FILTER_OPTIONS, DEFAULT_FILTERS } from '../../types/filters';

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: CourseFilters) => void;
  currentFilters: CourseFilters;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<CourseFilters>(currentFilters);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const toggleHoles = (holeCount: number) => {
    setFilters((prev) => {
      const current = prev.holes || [];
      const updated = current.includes(holeCount)
        ? current.filter((h) => h !== holeCount)
        : [...current, holeCount];
      return {
        ...prev,
        holes: updated.length === 0 ? null : updated,
      };
    });
  };

  const toggleLocation = (location: string) => {
    setFilters((prev) => ({
      ...prev,
      location: prev.location === location ? null : location,
    }));
  };

  const updateYardageRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      yardageRange: { min, max },
    }));
  };

  const updateRatingRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      ratingRange: { min, max },
    }));
  };

  const updateSlopeRange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      slopeRange: { min, max },
    }));
  };

  const bottomTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
          },
        ]}
      >
        <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} />
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.bottomSheet,
          {
            transform: [{ translateY: bottomTranslate }],
          },
        ]}
      >
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Filters Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Holes Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Holes</Text>
            <View style={styles.checkboxGroup}>
              {MOCK_FILTER_OPTIONS.holes.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.checkboxContainer}
                  onPress={() => toggleHoles(option.value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.holes?.includes(option.value) &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {filters.holes?.includes(option.value) && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Location Filter */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Location</Text>
            <View style={styles.checkboxGroup}>
              {MOCK_FILTER_OPTIONS.locations.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.checkboxContainer}
                  onPress={() => toggleLocation(option.value)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      filters.location === option.value &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {filters.location === option.value && (
                      <Icon name="check" size={16} color={Colors.white} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Yardage Range Filter */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Yardage Range</Text>
              <Text style={styles.filterValue}>
                {filters.yardageRange.min} - {filters.yardageRange.max}y
              </Text>
            </View>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Min</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={String(filters.yardageRange.min)}
                  onChangeText={(value) => {
                    const num = parseInt(value) || 4000;
                    updateYardageRange(Math.max(4000, Math.min(num, filters.yardageRange.max)), filters.yardageRange.max);
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
              <Text style={styles.rangeSeparator}>–</Text>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Max</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={String(filters.yardageRange.max)}
                  onChangeText={(value) => {
                    const num = parseInt(value) || 8000;
                    updateYardageRange(filters.yardageRange.min, Math.min(8000, Math.max(num, filters.yardageRange.min)));
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
            </View>
          </View>

          {/* Rating Range Filter */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Course Rating</Text>
              <Text style={styles.filterValue}>
                {filters.ratingRange.min.toFixed(1)} - {filters.ratingRange.max.toFixed(1)}
              </Text>
            </View>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Min</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.ratingRange.min.toFixed(1)}
                  onChangeText={(value) => {
                    const num = parseFloat(value) || 65;
                    updateRatingRange(Math.max(65, Math.min(num, filters.ratingRange.max)), filters.ratingRange.max);
                  }}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
              <Text style={styles.rangeSeparator}>–</Text>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Max</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={filters.ratingRange.max.toFixed(1)}
                  onChangeText={(value) => {
                    const num = parseFloat(value) || 80;
                    updateRatingRange(filters.ratingRange.min, Math.min(80, Math.max(num, filters.ratingRange.min)));
                  }}
                  keyboardType="decimal-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
            </View>
          </View>

          {/* Slope Range Filter */}
          <View style={styles.filterGroup}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Slope Rating</Text>
              <Text style={styles.filterValue}>
                {filters.slopeRange.min} - {filters.slopeRange.max}
              </Text>
            </View>
            <View style={styles.rangeContainer}>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Min</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={String(filters.slopeRange.min)}
                  onChangeText={(value) => {
                    const num = parseInt(value) || 100;
                    updateSlopeRange(Math.max(100, Math.min(num, filters.slopeRange.max)), filters.slopeRange.max);
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
              <Text style={styles.rangeSeparator}>–</Text>
              <View style={styles.rangeInputField}>
                <Text style={styles.rangeInputLabel}>Max</Text>
                <TextInput
                  style={styles.rangeInput}
                  value={String(filters.slopeRange.max)}
                  onChangeText={(value) => {
                    const num = parseInt(value) || 160;
                    updateSlopeRange(filters.slopeRange.min, Math.min(160, Math.max(num, filters.slopeRange.min)));
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor={Colors.gray}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '85%',
    paddingBottom: Spacing['3xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.purple,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['6xl'],
  },
  filterGroup: {
    marginBottom: Spacing['2xl'],
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  filterValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purple,
  },
  sliderContainer: {
    marginBottom: Spacing.lg,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.sm,
  },
  slider: {
    height: 40,
    width: '100%',
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  rangeInputField: {
    flex: 1,
  },
  rangeInputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  rangeInput: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.myrtle,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: Layout.inputHeight,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.purple,
    textAlign: 'center',
    justifyContent: 'center',
  },
  rangeSeparator: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.darkGray,
    paddingHorizontal: Spacing.sm,
  },
  checkboxGroup: {
    marginTop: Spacing.sm,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    marginLeft: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.white,
  },
  applyButton: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
