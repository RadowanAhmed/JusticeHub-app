// hooks/usePushNotifications.ts
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const usePushNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const registerForPushNotifications = async () => {
      try {
        console.log('📱 Starting push notification registration...');

        // Check if we're in Expo Go
        const isExpoGo = Constants.appOwnership === 'expo';
        if (isExpoGo) {
          console.log('🔔 Expo Go detected - using local notifications only');
          return;
        }

        // Check if it's a physical device
        if (!Device.isDevice) {
          console.log('📱 Must use physical device for push notifications');
          return;
        }

        // Request permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('❌ Permission not granted for notifications');
          return;
        }

        // Get project ID
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        if (!projectId) {
          console.error('❌ No project ID found in app config');
          return;
        }

        // Get push token
        console.log('📱 Getting push token...');
        const token = (await Notifications.getExpoPushTokenAsync({
          projectId,
        })).data;

        console.log('✅ Push token received:', token);

        // Save token to database
        await savePushToken(user.id, token);

        // Configure Android channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        console.log('✅ Push notifications setup complete');

      } catch (error) {
        console.error('❌ Error setting up push notifications:', error);
      }
    };

    const savePushToken = async (userId: string, token: string) => {
      try {
        console.log('💾 Saving push token to database...');

        const deviceData = {
          user_id: userId,
          push_token: token,
          device_type: Platform.OS,
          device_name: Device.modelName || 'Unknown Device',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Try to insert, if conflict then update
        const { error } = await supabase
          .from('user_devices')
          .upsert([deviceData], {
            onConflict: 'user_id,push_token',
          });

        if (error) {
          console.error('❌ Error saving push token:', error);
          
          // Try alternative table name
          const { error: altError } = await supabase
            .from('app_user_devices')
            .upsert([deviceData], {
              onConflict: 'user_id,push_token',
            });

          if (altError) {
            console.error('❌ Both tables failed:', altError);
            return;
          }
        }

        console.log('✅ Push token saved to database');

      } catch (error) {
        console.error('❌ Error in savePushToken:', error);
      }
    };

    // Register for push notifications
    registerForPushNotifications();

  }, [user]);
};