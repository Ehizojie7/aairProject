import { useContext } from 'react';
import { ThemePreferenceContext } from '@/contexts/ThemePreferenceProvider';

export function useThemePreference() {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return ctx;
}


