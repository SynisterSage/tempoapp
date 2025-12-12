/**
 * Recent Activity Stats Component
 * Displays key stats cards (Index, AVG Score, Best Round)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { UserStats } from '../../types/models';

interface RecentActivityStatsProps {
  stats: UserStats;
}

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  trendValue,
}) => {
  const getTrendColor = () => {
    if (!trend) return Colors.purple;
    return trend === 'down' ? Colors.purple : Colors.error;
  };

  const getTrendIcon = () => {
    if (!trend) return '';
    return trend === 'down' ? '↓' : '↑';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <View style={styles.cardValueRow}>
        <Text style={styles.cardValue}>{value}</Text>
      </View>
      {subValue && <Text style={styles.cardSubValue}>{subValue}</Text>}
      {trendValue !== undefined && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendValue, { color: getTrendColor() }]}>
            {getTrendIcon()} {Math.abs(trendValue)}
          </Text>
        </View>
      )}
    </View>
  );
};

export const RecentActivityStats: React.FC<RecentActivityStatsProps> = ({
  stats,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>

      {/* Stats Cards Grid */}
      <View style={styles.cardsGrid}>
        <StatCard
          label="Index"
          value={stats.currentHandicap.toFixed(1)}
          trendValue={0.2}
          trend="down"
        />
        <StatCard
          label="AVG Score"
          value={stats.averageScore.toFixed(1)}
          subValue="Last 5"
        />
        <StatCard
          label="BEST Rnd"
          value={stats.lowestScore}
          subValue="2 wks ago"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  cardsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    opacity: 0.9,
  },
  cardValueRow: {
    marginVertical: Spacing.sm,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  cardSubValue: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    opacity: 0.85,
  },
  trendRow: {
    marginTop: Spacing.xs,
  },
  trendValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});
