/**
 * Root Navigator
 * Main navigation structure with auth flow
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { lightTheme, darkTheme } from '../theme';
import { Colors } from '../theme/colors';
import { useAuth } from '../store/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const { user, userProfile, loading } = useAuth();

  // Determine which screen to show
  const isAuthenticated = !!user;
  const profileCompleted = userProfile?.profile_completed ?? false;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.navy }}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            // Auth Stack
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
            />
          ) : !profileCompleted ? (
            // Profile Setup Stack
            <Stack.Screen
              name="Auth"
              component={AuthNavigator}
            />
          ) : (
            // Main App Stack
            <Stack.Screen
              name="Main"
              component={TabNavigator}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
