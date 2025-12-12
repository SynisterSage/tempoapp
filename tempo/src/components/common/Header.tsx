/**
 * Header Component
 * Reusable header for all screens with title, notification, and settings
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Shadows } from '../../theme/shadows';
import { Colors } from '../../theme/colors';

interface HeaderProps {
  title: string;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
  notificationBadge?: number;
  onBackPress?: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onNotificationPress,
  onSettingsPress,
  notificationBadge,
  onBackPress,
  showBackButton = false,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.headerWrapper, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          {showBackButton ? (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Icon name="chevron-left" size={28} color={Colors.navy} />
            </TouchableOpacity>
          ) : null}
          
          <RNText
            style={[styles.title, { color: Colors.purple }]}
            numberOfLines={1}
          >
            {title}
          </RNText>

          {!showBackButton && (
            <View style={styles.iconContainer}>
              {/* Notification Bell */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onNotificationPress}
                activeOpacity={0.7}
              >
                <Icon name="bell-outline" size={24} color={Colors.navy} />
                {notificationBadge && notificationBadge > 0 && (
                  <View style={[styles.badge, { backgroundColor: Colors.error }]}>
                    <RNText style={styles.badgeText}>
                      {notificationBadge > 9 ? '9+' : notificationBadge}
                    </RNText>
                  </View>
                )}
              </TouchableOpacity>

              {/* Settings Gear */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onSettingsPress}
                activeOpacity={0.7}
              >
                <Icon name="cog-outline" size={24} color={Colors.navy} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  title: {
    fontFamily: 'Tovar-Kolobov',
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
