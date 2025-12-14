import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { mockTrainingTools } from '../../data/mockPracticeData';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ICON_MAP: Record<string, string> = {
  'tool-001': 'target',
  'tool-002': 'radar',
  'tool-003': 'video-plus',
};

export const TrainingTools: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Training Tools</Text>
        <TouchableOpacity onPress={() => console.log('All Tools')}>
          <Text style={styles.allLink}>All Tools</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        {mockTrainingTools.slice(0, 2).map((tool) => {
          const iconName = ICON_MAP[tool.id] ?? 'toolbox-outline';
          const isTempo = tool.id === 'tool-001';
          // display a shorter title for the tempo tool per request
          const displayName = isTempo ? 'Rhythm Check' : tool.name;
          const watermarkSpecific = isTempo
            ? { right: -8, top: -50, opacity: 0.65, width: 150 }
            : { right: -20, top: -30, opacity: 0.65, width: 120 };

          return (
            <View key={tool.id} style={[styles.cardWrapper, Shadows.md]}>
              <TouchableOpacity
                style={styles.cardInner}
                activeOpacity={0.86}
                onPress={() => console.log('tool pressed', tool.id)}
              >
                  {/* subtle full-card purple overlay to match Recent Activity cards (lighter) */}
                  <View style={[styles.cardBackground, isTempo ? styles.cardBackgroundTempo : null]} />

                  {/* decorative watermark circle (same treatment as AI Coach Insight) */}
                  <View style={[styles.watermarkCircle, isTempo ? styles.watermarkTempo : null]} pointerEvents="none" />

                  {/* small icon box */}
                <View style={styles.iconContainer}>
                  <Icon name={iconName} size={20} color={Colors.purple} />
                </View>

                <View style={styles.header}>
                  <Text style={styles.tipLabel}>{displayName}</Text>
                </View>

                <View style={styles.content}>
                  <Text style={styles.toolText}>{tool.description}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  allLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    minHeight: 140,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    borderRadius: BorderRadius.lg,
    marginBottom: 6,
  },
  cardInner: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(99,82,255,0.06)',
    opacity: 0.16,
  },
  cardBackgroundTempo: {
    backgroundColor: 'rgba(99,82,255,0.05)',
    opacity: 0.14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(99,82,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.purple,
    textTransform: 'none',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  toolText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.darkGray,
    lineHeight: 18,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6366F1',
    zIndex: 2,
    lineHeight: 18,
  },
  watermarkCircle: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    right: -24,
    top: -28,
    backgroundColor: '#EDE9FE',
    opacity: 0.45,
  },
  watermarkTempo: {
    // same as regular watermark to match Range Mode
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    right: -24,
    top: -28,
    backgroundColor: '#EDE9FE',
    opacity: 0.45,
  },
});

export default TrainingTools;
