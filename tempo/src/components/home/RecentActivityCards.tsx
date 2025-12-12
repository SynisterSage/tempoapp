/**
 * Recent Activity Cards
 * Horizontal scrollable list of recent rounds
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { RoundResult } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface RecentActivityCardsProps {
  rounds: RoundResult[];
  onPress?: (round: RoundResult) => void;
}

const ActivityCard: React.FC<{ round: RoundResult; onPress?: () => void }> = ({
  round,
  onPress,
}) => {
  const daysAgo = Math.floor(
    (Date.now() - round.date.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedDaysAgo = daysAgo === 0 ? 'Today' : `${daysAgo} Days Ago`;
  const scoreColor = round.score < round.par ? Colors.success : Colors.error;

  return (
    <View style={[styles.card, Shadows.md]}>
      {/* Header with date */}
      <Text style={styles.dateText}>{formattedDaysAgo}</Text>

      {/* Course name */}
      <Text style={styles.courseName}>{round.courseName}</Text>

      {/* Score section */}
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>Score</Text>
        <View style={styles.scoreRow}>
          <Text style={[styles.score, { color: scoreColor }]}>{round.score}</Text>
          <View style={styles.divider} />
          <View>
            <Text style={styles.parLabel}>Par</Text>
            <Text style={styles.parValue}>{round.par}</Text>
          </View>
        </View>
      </View>

      {/* Status indicator dot */}
      <View style={[styles.dot, { backgroundColor: scoreColor }]} />
    </View>
  );
};

export const RecentActivityCards: React.FC<RecentActivityCardsProps> = ({
  rounds,
  onPress,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {rounds.map((round) => (
          <ActivityCard
            key={round.id}
            round={round}
            onPress={() => onPress?.(round)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 130,
    height: 140,
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
  },
  courseName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: Spacing.xs,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.lightGray,
    marginHorizontal: Spacing.xs,
  },
  parLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.gray,
  },
  parValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginTop: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-end',
  },
});
