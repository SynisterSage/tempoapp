/**
 * Stats Index Card
 * Reusable small hero card used on the Stats screen (similar to Home `ScoreIndexCard`)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface Props {
  label: string;
  value: string | number;
  subtitle?: string;
  change?: number; // positive/negative change indicator
  trend?: 'up' | 'down' | 'flat';
  onPress?: () => void;
}

export const StatsIndexCard: React.FC<Props> = ({ label, value, subtitle, change, trend, onPress }) => {
  const getTrendIcon = () => {
    if (trend === 'down') return 'trending-down';
    if (trend === 'up') return 'trending-up';
    return 'minus';
  };

  const getTrendColor = () => {
    if (trend === 'down') return Colors.success;
    if (trend === 'up') return Colors.error;
    return Colors.gray;
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={[styles.wrapper, Shadows.md]}>
      <View style={styles.container}>
        {/* Background accent shapes to match Home ScoreIndexCard */}
        <View style={styles.backgroundShape1} />
        <View style={styles.backgroundShape2} />
        <View style={styles.trendRow}>
          {typeof change === 'number' && (
            <View style={[styles.trendBadge, { backgroundColor: getTrendColor() }]}> 
              <Icon name={getTrendIcon()} size={12} color={Colors.white} />
              <Text style={styles.trendText}>{Math.abs(change).toFixed(1)}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  container: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    minHeight: 120,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  backgroundShape1: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  backgroundShape2: {
    position: 'absolute',
    left: -28,
    bottom: -28,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  trendRow: {
    alignItems: 'flex-end',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  trendText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  content: {
    zIndex: 1,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  value: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
});

export default StatsIndexCard;
