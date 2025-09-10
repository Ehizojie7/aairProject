import { useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemePreferenceContext } from '@/contexts/ThemePreferenceProvider';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const themeContext = useContext(ThemePreferenceContext);
  const systemScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  if (hasHydrated) {
    // If we have theme preference context, use it
    if (themeContext) {
      return themeContext.resolvedScheme;
    }
    // Fallback to system scheme
    return systemScheme;
  }

  return 'light';
}
