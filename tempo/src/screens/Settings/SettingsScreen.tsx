/**
 * Settings Screen - Profile, Bag Setup, Preferences
 * User settings and configuration
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabScreenProps } from '../../navigation/types';
import { Header } from '../../components/common/Header';
import { Colors } from '../../theme/colors';
import { Spacing, BorderRadius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

type Props = MainTabScreenProps<'SettingsTab'>;

interface SettingOption {
  id: string;
  label: string;
  value?: string;
  type: 'toggle' | 'select' | 'button';
  icon?: string;
}

export const SettingsScreen = ({ navigation }: Props) => {
  const [distanceUnit, setDistanceUnit] = useState<'Y' | 'M'>('Y');
  const [handedness, setHandedness] = useState<'L' | 'R'>('L');
  const [haptics, setHaptics] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.white }]} edges={[]}>
      <Header
        title="settings"
        onBackPress={handleBackPress}
        showBackButton={true}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Card */}
        <View style={[styles.profileCard, Shadows.md]}>
          <View style={styles.profileImageContainer}>
            <Icon name="account-circle" size={60} color={Colors.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Chris Becker</Text>
            <Text style={styles.profileSubtitle}>Pro License • HCP 12</Text>
          </View>
        </View>

        {/* My Bag Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Bag</Text>
          
          {/* Active Setup Card */}
          <View style={[styles.card, Shadows.sm]}>
            <View style={styles.cardHeader}>
              <View style={styles.bagIconContainer}>
                <Icon name="bag-personal" size={24} color={Colors.purple} />
              </View>
              <View style={styles.bagHeaderContent}>
                <Text style={styles.bagSetupName}>Active Setup</Text>
              </View>
              <View style={styles.clubsBadge}>
                <Text style={styles.clubsCount}>14 Clubs</Text>
              </View>
            </View>

            {/* Club Stats Grid */}
            <View style={styles.clubsGrid}>
              <View style={styles.clubStat}>
                <Text style={styles.clubLabel}>Driver</Text>
                <Text style={styles.clubDistance}>275y</Text>
              </View>
              <View style={styles.clubStat}>
                <Text style={styles.clubLabel}>7i</Text>
                <Text style={styles.clubDistance}>174</Text>
              </View>
              <View style={styles.clubStat}>
                <Text style={styles.clubLabel}>PW</Text>
                <Text style={styles.clubDistance}>135y</Text>
              </View>
            </View>

            {/* Manage Bag Button */}
            <TouchableOpacity style={[styles.manageBagButton, { backgroundColor: Colors.purple }]}>
              <Text style={styles.manageBagButtonText}>Manage Bag</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Bag Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Bag</Text>
          
          {/* Settings Card */}
          <View style={[styles.settingsCard, Shadows.sm]}>
            {/* Distance Units */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Distance Units</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    distanceUnit === 'Y' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setDistanceUnit('Y')}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      distanceUnit === 'Y' && styles.toggleButtonTextActive,
                    ]}
                  >
                    Y
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    distanceUnit === 'M' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setDistanceUnit('M')}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      distanceUnit === 'M' && styles.toggleButtonTextActive,
                    ]}
                  >
                    M
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Handedness */}
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Handedness</Text>
              <View style={styles.toggleGroup}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    handedness === 'L' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHandedness('L')}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      handedness === 'L' && styles.toggleButtonTextActive,
                    ]}
                  >
                    L
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    handedness === 'R' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setHandedness('R')}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      handedness === 'R' && styles.toggleButtonTextActive,
                    ]}
                  >
                    R
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Notifications & Haptics */}
            <View style={[styles.settingItem, { marginBottom: 0 }]}>
              <Text style={styles.settingLabel}>Notifications & Haptics</Text>
              <Switch
                value={haptics}
                onValueChange={setHaptics}
                trackColor={{ false: Colors.lightGray, true: Colors.myrtle }}
                thumbColor={haptics ? Colors.purple : Colors.gray}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={[styles.settingsCard, Shadows.sm]}>
            {/* Manage Subscriptions */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Manage Subscriptions</Text>
              <Icon name="chevron-right" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Contact Support */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Contact Support</Text>
              <Icon name="chevron-right" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Privacy & Data */}
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Privacy & Data</Text>
              <Icon name="chevron-right" size={20} color={Colors.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: Colors.purple }]}>
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Version Footer */}
        <Text style={styles.versionText}>tempo v1.0.0</Text>
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
    backgroundColor: Colors.pale,
  },
  profileCard: {
    backgroundColor: Colors.purple,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  profileImageContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.md,
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  bagIconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.pale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bagHeaderContent: {
    flex: 1,
  },
  bagSetupName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  clubsBadge: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  clubsCount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  clubsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: Spacing.lg,
  },
  clubStat: {
    alignItems: 'center',
  },
  clubLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  clubDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.purple,
  },
  manageBagButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manageBagButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  toggleGroup: {
    flexDirection: 'row',
    gap: Spacing.xs,
    backgroundColor: Colors.pale,
    padding: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  toggleButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    minWidth: 40,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.purple,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
  },
  toggleButtonTextActive: {
    color: Colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  logoutButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  versionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.gray,
    textAlign: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
});
