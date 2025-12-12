/**
 * Training Lab Section
 * Shows saved training drills for the user
 * Shows up to 3 drills, displays "Get Started" if none exist
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TrainingDrill } from '../../types/home';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface TrainingLabSectionProps {
  drills: TrainingDrill[];
  onDrillPress?: (drill: TrainingDrill) => void;
  onSeeAllPress?: () => void;
}

const DrillCard: React.FC<{ drill: TrainingDrill; onPress?: () => void }> = ({
  drill,
  onPress,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'driving':
        return 'golf';
      case 'chipping':
        return 'target-outline';
      case 'putting':
        return 'circle-outline';
      case 'full-swing':
        return 'lightning-bolt';
      default:
        return 'dumbbell';
    }
  };

  return (
    <TouchableOpacity style={[styles.drillCard, Shadows.md]} onPress={onPress} activeOpacity={0.8}>
      {/* Background gradient indicator */}
      <View style={styles.drillBackground} />

      {/* Icon container */}
      <View style={styles.iconContainer}>
        <Icon 
          name={getTypeIcon(drill.type)} 
          size={24} 
          color={Colors.white} 
        />
      </View>

      {/* Content */}
      <View style={styles.drillContent}>
        <Text style={styles.drillName}>{drill.name}</Text>
        <Text style={styles.drillDuration}>{drill.type} • {drill.duration}m</Text>
      </View>

      {/* Play button */}
      <View style={styles.playButton}>
        <Icon 
          name="play" 
          size={20} 
          color={Colors.white} 
        />
      </View>
    </TouchableOpacity>
  );
};

const EmptyState: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Icon 
          name="dumbbell" 
          size={48} 
          color={Colors.purple} 
        />
      </View>
      <Text style={styles.emptyTitle}>Get Started</Text>
      <Text style={styles.emptySubtitle}>Create your first training drill</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={onGetStarted}>
        <Text style={styles.emptyButtonText}>Create Drill</Text>
      </TouchableOpacity>
    </View>
  );
};

export const TrainingLabSection: React.FC<TrainingLabSectionProps> = ({
  drills,
  onDrillPress,
  onSeeAllPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Training Lab</Text>
        {drills.length > 0 && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAllLink}>All Drills</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {drills.length > 0 ? (
        <View style={styles.drillsList}>
          {drills.slice(0, 3).map((drill) => (
            <DrillCard
              key={drill.id}
              drill={drill}
              onPress={() => onDrillPress?.(drill)}
            />
          ))}
        </View>
      ) : (
        <EmptyState onGetStarted={onSeeAllPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.purple,
  },
  drillsList: {
    gap: Spacing.md,
  },
  drillCard: {
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  drillBackground: {
    position: 'absolute',
    right: -40,
    top: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  drillContent: {
    flex: 1,
    marginLeft: Spacing.md,
    zIndex: 1,
  },
  drillName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  drillDuration: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  // Empty state
  emptyContainer: {
    backgroundColor: Colors.pale,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 82, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
