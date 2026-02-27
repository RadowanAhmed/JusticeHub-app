// services/AuthNotificationService.ts
import * as Notifications from 'expo-notifications';

class AuthNotificationService {
  async sendLoginNotification(userEmail: string) {
    try {
      // Check notification permissions
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Send login notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "✅ تسجيل دخول جديد",
          body: `تم تسجيل الدخول إلى حساب ${userEmail} بنجاح`,
          sound: true,
          badge: 1,
          data: {
            type: 'login',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });

      console.log('Login notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending login notification:', error);
      return false;
    }
  }

  async sendWelcomeNotification(userName: string) {
    try {
      // Check notification permissions
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Send welcome notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎉 مرحباً بك في Orient Team!",
          body: `أهلاً وسهلاً ${userName}، شكراً لك على الانضمام إلينا!`,
          sound: true,
          badge: 1,
          data: {
            type: 'welcome',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });

      console.log('Welcome notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending welcome notification:', error);
      return false;
    }
  }

  async sendPasswordChangeNotification() {
    try {
      // Check notification permissions
      const { status } = await Notifications.getPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Notification permission not granted');
        return false;
      }

      // Send password change notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔐 تم تغيير كلمة المرور",
          body: "تم تغيير كلمة مرور حسابك بنجاح",
          sound: true,
          badge: 1,
          data: {
            type: 'password_change',
            timestamp: new Date().toISOString(),
          },
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });

      console.log('Password change notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending password change notification:', error);
      return false;
    }
  }
}

export const authNotificationService = new AuthNotificationService();