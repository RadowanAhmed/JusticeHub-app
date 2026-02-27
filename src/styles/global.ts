// apps/mobile/src/styles/global.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryDark: '#1e3a8a',
  secondary: '#10b981',
  secondaryLight: '#34d399',
  secondaryDark: '#059669',
  danger: '#ef4444',
  warning: '#f59e0b',
  success: '#10b981',
  info: '#3b82f6',
  light: '#f8fafc',
  dark: '#1e293b',
  gray: '#64748b',
  grayLight: '#e2e8f0',
  grayDark: '#475569',
  white: '#ffffff',
  black: '#000000',
  background: '#f1f5f9',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  textLight: '#64748b',
  textDark: '#0f172a',
  red: '#ef4444', // #ef4444
  green: '#10b981', // #10b981
  blue: '#3b82f6', // #3b82f6
  yellow: '#f59e0b', // #f59e0b
  orange: '#f97316', // #f97316
  purple: '#8b5cf6', // #8b5cf6
  pink: '#ec4899', // #ec4899
  transparent: 'transparent',
  textSecondary: '#475569',
};
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.grayLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  inputText: {
    fontSize: 16,
    color: colors.text,
  },
  error: {
    color: colors.red,
    fontSize: 14,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    
  }
});




export const fontWeights = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: fontWeights.bold,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: fontWeights.bold,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: fontWeights.normal,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: fontWeights.normal,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: fontWeights.normal,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: fontWeights.semibold,
    lineHeight: 24,
  },
  input: {
    fontSize: 16,
    fontWeight: fontWeights.normal,
    lineHeight: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: fontWeights.normal,
    lineHeight: 20,
  },
  md: 18,
  sm: 14,
  lg: 20,
  xl: 24,
  xs: 12,
  xxl: 28,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
};

// إضافة هذا إلى global.ts إذا لم يكن موجوداً
export const shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
  textRight: {
    textAlign: 'right',
  },
  textLeft: {
    textAlign: 'left',
  },
  hidden: {
    display: 'none',
  },
  absolute: {
    position: 'absolute',
  },
  relative: {
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  ...globalStyles,
};
