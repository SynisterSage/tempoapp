/**
 * Score Index Card
 * Shows user's golf handicap index with trend
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScoreData } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface ScoreIndexCardProps {
  scoreData: ScoreData;
  onPress?: () => void;
}

export const ScoreIndexCard: React.FC<ScoreIndexCardProps> = ({ scoreData, onPress }) => {
  const getTrendIcon = () => {
    if (scoreData.trend === 'down') return '↓';
    if (scoreData.trend === 'up') return '↑';
    return '−';
  };

  const getTrendColor = () => {
    if (scoreData.trend === 'down') return Colors.success; // Improving (lower index is better)
    if (scoreData.trend === 'up') return Colors.error; // Declining
    return Colors.gray;
  };

  const formattedChange = Math.abs(scoreData.change).toFixed(1);

  return (
    <View style={[styles.container, Shadows.md]}>
      {/* Background accent shape */}
      <View style={styles.backgroundShape} />

      {/* Trend indicator */}
      <View style={styles.trendContainer}>
        <View style={[styles.trendBadge, { backgroundColor: getTrendColor() }]}>
          <Text style={styles.trendIcon}>{getTrendIcon()}</Text>
          <Text style={styles.trendText}>{formattedChange}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Index</Text>
        <Text style={styles.score}>{scoreData.index}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flex: 0.85,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  backgroundShape: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  trendContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  trendBadge: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  content: {
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.sm,
  },
  score: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
});
