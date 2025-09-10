import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useRNColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemePreferenceContextValue = {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  resolvedScheme: 'light' | 'dark';
  toggleLightDark: () => void;
};

const STORAGE_KEY = '@aair.theme.preference.v1';

export const ThemePreferenceContext = createContext<ThemePreferenceContextValue | undefined>(
  undefined
);

export function ThemePreferenceProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useRNColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const resolvedScheme: 'light' | 'dark' =
    preference === 'system' ? (systemScheme ?? 'light') : preference;

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setPreferenceState(stored);
        }
      } catch {}
    };
    void load();
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    void AsyncStorage.setItem(STORAGE_KEY, pref).catch(() => {});
  }, []);

  const toggleLightDark = useCallback(() => {
    const next = resolvedScheme === 'dark' ? 'light' : 'dark';
    setPreference(next);
  }, [resolvedScheme, setPreference]);

  const value = useMemo(
    () => ({ preference, setPreference, resolvedScheme, toggleLightDark }),
    [preference, setPreference, resolvedScheme, toggleLightDark]
  );

  return <ThemePreferenceContext.Provider value={value}>{children}</ThemePreferenceContext.Provider>;
}


