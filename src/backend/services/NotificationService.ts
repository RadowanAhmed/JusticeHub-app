// services/NotificationService.ts
import { supabase } from '@/lib/supabase';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const isExpoGo = Constants.appOwnership === 'expo';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: string;
  category?: string;
  data?: any;
}

class NotificationService {
  private readonly TABLE_NAME = 'user_notifications';
  private readonly DEVICES_TABLE = 'user_devices';
  private readonly LOCAL_KEY = 'local_notifications';

  constructor() {
    console.log(`🔔 Notification Service: ${isExpoGo ? 'Expo Go' : 'Production'}`);
  }

  // ========== CREATE NOTIFICATION ==========
  async createNotification(params: CreateNotificationParams) {
    console.log('📝 Creating notification for:', params.userId);

    try {
      // 1. Store in database
      const dbResult = await this.saveToDatabase(params);
      
      // 2. Send push notification
      const pushResult = await this.sendPushNotification(params);
      
      // 3. Store locally as backup
      const localNotification = await this.createLocalNotification(params);

      return {
        success: true,
        database: dbResult,
        push: pushResult,
        local: localNotification,
      };

    } catch (error) {
      console.error('❌ Error creating notification:', error);
      
      // Fallback to local only
      const localNotification = await this.createLocalNotification(params);
      await this.sendLocalNotification(params);
      
      return {
        success: true,
        database: { success: false, error },
        push: { success: false, error },
        local: localNotification,
        fallback: true,
      };
    }
  }

  private async saveToDatabase(params: CreateNotificationParams) {
    try {
      const notificationData = {
        user_id: params.userId,
        title: params.title,
        body: params.message, // Using 'body' column as per your table
        type: params.type || 'info',
        category: params.category || 'general',
        read: false,
        data: params.data || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('💾 Saving to database:', this.TABLE_NAME);

      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert failed:', error);
        return { success: false, error };
      }

      console.log('✅ Saved to database:', data?.id);
      return { success: true, data };

    } catch (error) {
      console.error('❌ Database error:', error);
      return { success: false, error };
    }
  }

  // ========== SEND PUSH NOTIFICATION ==========
  private async sendPushNotification(params: CreateNotificationParams) {
    try {
      console.log('📤 Sending push notification...');

      if (isExpoGo) {
        console.log('📱 Expo Go: Using local notification');
        return await this.sendLocalNotification(params);
      }

      // Get user's device tokens
      console.log('🔍 Looking up device tokens for user:', params.userId);
      
      let devices: any[] = [];
      
      // Try primary devices table
      const { data: primaryDevices, error: primaryError } = await supabase
        .from(this.DEVICES_TABLE)
        .select('push_token, is_active')
        .eq('user_id', params.userId);

      if (!primaryError && primaryDevices && primaryDevices.length > 0) {
        devices = primaryDevices;
        console.log(`✅ Found ${devices.length} device(s) in ${this.DEVICES_TABLE}`);
      } else {
        // Try alternative table
        console.log('⚠️ Primary table failed, trying alternative...');
        const { data: altDevices } = await supabase
          .from('app_user_devices')
          .select('push_token, is_active')
          .eq('user_id', params.userId);

        if (altDevices && altDevices.length > 0) {
          devices = altDevices;
          console.log(`✅ Found ${devices.length} device(s) in app_user_devices`);
        } else {
          console.log('⚠️ No devices found for user, sending local notification');
          return await this.sendLocalNotification(params);
        }
      }

      // Filter active devices
      const activeDevices = devices.filter(d => d.is_active !== false);
      if (activeDevices.length === 0) {
        console.log('⚠️ No active devices found');
        return await this.sendLocalNotification(params);
      }

      console.log(`📤 Sending to ${activeDevices.length} active device(s)`);

      // Send to each device
      const results = [];
      for (const device of activeDevices) {
        try {
          const result = await this.sendExpoPush(device.push_token, params);
          results.push({ device: device.push_token, success: result.success });
        } catch (error) {
          console.error('❌ Error sending to device:', error);
          results.push({ device: device.push_token, success: false, error });
        }
      }

      const successful = results.filter(r => r.success).length;
      console.log(`✅ Sent to ${successful}/${activeDevices.length} devices successfully`);

      return {
        success: successful > 0,
        results,
        totalDevices: activeDevices.length,
        successful,
      };

    } catch (error) {
      console.error('❌ Error in sendPushNotification:', error);
      return await this.sendLocalNotification(params);
    }
  }

  private async sendExpoPush(token: string, params: CreateNotificationParams) {
    try {
      console.log(`📤 Sending to token: ${token.substring(0, 20)}...`);

      const message = {
        to: token,
        sound: 'default',
        title: params.title,
        body: params.message,
        data: params.data || {},
        badge: 1,
      };

      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      
      if (result.data?.status === 'ok') {
        console.log('✅ Push sent successfully');
        return { success: true, result };
      } else {
        console.error('❌ Push failed:', result);
        return { success: false, error: result };
      }

    } catch (error) {
      console.error('❌ Error sending Expo push:', error);
      return { success: false, error };
    }
  }

