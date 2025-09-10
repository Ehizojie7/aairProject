import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme as useSystemColorScheme } from 'react-native';
import { TasksProvider } from '@/contexts/TasksProvider';
import { ThemePreferenceProvider } from '@/contexts/ThemePreferenceProvider';
import { useThemePreference } from '@/hooks/useThemePreference';

function InnerApp() {
  const { resolvedScheme } = useThemePreference();
  return (
    <ThemeProvider value={resolvedScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TasksProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </TasksProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // Keep system color scheme hook loaded to ensure fonts and hydration work similarly across platforms
  useSystemColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemePreferenceProvider>
      <InnerApp />
    </ThemePreferenceProvider>
  );
}
