// contexts/ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Colors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Secondary colors
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  
  // Accent colors
  accent: string;
  danger: string;
  warning: string;
  info: string;
  success: string;
  
  // Background colors
  background: string;
  card: string;
  surface: string;
  elevated: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Border colors
  border: string;
  borderLight: string;
  borderDark: string;
  
  // State colors
  disabled: string;
  overlay: string;
  
  // Specific colors
  rating: string;
  verified: string;
  progress: string;
  
  // Shadows
  shadowColor: string;
}

export interface ThemeContextType {
  theme: ThemeMode;
  isDarkMode: boolean;
  toggleTheme: (mode: ThemeMode) => Promise<void>;
  colors: Colors;
}

const lightColors: Colors = {
  // Primary colors
  primary: '#3b82f6',
  primaryLight: '#60a5fa',
  primaryDark: '#2563eb',
  
  // Secondary colors
  secondary: '#10b981',
  secondaryLight: '#34d399',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#8b5cf6',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#06b6d4',
  success: '#10b981',
  
  // Background colors
  background: '#f8fafc',
  card: '#ffffff',
  surface: '#ffffff',
  elevated: '#f1f5f9',
  
  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  
  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  
  // State colors
  disabled: '#94a3b8',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Specific colors
  rating: '#fbbf24',
  verified: '#10b981',
  progress: '#3b82f6',
  
  // Shadows
  shadowColor: '#000000',
};

// In your ThemeContext.tsx, update the darkColors to be less harsh:
const darkColors: Colors = {
  // Primary colors
  primary: '#60a5fa',
  primaryLight: '#93c5fd',
  primaryDark: '#3b82f6',
  
  // Secondary colors
  secondary: '#34d399',
  secondaryLight: '#6ee7b7',
  secondaryDark: '#10b981',
  
  // Accent colors
  accent: '#a78bfa',
  danger: '#f87171',
  warning: '#fbbf24',
  info: '#22d3ee',
  success: '#34d399',
  
  // Background colors - Lighter dark mode
  background: '#1a202c', // Changed from #0f172a
  card: '#2d3748', // Changed from #1e293b
  surface: '#2d3748', // Changed from #1e293b
  elevated: '#374151', // Changed from #334155
  
  // Text colors
  textPrimary: '#f7fafc', // Brighter text
  textSecondary: '#cbd5e0',
  textTertiary: '#a0aec0',
  textInverse: '#1a202c',
  
  // Border colors
  border: '#4a5568', // Lighter borders
  borderLight: '#2d3748',
  borderDark: '#718096',
  
  // State colors
  disabled: '#718096',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Specific colors
  rating: '#fbbf24',
  verified: '#34d399',
  progress: '#60a5fa',
  
  // Shadows
  shadowColor: '#000000',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colors, setColors] = useState<Colors>(lightColors);

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Update when theme or system color scheme changes
  useEffect(() => {
    updateTheme();
  }, [theme, systemColorScheme]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@orient_theme');
      if (savedTheme) {
        setTheme(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const updateTheme = () => {
    let shouldUseDarkMode = false;
    
    if (theme === 'system') {
      shouldUseDarkMode = systemColorScheme === 'dark';
    } else {
      shouldUseDarkMode = theme === 'dark';
    }
    
    setIsDarkMode(shouldUseDarkMode);
    setColors(shouldUseDarkMode ? darkColors : lightColors);
  };

  const toggleTheme = async (mode: ThemeMode) => {
    setTheme(mode);
    try {
      await AsyncStorage.setItem('@orient_theme', mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useDarkMode = () => {
  const { isDarkMode, colors } = useTheme();
  return { isDarkMode, colors };
};