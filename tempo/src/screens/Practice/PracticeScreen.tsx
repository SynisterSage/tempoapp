/**
 * Practice Screen - Range Mode & Drill Tracking
 * Practice session tracking and drill recommendations
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import {
  mockCoachInsight,
  mockTrainingTools,
  mockActiveDrills,
  mockNextRecommendedDrill,
} from '../../data/mockPracticeData';

type Props = MainTabScreenProps<'PracticeTab'>;

const SCREEN_WIDTH = Dimensions.get('window').width;

export const PracticeScreen = ({ navigation }: Props) => {
  const [selectedDrill, setSelectedDrill] = useState<string | null>(null);

  const handleSettingsPress = () => {
    navigation.navigate('SettingsTab');
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  const handleToolPress = (toolId: string) => {
    console.log('Tool pressed:', toolId);
  };

  const handleDrillPress = (drillId: string) => {
    setSelectedDrill(drillId);
    console.log('Drill pressed:', drillId);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]} edges={[]}>
      <Header
        title="practice"
        onSettingsPress={handleSettingsPress}
        onNotificationPress={handleNotificationPress}
        notificationBadge={0}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Section Title: AI-Driven Improvement */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI-Driven Improvement by Tempo</Text>
        </View>

        {/* AI Coach Insight Card */}
        <TouchableOpacity
          style={styles.coachInsightCard}
          onPress={() => console.log('Coach insight pressed')}
          activeOpacity={0.9}
        >
          <View style={styles.coachInsightHeader}>
            <Text style={styles.coachLabel}>📈 AI Coach Insight</Text>
          </View>

          <Text style={styles.coachInsightText}>
            <Text>"Hi Chris, I analyzed your round at Torrey Pines. You're </Text>
            <Text style={styles.highlightedText}>losing</Text>
            <Text> strokes off the tee due to a </Text>
            <Text style={styles.highlightedText}>slice miss pattern</Text>
            <Text> (avg 15y Right)."</Text>
          </Text>

          {/* Tempo Rhythm Check Tool */}
          <TouchableOpacity
            style={styles.rhythmCheckCard}
            onPress={() => handleToolPress('tool-001')}
            activeOpacity={0.85}
          >
            <View style={styles.rhythmCheckContent}>
              <Text style={styles.rhythmCheckIcon}>⊙</Text>
              <View style={styles.rhythmCheckText}>
                <Text style={styles.rhythmCheckTitle}>Tempo Rhythm Check</Text>
                <Text style={styles.rhythmCheckSubtitle}>Driving • 10 min</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handleToolPress('tool-001')}
              activeOpacity={0.7}
            >
              <Text style={styles.playButtonText}>▶</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Ask About Swing Button */}
          <TouchableOpacity
            style={styles.askButton}
            onPress={() => console.log('Ask about swing')}
            activeOpacity={0.85}
          >
            <Text style={styles.askButtonText}>Ask about your swing...</Text>
            <Text style={styles.askButtonIcon}>💬</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Training Tools Section */}
        <View style={styles.trainingToolsSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Training Tools</Text>
            <TouchableOpacity onPress={() => console.log('All Tools')}>
              <Text style={styles.allLink}>All Tools</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.toolsGrid}>
            {mockTrainingTools.slice(1).map((tool) => (
              <TouchableOpacity
                key={tool.id}
                style={styles.toolCard}
                onPress={() => handleToolPress(tool.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.toolIcon}>{tool.icon}</Text>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Training Lab Section */}
        <View style={styles.trainingLabSection}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Training Lab</Text>
            <TouchableOpacity onPress={() => console.log('All Drills')}>
              <Text style={styles.allLink}>All Drills</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={mockActiveDrills}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.drillCard,
                  selectedDrill === item.id && styles.drillCardActive,
                ]}
                onPress={() => handleDrillPress(item.id)}
                activeOpacity={0.85}
              >
                <View style={styles.drillCardContent}>
                  <Text style={styles.drillName}>{item.name}</Text>
                  <Text style={styles.drillDescription}>{item.description}</Text>
                  <View style={styles.drillMeta}>
                    <Text style={styles.drillCategory}>{item.category}</Text>
                    <Text style={styles.drillTime}>⏱ {item.estimatedTime} min</Text>
                  </View>
                </View>
                <Text style={styles.drillArrow}>→</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },

  // Section Headers
  sectionHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 24,
  },
  allLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },

  // Coach Insight Card
  coachInsightCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E9D5FF',
  },
  coachInsightHeader: {
    marginBottom: 12,
  },
  coachLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  coachInsightText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    lineHeight: 22,
    marginBottom: 16,
  },
  highlightedText: {
    color: '#6366F1',
    fontWeight: '700',
  },

  // Rhythm Check Card
  rhythmCheckCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rhythmCheckContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rhythmCheckIcon: {
    fontSize: 32,
    marginRight: 12,
    color: '#6366F1',
  },
  rhythmCheckText: {
    flex: 1,
  },
  rhythmCheckTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  rhythmCheckSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },

  // Ask Button
  askButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  askButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  askButtonIcon: {
    fontSize: 16,
  },

  // Training Tools Section
  trainingToolsSection: {
    marginTop: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  toolCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  toolIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  toolName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  toolDescription: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6366F1',
    textAlign: 'center',
    lineHeight: 15,
  },

  // Training Lab Section
  trainingLabSection: {
    marginTop: 8,
  },
  drillCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  drillCardActive: {
    backgroundColor: '#EDE9FE',
    borderColor: '#6366F1',
  },
  drillCardContent: {
    flex: 1,
  },
  drillName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  drillDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  drillMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drillCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#E0E7FF',
    borderRadius: 4,
  },
  drillTime: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  drillArrow: {
    fontSize: 18,
    color: '#D1D5DB',
    marginLeft: 12,
  },

  bottomSpacer: {
    height: 20,
  },
});