  private async sendLocalNotification(params: CreateNotificationParams) {
    try {
      console.log('📱 Sending local notification');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: params.title + (isExpoGo ? " (Expo Go)" : ""),
          body: params.message,
          data: params.data || {},
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

  // ========== LOCAL STORAGE ==========
  private async createLocalNotification(params: CreateNotificationParams) {
    const notification = {
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: params.userId,
      title: params.title,
      body: params.message,
      type: params.type || 'info',
      is_read: false,
      data: params.data || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      local: true,
    };

    await this.saveToLocalStorage(params.userId, notification);
    return notification;
  }

  private async saveToLocalStorage(userId: string, notification: any) {
    try {
      const key = `${this.LOCAL_KEY}_${userId}`;
      const existing = await this.getLocalNotifications(userId);
      const updated = [notification, ...existing].slice(0, 100);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error('❌ Error saving to local storage:', error);
    }
  }

  private async getLocalNotifications(userId: string) {
    try {
      const key = `${this.LOCAL_KEY}_${userId}`;
      const stored = await AsyncStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error getting local notifications:', error);
      return [];
    }
  }

  // ========== GET NOTIFICATIONS ==========
  async getUserNotifications(userId: string) {
    try {
      console.log('📥 Fetching notifications for:', userId);

      let dbNotifications: any[] = [];

      // Get from database
      try {
        const { data, error } = await supabase
          .from(this.TABLE_NAME)
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          dbNotifications = data;
          console.log(`✅ Got ${data.length} from database`);
        }
      } catch (dbError) {
        console.error('❌ Database fetch failed:', dbError);
      }

      // Get from local storage
      const localNotifications = await this.getLocalNotifications(userId);
      console.log(`📱 Got ${localNotifications.length} from local storage`);

      // Combine and sort
      const allNotifications = [
        ...dbNotifications,
        ...localNotifications
      ].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return allNotifications;

    } catch (error) {
      console.error('❌ Error in getUserNotifications:', error);
      return await this.getLocalNotifications(userId);
    }
  }

  // ========== CASE NOTIFICATIONS ==========
  async sendCaseNotification(caseData: any, userId: string) {
    const ADMIN_ID = '1636d781-ca01-4ba4-9251-3bd6485dae71';
    
    console.log('📋 Starting case notifications...', {
      caseTitle: caseData.title,
      userId,
      adminId: ADMIN_ID
    });

    try {
      // 1. Notification to USER
      console.log('👤 Sending user notification...');
      const userNotification = await this.createNotification({
        userId: userId,
        title: '✅ تم إرسال قضيتك بنجاح',
        message: `تم إرسال قضية "${caseData.title || 'الجديدة'}" إلى فريق Orient Team. سيتم مراجعتها خلال 24 ساعة.`,
        type: 'case',
        category: 'case-updates',
        data: {
          caseId: caseData.id,
          caseNumber: caseData.case_number,
          screen: `/cases/${caseData.id}`,
          action: 'view_case',
        },
      });

      console.log('👤 User notification result:', userNotification);

      // 2. Notification to ADMIN
      console.log('👨‍💼 Sending admin notification...');
      const adminNotification = await this.createNotification({
        userId: ADMIN_ID,
        title: '🆕 قضية جديدة تحتاج مراجعة',
        message: `تم إنشاء قضية جديدة: "${caseData.title || 'غير معنون'}" بواسطة المستخدم`,
        type: 'case',
        category: 'case-updates',
        data: {
          caseId: caseData.id,
          caseNumber: caseData.case_number,
          createdBy: userId,
          screen: `/cases/${caseData.id}`,
          action: 'review_case',
        },
      });

      console.log('👨‍💼 Admin notification result:', adminNotification);

      // 3. Return results
      return {
        success: true,
        timestamp: new Date().toISOString(),
        user: {
          success: userNotification.success,
          pushSent: userNotification.push?.success || false,
          localFallback: userNotification.fallback || false,
        },
        admin: {
          success: adminNotification.success,
          pushSent: adminNotification.push?.success || false,
          localFallback: adminNotification.fallback || false,
        },
      };

    } catch (error) {
      console.error('❌ Error in sendCaseNotification:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ========== UTILITY METHODS ==========
  async getUnreadCount(userId: string) {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter((n: any) => !n.read && !n.is_read).length;
    } catch (error) {
      console.error('❌ Error in getUnreadCount:', error);
      return 0;
    }
  }

  async markAsRead(notificationId: string, userId: string) {
    try {
      // Update in database if not local
      const notifications = await this.getUserNotifications(userId);
      const notification = notifications.find((n: any) => n.id === notificationId);
      
      if (!notification?.local) {
        try {
          await supabase
            .from(this.TABLE_NAME)
            .update({ 
              read: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', notificationId)
            .eq('user_id', userId);
        } catch (dbError) {
          console.log('⚠️ Database update failed, continuing locally');
        }
      }

      // Update locally
      const updatedNotifications = notifications.map((n: any) => 
        n.id === notificationId 
          ? { ...n, read: true, is_read: true, updated_at: new Date().toISOString() }
          : n
      );

      // Save local notifications
      const localNotifications = updatedNotifications.filter((n: any) => n.local);
      const key = `${this.LOCAL_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(localNotifications));

      return true;

    } catch (error) {
      console.error('❌ Error in markAsRead:', error);
      return false;
    }
  }

  async markAllAsRead(userId: string) {
    try {
      // Update in database
      try {
        await supabase
          .from(this.TABLE_NAME)
          .update({ 
            read: true,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('read', false);
      } catch (dbError) {
        console.log('⚠️ Database update failed, continuing locally');
      }

      // Update locally
      const notifications = await this.getUserNotifications(userId);
      const updatedNotifications = notifications.map((n: any) => ({
        ...n,
        read: true,
        is_read: true,
        updated_at: new Date().toISOString(),
      }));

      // Save local notifications
      const localNotifications = updatedNotifications.filter((n: any) => n.local);
      const key = `${this.LOCAL_KEY}_${userId}`;
      await AsyncStorage.setItem(key, JSON.stringify(localNotifications));

      return true;

    } catch (error) {
      console.error('❌ Error in markAllAsRead:', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();