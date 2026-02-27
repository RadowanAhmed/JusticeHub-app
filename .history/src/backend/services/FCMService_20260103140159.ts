// backend/services/FCMService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

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
    this.configureNotifications();
  }

  private configureNotifications() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Handle notification when app is in foreground
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Handle notification response (user taps notification)
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      
      // You can handle navigation here based on notification data
      const data = response.notification.request.content.data;
      if (data.screen) {
        // Navigate to screen using your router
        // router.push(data.screen);
      }
    });
  }

  async registerForPushNotificationsAsync(): Promise<string | null> {
    if (this.isExpoGo) {
      console.log('Push notifications not available in Expo Go');
      return null;
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }
      
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId,
      })).data;
      
      console.log('Push token obtained:', token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  async savePushTokenToDatabase(userId: string, token: string): Promise<boolean> {
    try {
      const deviceInfo = {
        user_id: userId,
        push_token: token,
        device_type: Platform.OS,
        device_name: Device.modelName || 'Unknown',
        app_version: Constants.expoConfig?.version || '1.0.0',
      };

      const { error } = await supabase
        .from('user_push_tokens')
        .upsert([deviceInfo], {
          onConflict: 'user_id,push_token',
        });

      if (error) {
        console.error('Error saving push token:', error);
        return false;
      }
      
      console.log('Push token saved to database');
      return true;
    } catch (error) {
      console.error('Error in savePushTokenToDatabase:', error);
      return false;
    }
  }

  async sendPushNotification(token: string, notification: {
    title: string;
    body: string;
    data?: any;
    sound?: boolean;
  }) {
    try {
      const message = {
        to: token,
        sound: notification.sound !== false ? 'default' : undefined,
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
        badge: 1,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        console.log('Push notification sent successfully');
        return { success: true, result };
      } else {
        console.error('Push notification failed:', result);
        return { success: false, error: result };
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
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
      // Get user's push tokens
      const { data: tokens, error } = await supabase
        .from('user_push_tokens')
        .select('push_token')
        .eq('user_id', userId);

      if (error || !tokens || tokens.length === 0) {
        console.log('No push tokens found for user:', userId);
        return { success: false, error: 'No push tokens found' };
      }

      // Send to all user's devices
      const results = await Promise.all(
        tokens.map((token: any) => 
          this.sendPushNotification(token.push_token, notification)
        )
      );

      const successCount = results.filter(r => r.success).length;
      console.log(`Sent notifications to ${successCount}/${tokens.length} devices for user ${userId}`);
      
      return { 
        success: successCount > 0, 
        sentTo: successCount,
        totalDevices: tokens.length 
      };
    } catch (error) {
      console.error('Error in sendToUser:', error);
      return { success: false, error };
    }
  }

  async sendToMultipleUsers(userIds: string[], notification: {
    title: string;
    body: string;
    data?: any;
    sound?: boolean;
  }) {
    try {
      const { data: tokens, error } = await supabase
        .from('user_push_tokens')
        .select('user_id, push_token')
        .in('user_id', userIds);

      if (error || !tokens || tokens.length === 0) {
        console.log('No push tokens found for users');
        return { success: false, error: 'No push tokens found' };
      }

      // Group tokens by user
      const tokensByUser = tokens.reduce((acc, token) => {
        if (!acc[token.user_id]) {
          acc[token.user_id] = [];
        }
        acc[token.user_id].push(token.push_token);
        return acc;
      }, {} as Record<string, string[]>);

      // Send to each user's devices
      const results = await Promise.all(
        Object.entries(tokensByUser).map(([userId, userTokens]) =>
          Promise.all(
            userTokens.map(token => 
              this.sendPushNotification(token, {
                ...notification,
                data: { ...notification.data, userId }
              })
            )
          )
        )
      );

      const totalSuccess = results.flat().filter(r => r.success).length;
      console.log(`Sent notifications to ${totalSuccess} devices for ${Object.keys(tokensByUser).length} users`);
      
      return { 
        success: totalSuccess > 0, 
        totalSent: totalSuccess,
        totalUsers: Object.keys(tokensByUser).length 
      };
    } catch (error) {
      console.error('Error in sendToMultipleUsers:', error);
      return { success: false, error };
    }
  }
}

export const fcmService = new FCMService();