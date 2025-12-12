/**
 * Stats Breakdown Component
 * Detailed stats breakdown (accuracy, putts, strokes gained)
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { UserStats } from '../../types/models';

interface StatsBreakdownProps {
  stats: UserStats;
}

interface StatRowProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, icon, color = Colors.purple }) => (
  <View style={styles.statRow}>
    <View style={styles.labelRow}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={[styles.value, { color }]}>{value}</Text>
  </View>
);

const getStrokesGainedColor = (value: number) => {
  if (value > 0) return '#10b981'; // green
  if (value < 0) return '#ef4444'; // red
  return Colors.gray; // neutral
};

export const StatsBreakdown: React.FC<StatsBreakdownProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Detailed Stats</Text>

      {/* Card Container */}
      <View style={styles.card}>
        {/* Rounds & Scoring */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Rounds & Scoring</Text>
          <StatRow
            label="Total Rounds"
            value={stats.totalRounds}
            icon="🏌️"
          />
          <StatRow
            label="Average Score"
            value={stats.averageScore.toFixed(1)}
            icon="📊"
          />
          <StatRow
            label="Lowest Score"
            value={stats.lowestScore}
            icon="🎯"
            color={Colors.purple}
          />
        </View>

        <View style={styles.divider} />

        {/* Accuracy Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Accuracy</Text>
          <StatRow
            label="Fairway Accuracy"
            value={`${stats.fairwayAccuracy}%`}
            icon="🎪"
          />
          <StatRow
            label="Green in Regulation"
            value={`${stats.greenInRegulation}%`}
            icon="🚩"
          />
          <StatRow
            label="Average Putts"
            value={stats.averagePutts.toFixed(1)}
            icon="⛳"
          />
        </View>

        <View style={styles.divider} />

        {/* Strokes Gained */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Strokes Gained</Text>
          <StatRow
            label="Off Tee"
            value={stats.strokesGained.offTee.toFixed(1)}
            icon="🚗"
            color={getStrokesGainedColor(stats.strokesGained.offTee)}
          />
          <StatRow
            label="Approach"
            value={stats.strokesGained.approach.toFixed(1)}
            icon="🎯"
            color={getStrokesGainedColor(stats.strokesGained.approach)}
          />
          <StatRow
            label="Around Green"
            value={stats.strokesGained.aroundGreen.toFixed(1)}
            icon="🏑"
            color={getStrokesGainedColor(stats.strokesGained.aroundGreen)}
          />
          <StatRow
            label="Putting"
            value={stats.strokesGained.putting.toFixed(1)}
            icon="🏌️"
            color={getStrokesGainedColor(stats.strokesGained.putting)}
          />
          <View style={[styles.statRow, styles.totalRow]}>
            <View style={styles.labelRow}>
              <Text style={[styles.icon, styles.totalIcon]}>📈</Text>
              <Text style={[styles.label, styles.totalLabel]}>
                Total Strokes Gained
              </Text>
            </View>
            <Text
              style={[
                styles.value,
                styles.totalValue,
                {
                  color: getStrokesGainedColor(stats.strokesGained.total),
                },
              ]}
            >
              {stats.strokesGained.total.toFixed(1)}
            </Text>
          </View>
        </View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.purple,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.darkGray,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.purple,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginVertical: Spacing.md,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  totalLabel: {
    fontWeight: '600',
  },
  totalIcon: {
    fontSize: 20,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
  },
});
