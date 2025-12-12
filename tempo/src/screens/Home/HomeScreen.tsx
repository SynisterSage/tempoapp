/**
 * Home Screen - Dashboard
 * Shows featured course, recent rounds, tips, score index, and training drills
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { FeaturedCourseCard } from '../../components/home/FeaturedCourseCard';
import { CaddyTipCard } from '../../components/home/CaddyTipCard';
import { ScoreIndexCard } from '../../components/home/ScoreIndexCard';
import { RecentActivityCards } from '../../components/home/RecentActivityCards';
import { TrainingLabSection } from '../../components/home/TrainingLabSection';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { mockHomeScreenData } from '../../services/mockData';
import { HomeScreenData } from '../../types/home';

type Props = MainTabScreenProps<'HomeTab'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [data, setData] = useState<HomeScreenData>(mockHomeScreenData);

  useEffect(() => {
    // TODO: Replace with actual API call
    // Example: const homeData = await fetchHomeScreenData();
    // setData(homeData);
  }, []);

  const handleSettingsPress = () => {
    navigation.navigate('SettingsTab');
  };

  const handleNotificationPress = () => {
    // TODO: Navigate to notifications screen or show notification center
    console.log('Notification pressed');
  };

  const handleCoursePress = () => {
    // TODO: Navigate to course details or start round
    console.log('Featured course pressed');
  };

  const handleActivityPress = (roundId: string) => {
    // TODO: Navigate to round details
    console.log('Round pressed:', roundId);
  };

  const handleTrainingDrillPress = (drillId: string) => {
    // TODO: Navigate to training drill
    console.log('Training drill pressed:', drillId);
  };

  const handleSeeAllDrills = () => {
    // TODO: Navigate to all drills / create drill screen
    console.log('See all drills pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]} edges={[]}>
      <Header
        title="tempo"
        onSettingsPress={handleSettingsPress}
        onNotificationPress={handleNotificationPress}
        notificationBadge={0}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Featured Course Card */}
        <FeaturedCourseCard course={data.featuredCourse} onPress={handleCoursePress} />

        {/* Caddy Tip & Score Index - 2 Column Grid */}
        <View style={styles.cardsGrid}>
          <View style={styles.tipCardWrapper}>
            <CaddyTipCard tip={data.caddyTip} />
          </View>
          <View style={styles.scoreCardWrapper}>
            <ScoreIndexCard scoreData={data.scoreData} />
          </View>
        </View>

        {/* Recent Activity Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionLink}>History</Text>
        </View>

        {/* Recent Activity Cards */}
        <RecentActivityCards
          rounds={data.recentActivity}
          onPress={(round) => handleActivityPress(round.id)}
        />

        {/* Training Lab Section */}
        <TrainingLabSection
          drills={data.trainingDrills}
          onDrillPress={(drill) => handleTrainingDrillPress(drill.id)}
          onSeeAllPress={handleSeeAllDrills}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  cardsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tipCardWrapper: {
    flex: 1.2,
  },
  scoreCardWrapper: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.purple,
  },
});
