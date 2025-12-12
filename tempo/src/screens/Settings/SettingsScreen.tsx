/**
 * Settings Screen - Profile, Bag Setup, Preferences
 * User settings and configuration
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { Colors } from '../../theme/colors';

type Props = MainTabScreenProps<'SettingsTab'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const handleNotificationPress = () => {
    console.log('Notification pressed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]} edges={[]}>
      <Header
        title="settings"
        onNotificationPress={handleNotificationPress}
        notificationBadge={0}
      />
      <View style={styles.content}>
        <Text variant="bodyMedium" style={{ color: Colors.darkGray, marginTop: 8 }}>
          Profile, bag setup, and preferences
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
