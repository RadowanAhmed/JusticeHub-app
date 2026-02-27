// contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/backend/services/NotificationService';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      
      const data = await notificationService.getUserNotifications(user.id);
      setNotifications(data || []);
      
      const unread = await notificationService.getUnreadCount(user.id);
      setUnreadCount(unread);
      
      console.log(`✅ Loaded ${data?.length || 0} notifications, ${unread} unread`);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Use fallback data
      setNotifications([
        {
          id: 'fallback-1',
          user_id: user.id,
          title: 'مرحباً بك في Orient Team',
          message: 'فريقنا القانوني جاهز لخدمتك',
          notification_type: 'info',
          is_read: false,
          created_at: new Date().toISOString(),
        }
      ]);
      setUnreadCount(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const refreshNotifications = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    
    try {
      await notificationService.markAsRead(notificationId, user.id);
      await fetchNotifications(); // Refresh
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      await fetchNotifications(); // Refresh
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    
    try {
      await notificationService.deleteNotification(notificationId, user.id);
      await fetchNotifications(); // Refresh
    } catch (error) {
      console.error('Error in deleteNotification:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};