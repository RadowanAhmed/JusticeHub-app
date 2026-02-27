// backend/services/FCMService.ts
import { supabase } from '@/lib/supabase';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class FCMService {
  private isExpoGo: boolean;

  constructor() {
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.setupNotificationListeners();
  }

  private setupNotificationListeners() {
    // Handle notification when app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notification received in foreground:', notification);
    });

    // Handle notification response (user taps notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 User tapped notification:', response);
      // You can handle navigation here
    });
  }

  async registerForPushNotificationsAsync(): Promise<string | null> {
    try {
      console.log('📱 Starting push notification registration...');

      // For Expo Go, we'll use local notifications
      if (this.isExpoGo) {
        console.log('📱 Expo Go detected - will use local notifications');
        return 'expo-go-token';
      }

      if (!Device.isDevice) {
        console.log('💻 Must use physical device for Push Notifications');
        return null;
      }

      // Get existing permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      // Request permission if not granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Permission not granted for push notifications');
        return null;
      }
      
      // Get project ID from app config
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.error('❌ Project ID not found in app config');
        return null;
      }
      
      // Get push token
      console.log('📱 Getting Expo push token...');
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;
      
      console.log('✅ Expo Push Token:', token);
      return token;
    } catch (error) {
      console.error('❌ Error getting push token:', error);
      return null;
    }
  }

  async savePushTokenToDatabase(userId: string, token: string): Promise<boolean> {
    try {
      console.log('💾 Saving push token for user:', userId);

      const deviceInfo = {
        user_id: userId,
        push_token: token,
        device_type: Platform.OS,
        device_name: Device.modelName || 'Unknown Device',
        os_version: Platform.Version,
        app_version: Constants.expoConfig?.version || '1.0.0',
        is_active: true,
        last_used: new Date().toISOString(),
      };

      // Try to upsert the token
      const { error } = await supabase
        .from('user_devices')
        .upsert([deviceInfo], {
          onConflict: 'user_id,push_token',
        });

      if (error) {
        console.error('❌ Error saving push token:', error);
        
        // Try alternative table
        const { error: altError } = await supabase
          .from('app_user_devices')
          .upsert([deviceInfo], {
            onConflict: 'user_id,push_token',
          });

        if (altError) {
          console.error('❌ Alternative table also failed:', altError);
          return false;
        }
      }
      
      console.log('✅ Push token saved to database');
      return true;
    } catch (error) {
      console.error('❌ Error in savePushTokenToDatabase:', error);
      return false;
    }
  }

  async sendPushNotificationToDevice(token: string, notification: {
    title: string;
    body: string;
    data?: any;
    sound?: boolean;
  }) {
    try {
      console.log('📤 Sending push notification to token:', token.substring(0, 20) + '...');

      // If it's Expo Go token, send local notification instead
      if (token === 'expo-go-token') {
        return await this.sendLocalNotification(notification);
      }

      const message = {
        to: token,
        sound: notification.sound !== false ? 'default' : undefined,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: 1,
        priority: 'high',
      };

      console.log('📤 Sending to Expo push service...');
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      console.log('📤 Expo response:', result);

      if (result.data && result.data.status === 'ok') {
        console.log('✅ Push notification sent successfully');
        return { 
          success: true, 
          result,
          token: token.substring(0, 20) + '...'
        };
      } else {
        console.error('❌ Push notification failed:', result);
        // Fallback to local notification
        return await this.sendLocalNotification(notification);
      }
    } catch (error) {
      console.error('❌ Error sending push notification:', error);
      // Fallback to local notification
      return await this.sendLocalNotification(notification);
    }
  }

  async sendLocalNotification(notification: {
    title: string;
    body: string;
    data?: any;
    sound?: boolean;
  }) {
    try {
      console.log('📱 Sending local notification');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1,
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });

      console.log('✅ Local notification scheduled');
      return { success: true, local: true };
    } catch (error) {
      console.error('❌ Error sending local notification:', error);
      return { success: false, error };
    }
  }

  async sendToUser(userId: string, notification: {
    title: string;
    body: string;
    data?: any;
    sound?: boolean;
  }) {
    try {
      console.log(`👤 Sending notification to user ${userId}`);
      
      // Get user's push tokens from database
      const { data: tokens, error } = await supabase
        .from('user_devices')
        .select('push_token')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('❌ Error fetching tokens:', error);
        return { success: false, error: 'Database error' };
      }

      if (!tokens || tokens.length === 0) {
        console.log('⚠️ No active devices found for user');
        return { 
          success: false, 
          error: 'No active devices',
          fallback: await this.sendLocalNotification(notification)
        };
      }

      console.log(`📱 Found ${tokens.length} device(s) for user`);
      
      // Send to all user's devices
      const results = await Promise.all(
        tokens.map((device: any) => 
          this.sendPushNotificationToDevice(device.push_token, notification)
        )
      );

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ Sent to ${successCount}/${tokens.length} device(s)`);
      
      return { 
        success: successCount > 0, 
        sentTo: successCount,
        totalDevices: tokens.length,
        results 
      };
    } catch (error) {
      console.error('❌ Error in sendToUser:', error);
      return { 
        success: false, 
        error,
        fallback: await this.sendLocalNotification(notification)
      };
    }
  }
}

export const fcmService = new FCMService();