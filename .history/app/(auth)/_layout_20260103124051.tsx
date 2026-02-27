// apps/mobile/app/(auth)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  
  const isRTL = I18nManager.isRTL;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e40af" />
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
          backgroundColor: '#FFFFFF',
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