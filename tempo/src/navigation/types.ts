/**
 * Navigation Types
 * TypeScript types for React Navigation
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * Auth Stack Navigator Params
 */
export type AuthStackParamList = {
  Preloader: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ProfileSetup: undefined;
};

/**
 * Root Stack Navigator Params
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

/**
 * Bottom Tab Navigator Params
 */
export type MainTabParamList = {
  HomeTab: undefined;
  PlayTab: undefined;
  StatsTab: undefined;
  PracticeTab: undefined;
  SettingsTab: undefined;
};

/**
 * Screen Props Types
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
