/**
 * Bottom Tab Navigator
 * Main app navigation with 4 tabs + centered quick actions button
 * Layout: [Home Play] [+ GAP +] [Practice Stats]
 */

import React, { useState, useRef, useEffect } from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, TouchableOpacity, Dimensions, Text, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'react-native-paper';

import { MainTabParamList } from './types';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { PlayScreen } from '../screens/Play/PlayScreen';
import { StatsScreen } from '../screens/Stats/StatsScreen';
import { PracticeScreen } from '../screens/Practice/PracticeScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { QuickActionsModal } from '../components/common/QuickActionsModal';
import { Colors } from '../theme/colors';
import { Shadows } from '../theme/shadows';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Bar Component for split layout
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const animatedPosition = useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = 70;
  const leftSideWidth = tabWidth * 2 + 16; // 2 tabs + left/right padding
  const centerWidth = screenWidth - leftSideWidth - tabWidth * 2 - 16; // Space for center gap
  const rightSideStartX = leftSideWidth + centerWidth;

  useEffect(() => {
    let translateX = 0;
    // Determine if Settings (hidden) tab is active
    const isSettingsActive = state.routes[state.index]?.name === 'SettingsTab';

    // Calculate position based on active tab
    if (state.index === 0) {
      translateX = 8; // Left padding
    } else if (state.index === 1) {
      translateX = 8 + tabWidth; // First tab + padding
    } else if (state.index === 2) {
      // Right side first tab (practice)
      translateX = rightSideStartX + 8;
    } else if (state.index === 3) {
      // Right side second tab (stats)
      translateX = rightSideStartX + 8 + tabWidth;
    }

    // If Settings is active we don't want the accent bar visible — leave position but hide via opacity
    Animated.spring(animatedPosition, {
      toValue: translateX,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  }, [state.index]);

  const renderTabButton = (route: any, actualIndex: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === actualIndex;
    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={styles.tabButton}
        activeOpacity={0.7}
      >
        <View style={styles.tabIconLabelContainer}>
          {options.tabBarIcon ? (
            options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? Colors.purple : '#9CA3AF',
              size: 32,
            })
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabBarWrapper}>
      {/* Animated accent bar */}
      <Animated.View
        style={[
          styles.accentBar,
          {
            transform: [{ translateX: animatedPosition }],
            opacity: state.routes[state.index]?.name === 'SettingsTab' ? 0 : 1,
          },
        ]}
      />
      
      <View style={styles.tabBarContainer}>
        {/* LEFT SIDE: Home and Play */}
        <View style={styles.tabBarLeftSide}>
          {renderTabButton(state.routes[0], 0)}
          {renderTabButton(state.routes[1], 1)}
        </View>

        {/* CENTER: Empty space for FAB */}
        <View style={styles.tabBarCenter} />

        {/* RIGHT SIDE: Practice and Stats */}
        <View style={styles.tabBarRightSide}>
          {renderTabButton(state.routes[2], 2)}
          {renderTabButton(state.routes[3], 3)}
        </View>
      </View>
    </View>
  );
}

