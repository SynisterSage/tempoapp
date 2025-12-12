/**
 * Caddy Tip Card
 * Shows AI-generated tips for the featured course
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
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
      {/* Header with icon */}
      <View style={styles.header}>
        <Text style={styles.tipLabel}>{tip.title}</Text>
        <Text style={styles.icon}>💡</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  tipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.purple,
    textTransform: 'capitalize',
  },
  icon: {
    fontSize: 18,
  },
  content: {
    marginBottom: Spacing.md,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.black,
    lineHeight: 20,
  },
  courseReference: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
});
