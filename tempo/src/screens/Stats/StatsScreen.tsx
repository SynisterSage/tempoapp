/**
 * Stats Screen - Performance Analytics
 * Round history, trends, scoring stats
 * 
 * Easy to switch between mock data and API:
 * Edit mockStatsData.ts STATS_CONFIG.USE_MOCK_DATA to toggle
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { UserStats } from '../../types/models';
import {
  getStatsData,
  ScoringCorrelationDataPoint,
  STATS_CONFIG,
} from '../../data/mockStatsData';
import StatsIndexCard from '../../components/stats/StatsIndexCard';
import { ScoringCorrelations } from '../../components/stats/ScoringCorrelations';
import { StatsBreakdown } from '../../components/stats/StatsBreakdown';

type Props = MainTabScreenProps<'StatsTab'>;

interface StatsData {
  userStats: UserStats;
  scoringCorrelations: ScoringCorrelationDataPoint[];
}

export const StatsScreen = ({ navigation }: Props) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getStatsData();
      setStats({
        userStats: data.userStats,
        scoringCorrelations: data.scoringCorrelations,
      });
      setError(null);
    } catch (err) {
      setError('Failed to load stats');
      console.error('Stats loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsPress = () => {
    navigation.navigate('SettingsTab');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleRefresh = () => {
    loadStats();
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.white }]}
        edges={[]}
      >
        <Header
          title="statistics"
          onSettingsPress={handleSettingsPress}
          onNotificationPress={handleNotificationPress}
          notificationBadge={0}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !stats) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors.white }]}
        edges={[]}
      >
        <Header
          title="statistics"
          onSettingsPress={handleSettingsPress}
          onNotificationPress={handleNotificationPress}
          notificationBadge={0}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text
            style={styles.retryText}
            onPress={handleRefresh}
          >
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.white }]}
      edges={[]}
    >
      <Header
        title="statistics"
        onSettingsPress={handleSettingsPress}
        onNotificationPress={handleNotificationPress}
        notificationBadge={0}
      />

      {/* Debug Info - Show data source */}
      {__DEV__ && (
        <View style={styles.debugBanner}>
          <Text style={styles.debugText}>
            📊 Using {STATS_CONFIG.USE_MOCK_DATA ? 'MOCK' : 'API'} data
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Recent Activity Stats Cards (hero row) */}
        <View style={styles.heroRow}>
          <StatsIndexCard
            label="Index"
            value={stats.userStats.currentHandicap}
            subtitle="HCP"
            tags={[`HCP`]}
            onPress={() => {}}
          />
          <StatsIndexCard
            label="AVG Score"
            value={Math.round(stats.userStats.averageScore * 10) / 10}
            subtitle="Last 5"
            tags={[`↘ 0.2`]}
            onPress={() => {}}
          />
          <StatsIndexCard
            label="BEST Rnd"
            value={stats.userStats.lowestScore}
            subtitle="Recent"
            tags={[`2 wk`]}
            onPress={() => {}}
          />
        </View>

        {/* Scoring Correlations Chart */}
        <ScoringCorrelations data={stats.scoringCorrelations} />

        {/* Detailed Stats Breakdown */}
        <StatsBreakdown stats={stats.userStats} />

        {/* Footer spacing */}
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  retryText: {
    fontSize: 14,
    color: Colors.purple,
    fontWeight: '600',
    padding: Spacing.md,
  },
  debugBanner: {
    backgroundColor: '#fef3c7',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#fcd34d',
  },
  debugText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
    textAlign: 'center',
  },
  footerSpacer: {
    height: Spacing.xl,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.xs,
  },
});
