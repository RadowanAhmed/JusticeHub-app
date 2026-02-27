import { Tabs } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

// Import components that use hooks
import { CustomTabBar } from '../components/CustomTabBar';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { usePushNotifications } from '@/hooks/usePushNotifications';

// Separate component that uses hooks
function MainLayoutContent() {
  const { isLoading, user } = useAuthCheck();
  const { colors } = useTheme();
    usePushNotifications();


  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: colors.background 
      }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ 
          marginTop: 12, 
          color: colors.textSecondary 
        }}>
          جاري التحميل...
        </Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: 'none',
        },
        animation: 'shift',
        animationEnabled: true,
        animationTypeForReplace: 'push',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="cases" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="lawyers" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

export default function MainLayout() {
  return <MainLayoutContent />;
}