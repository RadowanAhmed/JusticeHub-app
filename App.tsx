// apps/mobile/App.tsx
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { AuthProvider } from '@/contexts/AuthContext';
import { Slot } from 'expo-router';
import RTLWrapper from '@/components/RTLWrapper';
import { I18nManager } from 'react-native';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Initialize RTL based on current language
        const currentLang = i18n.language;
        const isRTL = currentLang === 'ar';
        
        if (isRTL && !I18nManager.isRTL) {
          I18nManager.forceRTL(true);
          I18nManager.allowRTL(true);
        } else if (!isRTL && I18nManager.isRTL) {
          I18nManager.forceRTL(false);
          I18nManager.allowRTL(false);
        }
        
        setAppIsReady(true);
      } catch (e) {
        console.warn('Error initializing app:', e);
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e40af' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <RTLWrapper>
              <StatusBar style="auto" />
              <Slot />
            </RTLWrapper>
          </AuthProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}