export function TabNavigator() {
  const theme = useTheme();
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Animated values for each action card
  const notesAnim = useRef(new Animated.Value(0)).current;
  const uploadAnim = useRef(new Animated.Value(0)).current;
  const bagAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showQuickActions) {
      // Animate in - with minimal delay
      Animated.parallel([
        Animated.spring(notesAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 5,
          delay: 0,
        }),
        Animated.spring(uploadAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 5,
          delay: 30,
        }),
        Animated.spring(bagAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 5,
          delay: 60,
        }),
      ]).start();

      // Rotate + to X
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(notesAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(uploadAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(bagAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showQuickActions]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const createTransform = (anim: Animated.Value) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -150],
        }),
      },
      {
        scale: anim,
      },
      {
        opacity: anim,
      },
    ],
  });

  const quickActions = [
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: 'note-outline',
      onPress: () => {
        console.log('Notes action');
      },
    },
    {
      id: 'upload' as const,
      label: 'Upload Score',
      icon: 'cloud-upload-outline',
      onPress: () => {
        console.log('Upload score action');
      },
    },
    {
      id: 'bag' as const,
      label: 'Bag',
      icon: 'bag-outline',
      onPress: () => {
        console.log('Bag action');
      },
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.purple,
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      >
        {/* LEFT SIDE: tempo, play */}
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{
            tabBarLabel: 'tempo',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="PlayTab"
          component={PlayScreen}
          options={{
            tabBarLabel: 'play',
            tabBarIcon: ({ color, size }) => (
              <Icon name="golf" size={size} color={color} />
            ),
          }}
        />

        {/* RIGHT SIDE: practice, statistics */}
        <Tab.Screen
          name="PracticeTab"
          component={PracticeScreen}
          options={{
            tabBarLabel: 'practice',
            tabBarIcon: ({ color, size }) => (
              <Icon name="bullseye" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="StatsTab"
          component={StatsScreen}
          options={{
            tabBarLabel: 'statistics',
            tabBarIcon: ({ color, size }) => (
              <Icon name="chart-box-outline" size={size} color={color} />
            ),
          }}
        />

        {/* Settings - Hidden but accessible via navigation */}
        <Tab.Screen
          name="SettingsTab"
          component={SettingsScreen}
          options={{
            tabBarButton: () => null,
          }}
        />
      </Tab.Navigator>

      {/* Centered Quick Actions Button - Positioned above nav bar */}
      <SafeAreaView
        style={styles.quickActionContainer}
        edges={['bottom']}
        pointerEvents="box-none"
      >
        {/* Floating Action Cards */}
        {/* Left Card - Notes */}
        <Animated.View
          style={[
            styles.quickActionCard,
            {
              transform: [
                {
                  translateX: notesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                  }),
                },
                {
                  translateY: notesAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -90],
                  }),
                },
                { scale: notesAnim },
              ],
              opacity: notesAnim,
            },
            { pointerEvents: showQuickActions ? 'auto' : 'none' },
          ]}
        >
          <TouchableOpacity
            style={[styles.cardButton, { backgroundColor: Colors.purple + '40' }]}
            onPress={() => {
              console.log('Notes action');
              setShowQuickActions(false);
            }}
            activeOpacity={0.8}
          >
            <Icon name="note-outline" size={24} color={Colors.purple} />
          </TouchableOpacity>
        </Animated.View>

        {/* Center Card - Upload */}
        <Animated.View
          style={[
            styles.quickActionCard,
            {
              transform: [
                {
                  translateX: uploadAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0],
                  }),
                },
                {
                  translateY: uploadAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -120],
                  }),
                },
                { scale: uploadAnim },
              ],
              opacity: uploadAnim,
            },
            { pointerEvents: showQuickActions ? 'auto' : 'none' },
          ]}
        >
          <TouchableOpacity
            style={[styles.cardButton, { backgroundColor: Colors.purple + '40' }]}
            onPress={() => {
              console.log('Upload score action');
              setShowQuickActions(false);
            }}
            activeOpacity={0.8}
          >
            <Icon name="cloud-upload-outline" size={24} color={Colors.purple} />
          </TouchableOpacity>
        </Animated.View>

        {/* Right Card - Bag */}
        <Animated.View
          style={[
            styles.quickActionCard,
            {
              transform: [
                {
                  translateX: bagAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 70],
                  }),
                },
                {
                  translateY: bagAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -90],
                  }),
                },
                { scale: bagAnim },
              ],
              opacity: bagAnim,
            },
            { pointerEvents: showQuickActions ? 'auto' : 'none' },
          ]}
        >
          <TouchableOpacity
            style={[styles.cardButton, { backgroundColor: Colors.purple + '40' }]}
            onPress={() => {
              console.log('Bag action');
              setShowQuickActions(false);
            }}
            activeOpacity={0.8}
          >
            <Icon name="bag-outline" size={24} color={Colors.purple} />
          </TouchableOpacity>
        </Animated.View>

        {/* Main FAB Button */}
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
            shadowColor: Colors.purple,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: Colors.purple }]}
            onPress={() => setShowQuickActions(!showQuickActions)}
            activeOpacity={0.8}
          >
            <Icon name="plus" size={28} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: Colors.navy,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 70,
    height: 4,
    backgroundColor: Colors.purple,
    borderRadius: 2,
    zIndex: 1,
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 120,
    paddingBottom: 16,
    paddingTop: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  tabBarLeftSide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 0,
  },
  tabBarCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabBarRightSide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flex: 0,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 92,
    width: 70,
    paddingHorizontal: 0,
  },
  tabIconLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  quickActionContainer: {
    position: 'absolute',
    bottom: 55,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  quickActionCard: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
});
