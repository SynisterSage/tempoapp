/**
 * Practice Screen - Range Mode & Drill Tracking
 * Practice session tracking and drill recommendations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { Colors } from '../../theme/colors';
import { Spacing, Layout } from '../../theme/spacing';
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
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string; role: 'user'|'assistant'; text: string; recommendation?: string}>>([]);
  const [typedHint, setTypedHint] = useState<string>('');
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);
  const HINT_TEXT = 'AI Coach ready — ask about your swing...';

  // Typewriter effect for initial hint. Stops when user starts typing or receives assistant message.
  const timeoutsRef = useRef<number[]>([]);
  const blinkRef = useRef<number | null>(null);
  useEffect(() => {
    // clear any existing timeouts/intervals
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    if (blinkRef.current) {
      clearInterval(blinkRef.current);
      blinkRef.current = null;
    }

    // don't run if user has typed or assistant responded
    if (chatMessages.length > 0 || chatInput.trim().length > 0) {
      setTypedHint(HINT_TEXT);
      setCursorVisible(false);
      return;
    }

    setTypedHint('');
    // schedule timeouts for each character to avoid interval race conditions
    for (let i = 0; i < HINT_TEXT.length; i += 1) {
      const t = setTimeout(() => {
        setTypedHint((prev) => prev + HINT_TEXT[i]);
      }, i * 26) as unknown as number;
      timeoutsRef.current.push(t);
    }

    // blinking cursor
    blinkRef.current = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500) as unknown as number;

    return () => {
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
      if (blinkRef.current) {
        clearInterval(blinkRef.current);
        blinkRef.current = null;
      }
    };
  }, [chatMessages.length, chatInput]);

  const assistantRecommendationId = chatMessages.find((m) => m.role === 'assistant' && m.recommendation)?.recommendation ?? null;
  const lastAssistantMessage = [...chatMessages].reverse().find((m) => m.role === 'assistant') ?? null;

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
        {/* Hero: AI Coach Insight Card (header removed - card only) */}
        <View style={styles.coachInsightWrapper}>
          <View style={styles.coachInsightCardNew}>
            {/* decorative watermark circle */}
            <View style={styles.watermarkCircle} pointerEvents="none" />

            <View style={styles.coachInsightHeaderRow}>
              <View style={styles.coachLabelRow}>
                <Icon name="trending-up" size={18} color={Colors.purple} style={{marginRight:8}} />
                <Text style={styles.coachLabel}>{mockCoachInsight.title}</Text>
              </View>
            </View>

            {/* message area - show last assistant response (do not flash user's message) otherwise show hint */}
            <View style={styles.messageArea}>
              {lastAssistantMessage ? (
                <View style={styles.messageRow}>
                  <Icon name="star" size={16} color={Colors.purple} style={{marginRight:8, marginTop:2}} />
                  <Text style={styles.coachInsightText}>{lastAssistantMessage.text}</Text>
                </View>
              ) : (
                <View style={styles.hintRow}>
                  <Icon name="star" size={14} color={Colors.purple} style={{marginRight:8}} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.hintText}>{typedHint}</Text>
                    <Text style={[styles.cursor, {opacity: cursorVisible ? 1 : 0}]}>|</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Tempo Rhythm Check Tool - shown only when assistant provided a recommendation */}
            {assistantRecommendationId ? (
              <TouchableOpacity
                style={[styles.rhythmCheckCard, styles.rhythmCheckCardElevated]}
                onPress={() => handleToolPress('tool-001')}
                activeOpacity={0.85}
              >
                <View style={styles.rhythmCheckContent}>
                  <Icon name="golf" size={26} color="#6366F1" style={{marginRight:12}} />
                  <View style={styles.rhythmCheckText}>
                    <Text style={styles.rhythmCheckTitle}>{mockNextRecommendedDrill.name}</Text>
                    <Text style={styles.rhythmCheckSubtitle}>{mockNextRecommendedDrill.description}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.playButton, styles.playButtonAlign]}
                  onPress={() => handleToolPress('tool-001')}
                  activeOpacity={0.7}
                >
                  <Icon name="play" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : null}

            {/* Chat input - interactive, ready for LLM integration */}
            <View style={styles.chatInputRow}>
              <TextInput
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Ask about your swing..."
                placeholderTextColor="#9CA3AF"
                style={styles.chatInput}
                returnKeyType="send"
                onSubmitEditing={() => {
                  if (!chatInput.trim()) return;
                  const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: chatInput };
                  setChatMessages((s) => [...s, userMsg]);
                  setChatInput('');
                  // simulate LLM response (mocked plan + recommendation id)
                  setTimeout(() => {
                    const assistantText = `I recommend working on swing tempo and path. Try short sets focusing on a smoother transition and a controlled release.`;
                    const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant' as const, text: assistantText, recommendation: mockNextRecommendedDrill.id };
                    setChatMessages((s) => [...s, assistantMsg]);
                  }, 750);
                }}
              />

              <TouchableOpacity
                style={styles.chatSend}
                onPress={() => {
                  if (!chatInput.trim()) return;
                  const userMsg = { id: `u-${Date.now()}`, role: 'user' as const, text: chatInput };
                  setChatMessages((s) => [...s, userMsg]);
                  setChatInput('');
                  setTimeout(() => {
                    const assistantText = `I recommend working on swing tempo and path. Try short sets focusing on a smoother transition and a controlled release.`;
                    const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant' as const, text: assistantText, recommendation: mockNextRecommendedDrill.id };
                    setChatMessages((s) => [...s, assistantMsg]);
                  }, 750);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.chatSendText}>↩︎</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>

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
  coachInsightWrapper: {
    marginTop: 24,
    marginBottom: 8,
  },
  coachInsightCardNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EDE9FE',
    overflow: 'hidden',
    // stronger yet not-too-low drop shadow for card (reduced vertical offset)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
  },
  watermarkCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#EDE9FE',
    right: -40,
    top: -40,
    opacity: 0.65,
  },
  coachInsightHeaderRow: {
    marginBottom: 8,
    zIndex: 2,
  },
  coachLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  messageArea: {
    marginBottom: 12,
    zIndex: 2,
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
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  rhythmCheckCardElevated: {
    // reduced elevated shadow to be less heavy
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
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

  // Chat / Input
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    zIndex: 2,
  },
  chatInput: {
    flex: 1,
    height: Layout.inputHeightSmall,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  chatSend: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  playButtonAlign: {
    alignSelf: 'center',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintIcon: {
    fontSize: 14,
    color: '#A78BFA',
    marginRight: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messageIcon: {
    fontSize: 16,
    color: '#F59E0B',
    marginRight: 8,
    marginTop: 2,
  },
  cursor: {
    fontSize: 14,
    color: Colors.purple,
    marginLeft: 4,
    height: 18,
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
