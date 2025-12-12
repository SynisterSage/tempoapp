/**
 * Recent Activity Cards
 * Horizontal scrollable list of recent rounds
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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

  const formattedDaysAgo = daysAgo === 0 ? 'Today' : `${daysAgo}d ago`;
  const isBetter = round.score < round.par;
  const difference = Math.abs(round.score - round.par);
  const differenceText = isBetter ? `-${difference}` : `+${difference}`;
  
  const accentColor = isBetter ? Colors.success : Colors.purple;
  const bgColor = isBetter 
    ? 'rgba(34, 197, 94, 0.08)' 
    : 'rgba(99, 82, 255, 0.08)';

  return (
    <TouchableOpacity 
      style={[styles.card, Shadows.md, { borderLeftColor: accentColor, borderLeftWidth: 3 }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Background accent */}
      <View style={[styles.cardBackground, { backgroundColor: bgColor }]} />

      {/* Header: Date + Status Icon */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formattedDaysAgo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: accentColor }]}>
          <Icon
            name={isBetter ? 'trending-down' : 'trending-up'}
            size={12}
            color={Colors.white}
          />
        </View>
      </View>

      {/* Course name */}
      <Text style={styles.courseName} numberOfLines={1}>{round.courseName}</Text>

      {/* Score display - More prominent */}
      <View style={styles.scoreSection}>
        <View style={styles.mainScore}>
          <Text style={[styles.score, { color: accentColor }]}>
            {round.score}
          </Text>
        </View>
        <View style={styles.scoreDetails}>
          <Text style={[styles.difference, { color: accentColor }]}>
            {differenceText}
          </Text>
          <Text style={styles.parText}>par {round.par}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    minWidth: 150,
    height: 160,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.gray,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.black,
    zIndex: 1,
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.md,
    zIndex: 1,
  },
  mainScore: {
    justifyContent: 'flex-end',
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreDetails: {
    gap: Spacing.xs,
  },
  difference: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  parText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.gray,
  },
});
