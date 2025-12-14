import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Drill } from '../../types/models';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface Props {
  drill: Drill;
  onPress?: () => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'driving':
      return 'golf';
    case 'approach':
      return 'target-outline';
    case 'short_game':
      return 'golf-tee';
    case 'putting':
      return 'circle-outline';
    default:
      return 'dumbbell';
  }
};

const DrillCard: React.FC<Props> = ({ drill, onPress }) => {
  return (
    <TouchableOpacity style={[styles.drillCard, Shadows.md]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.drillBackground} />

      <View style={styles.iconContainer}>
        <Icon name={getTypeIcon(drill.category)} size={24} color={Colors.white} />
      </View>

      <View style={styles.drillContent}>
        <Text style={styles.drillName} numberOfLines={1}>{drill.name}</Text>
        <Text style={styles.drillDuration}>{drill.category} • {drill.estimatedTime ?? '-'}m</Text>
      </View>

      <View style={styles.playButton}>
        <Icon name="play" size={20} color={Colors.white} />
      </View>
    </TouchableOpacity>
  );
};

export default DrillCard;

const styles = StyleSheet.create({
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
});
