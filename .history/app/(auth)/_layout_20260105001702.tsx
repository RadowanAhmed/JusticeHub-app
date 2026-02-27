import { useAuth } from '@/contexts/AuthContext';
import { Redirect, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, I18nManager, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export default function AuthLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const { colors } = useTheme();
  
  const isRTL = I18nManager.isRTL;

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(main)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: isRTL ? 'slide_from_left' : 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: t('common.login'),
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: t('common.signup'),
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: t('auth.resetPassword'),
        }} 
      />
      <Stack.Screen 
        name="verify-token" 
        options={{ 
          title: t('auth.verifyToken'),
        }} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={{ 
          title: t('auth.resetPassword'),
        }} 
      />
    </Stack>
  );
}