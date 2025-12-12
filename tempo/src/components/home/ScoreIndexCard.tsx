/**
 * Score Index Card
 * Shows user's golf handicap index with trend
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    if (scoreData.trend === 'down') return 'trending-down';
    if (scoreData.trend === 'up') return 'trending-up';
    return 'minus';
  };

  const getTrendColor = () => {
    if (scoreData.trend === 'down') return Colors.success; // Improving (lower index is better)
    if (scoreData.trend === 'up') return Colors.error; // Declining
    return Colors.gray;
  };

  const formattedChange = Math.abs(scoreData.change).toFixed(1);

  return (
    <View style={[styles.container, Shadows.md]}>
      {/* Background accent shapes */}
      <View style={styles.backgroundShape1} />
      <View style={styles.backgroundShape2} />

      {/* Trend indicator */}
      <View style={styles.trendContainer}>
        <View style={[styles.trendBadge, { backgroundColor: getTrendColor() }]}>
          <Icon 
            name={getTrendIcon()} 
            size={14} 
            color={Colors.white} 
          />
          <Text style={styles.trendText}>{formattedChange}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Handicap Index</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{scoreData.index}</Text>
        </View>
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
  backgroundShape1: {
    position: 'absolute',
    right: -20,
    top: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backgroundShape2: {
    position: 'absolute',
    left: -40,
    bottom: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  trendContainer: {
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  trendBadge: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
    alignItems: 'center',
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
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 44,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -1,
  },
});
