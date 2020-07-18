import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './src/hooks/useCachedResources';
import Navigation from './src/navigation';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Colors from './src/constants/Colors';

import {AuthProvider} from './src/contexts/auth';

export default function App() {
  const isLoadingComplete = useCachedResources();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors['light'].tint,
    },
  };

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={theme}>
        <AuthProvider>
          <SafeAreaProvider>
            <Navigation/>
            <StatusBar />
          </SafeAreaProvider>
        </AuthProvider>
      </PaperProvider>
    );
  }
}
