import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemePreferenceContext } from '@/contexts/ThemePreferenceProvider';

export function useColorScheme() {
  const themeContext = useContext(ThemePreferenceContext);
  const systemScheme = useRNColorScheme();
  
  // If we have theme preference context, use it
  if (themeContext) {
    return themeContext.resolvedScheme;
  }
  
  // Fallback to system scheme (for when provider isn't available)
  return systemScheme ?? 'light';
}
