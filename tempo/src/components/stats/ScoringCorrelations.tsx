/**
 * Scoring Correlations Chart Component
 * Displays the relationship between scores and GIR% across courses
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { ScoringCorrelationDataPoint } from '../../data/mockStatsData';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';

interface ScoringCorrelationsProps {
  data: ScoringCorrelationDataPoint[];
}

export const ScoringCorrelations: React.FC<ScoringCorrelationsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'gir' | 'putts'>('gir');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.chartIcon}>📈</Text>
          <Text style={styles.title}>Scoring Correlations</Text>
        </View>

        {/* Tab Buttons */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'gir' && styles.tabActive]}
            onPress={() => setActiveTab('gir')}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'gir' && styles.tabLabelActive,
              ]}
            >
              GIR%
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'putts' && styles.tabActive]}
            onPress={() => setActiveTab('putts')}
          >
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'putts' && styles.tabLabelActive,
              ]}
            >
              Putts
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart Container - Simple Bar Chart */}
      <View style={styles.chartWrapper}>
        {/* Y-Axis Labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.yAxisLabel}>100</Text>
          <Text style={styles.yAxisLabel}>75</Text>
          <Text style={styles.yAxisLabel}>50</Text>
          <Text style={styles.yAxisLabel}>25</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {/* Bars */}
        <View style={styles.chartContent}>
          <View style={styles.barsContainer}>
            {data.map((point, index) => {
              const value = activeTab === 'gir' ? point.gir : 28;
              const heightPercent = (value / 100) * 100;

              return (
                <View key={`bar-${index}`} style={styles.barWrapper}>
                  <View style={styles.barStack}>
                    {/* Bar */}
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPercent}%`,
                        },
                      ]}
                    >
                      {/* Dot on top */}
                      <View style={styles.dot} />
                    </View>
                  </View>
                  {/* Label */}
                  <Text style={styles.barLabel}>{point.name}</Text>
                </View>
              );
            })}
          </View>

          {/* Grid lines background */}
          <View style={styles.gridLines}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>
          Bars represent {activeTab === 'gir' ? 'GIR%' : 'Putting Avg'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.lg,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  chartIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.lightGray,
  },
  tabActive: {
    backgroundColor: Colors.purple,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  tabLabelActive: {
    color: Colors.white,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 220,
    marginBottom: Spacing.lg,
    marginTop: Spacing.md,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    marginRight: Spacing.sm,
    width: 35,
    height: '100%',
  },
  yAxisLabel: {
    fontSize: 10,
    color: Colors.gray,
    textAlign: 'right',
    fontWeight: '500',
  },
  chartContent: {
    flex: 1,
    backgroundColor: 'rgba(99, 82, 255, 0.02)',
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-around',
    pointerEvents: 'none',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  barStack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    maxWidth: 40,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.purple,
    borderRadius: BorderRadius.md,
    opacity: 0.6,
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.purple,
    marginTop: -4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  barLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.purple,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  legend: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  legendText: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
  },
});
