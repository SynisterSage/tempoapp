/**
 * Caddy Tip Card
 * Shows AI-generated tips for the featured course
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CaddyTip } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface CaddyTipCardProps {
  tip: CaddyTip;
  onPress?: () => void;
}

export const CaddyTipCard: React.FC<CaddyTipCardProps> = ({ tip, onPress }) => {
  return (
    <View style={[styles.container, Shadows.md]}>
      {/* Background accent */}
      <View style={styles.backgroundAccent} />

      {/* Icon container */}
      <View style={styles.iconContainer}>
        <Icon name="lightbulb-outline" size={24} color={Colors.purple} />
      </View>

      {/* Header with title */}
      <View style={styles.header}>
        <Text style={styles.tipLabel}>{tip.title}</Text>
      </View>

      {/* Tip content */}
      <View style={styles.content}>
        <Text style={styles.tipText}>{tip.content}</Text>
      </View>

      {/* Course name */}
      <Text style={styles.courseReference}>at {tip.courseName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.pale,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  backgroundAccent: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 82, 255, 0.08)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(99, 82, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.purple,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 21,
  },
  courseReference: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
});
