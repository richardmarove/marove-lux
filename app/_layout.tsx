import { Stack } from 'expo-router';
import { useFonts, PlayfairDisplay_600SemiBold } from '@expo-google-fonts/playfair-display';
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { theme } from '../theme/theme';
import { StatusBar } from 'expo-status-bar';
import { DataProvider } from '../context/DataContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, DarkTheme } from '@react-navigation/native';
import * as SystemUI from 'expo-system-ui';

SplashScreen.preventAutoHideAsync();

// Custom Navigation Theme to match our app design
const NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.surface,
    card: theme.colors.surface,
    text: theme.colors.textPrimary,
    border: theme.colors.surfacePressed,
    primary: theme.colors.accent,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    // Set system-level background color as early as possible
    SystemUI.setBackgroundColorAsync(theme.colors.surface);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <ThemeProvider value={NavigationTheme}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.accent,
              headerTitleStyle: {
                fontFamily: theme.typography.fonts.heading,
              },
              contentStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerShadowVisible: false,
            }}
          >
            <Stack.Screen name="index" options={{ title: "Marove's Lux" }} />
            <Stack.Screen name="deck/[id]" options={{ title: 'Deck' }} />
            <Stack.Screen name="study/[id]" options={{ title: 'Study', presentation: 'fullScreenModal' }} />
            <Stack.Screen name="add-card/[deckId]" options={{ title: 'Add Card', presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
