// services/AuthNotificationService.ts
import { notificationService } from './NotificationService';

class AuthNotificationService {
  async sendLoginNotification(userId: string, userEmail: string, deviceInfo?: string) {
    try {
      console.log('🔔 Sending login notification for:', userId);
      
      const notification = await notificationService.createNotification({
        userId: userId,
        title: '✅ تسجيل دخول جديد',
        message: `تم تسجيل الدخول إلى حسابك بنجاح. ${deviceInfo ? `من: ${deviceInfo}` : ''}`,
        type: 'security',
        category: 'auth',
        data: {
          event: 'login',
          timestamp: new Date().toISOString(),
          screen: '/profile',
          action: 'view_account',
        },
      });
      
      console.log('✅ Login notification sent:', notification);
      return notification;
    } catch (error) {
      console.error('❌ Error sending login notification:', error);
      return null;
    }
  }

  async sendSignupWelcomeNotification(userId: string, userEmail: string, firstName: string) {
    try {
      console.log('🔔 Sending welcome notification for new user:', userId);
      
      const notification = await notificationService.createNotification({
        userId: userId,
        title: '🎉 مرحباً بك في Orient Team!',
        message: `أهلاً وسهلاً ${firstName}، نحن سعداء بانضمامك إلى منصتنا القانونية.`,
        type: 'info',
        category: 'auth',
        data: {
          event: 'welcome',
          timestamp: new Date().toISOString(),
          screen: '/cases',
          action: 'get_started',
        },
      });
      
      console.log('✅ Welcome notification sent:', notification);
      return notification;
    } catch (error) {
      console.error('❌ Error sending welcome notification:', error);
      return null;
    }
  }

  async sendSuspiciousLoginNotification(userId: string, location?: string, device?: string) {
    try {
      console.log('🔔 Sending suspicious login alert for:', userId);
      
      const notification = await notificationService.createNotification({
        userId: userId,
        title: '⚠️ تسجيل دخول مشبوه',
        message: `تم تسجيل دخول إلى حسابك من جهاز أو موقع جديد.${location ? ` الموقع: ${location}` : ''}`,
        type: 'security',
        category: 'auth',
        data: {
          event: 'suspicious_login',
          timestamp: new Date().toISOString(),
          screen: '/security',
          action: 'review_security',
        },
      });
      
      console.log('✅ Suspicious login notification sent:', notification);
      return notification;
    } catch (error) {
      console.error('❌ Error sending suspicious login notification:', error);
      return null;
    }
  }
}

export const authNotificationService = new AuthNotificationService();