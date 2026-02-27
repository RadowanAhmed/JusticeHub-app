// services/PushNotificationService.ts
import { fcmService } from '@/backend/services/FCMService';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationService } from './NotificationService';

interface PushNotificationParams {
  userId: string;
  title: string;
  body: string;
  data?: any;
  type?: string;
  category?: string;
  sound?: boolean;
}

class PushNotificationService {
  async sendAuthNotification(params: PushNotificationParams) {
    try {
      console.log('🔔 Starting push notification process...');
      
      // 1. Send push notification to device
      console.log('📤 Step 1: Sending push notification');
      const pushResult = await fcmService.sendToUser(params.userId, {
        title: params.title,
        body: params.body,
        data: params.data,
        sound: params.sound !== false,
      });

      // 2. Save to database (for notification history)
      console.log('💾 Step 2: Saving to database');
      const dbResult = await notificationService.createNotification({
        userId: params.userId,
        title: params.title,
        message: params.body,
        type: params.type || 'info',
        category: params.category || 'auth',
        data: params.data,
      });

      console.log('✅ Push notification process completed');
      return {
        success: pushResult.success || dbResult.success,
        push: pushResult,
        database: dbResult,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Error in sendAuthNotification:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async sendLoginNotification(userId: string, email: string) {
    const deviceInfo = this.getDeviceInfo();
    
    return await this.sendAuthNotification({
      userId,
      title: '✅ تسجيل دخول جديد',
      body: `تم تسجيل الدخول إلى حسابك ${email} بنجاح ${deviceInfo ? `من ${deviceInfo}` : ''}`,
      type: 'security',
      category: 'auth',
      data: {
        event: 'login',
        email: email,
        device: deviceInfo,
        timestamp: new Date().toISOString(),
        screen: '/profile',
        action: 'view_account',
      },
      sound: true,
    });
  }

  async sendSignupNotification(userId: string, email: string, firstName: string) {
    return await this.sendAuthNotification({
      userId,
      title: '🎉 مرحباً بك في Orient Team!',
      body: `أهلاً وسهلاً ${firstName}، شكراً لك على الانضمام إلى منصتنا القانونية.`,
      type: 'info',
      category: 'auth',
      data: {
        event: 'welcome',
        email: email,
        firstName: firstName,
        timestamp: new Date().toISOString(),
        screen: '/cases',
        action: 'get_started',
      },
      sound: true,
    });
  }

  async sendPasswordChangeNotification(userId: string, email: string) {
    return await this.sendAuthNotification({
      userId,
      title: '🔐 تم تغيير كلمة المرور',
      body: 'تم تغيير كلمة مرور حسابك بنجاح.',
      type: 'security',
      category: 'auth',
      data: {
        event: 'password_changed',
        email: email,
        timestamp: new Date().toISOString(),
        screen: '/security',
        action: 'review_security',
      },
      sound: true,
    });
  }

  private getDeviceInfo(): string {
    try {
      const deviceName = Device.modelName || 'جهاز';
      const os = Platform.OS === 'ios' ? 'iOS' : 'Android';
      const version = Platform.Version;
      
      return `${deviceName} (${os} ${version})`;
    } catch (error) {
      console.error('❌ Error getting device info:', error);
      return '';
    }
  }
}

export const pushNotificationService = new PushNotificationService();