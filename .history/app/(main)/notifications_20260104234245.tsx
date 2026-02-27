// app/(main)/notifications/index.tsx
import { useNotification } from '@/backend/notifications/NotificationContext';
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors
const colors = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',
  text: '#F1F5F9',
  textLight: '#CBD5E1',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  border: '#334155',
  white: '#FFFFFF',
};

// Notification type icons
const NOTIFICATION_ICONS = {
  case: { icon: 'briefcase-outline', color: colors.primary },
  message: { icon: 'chatbubble-outline', color: colors.success },
  info: { icon: 'information-circle-outline', color: colors.info },
  success: { icon: 'checkmark-circle-outline', color: colors.success },
  warning: { icon: 'warning-outline', color: colors.warning },
  error: { icon: 'alert-circle-outline', color: colors.danger },
  security: { icon: 'shield-checkmark-outline', color: colors.info },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotification();
  
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    return true;
  });

  const handleNotificationPress = async (notification: any) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate if there's a screen in data
    if (notification.data?.screen) {
      router.push(notification.data.screen);
    }
  };

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      'حذف الإشعار',
      'هل تريد حذف هذا الإشعار؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => deleteNotification(notificationId),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'حذف جميع الإشعارات',
      'هل تريد حذف جميع الإشعارات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف الكل',
          style: 'destructive',
          onPress: () => clearAllNotifications(),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      if (diffHours < 1) {
        return 'الآن';
      } else if (diffHours < 24) {
        return format(date, 'HH:mm', { locale: ar });
      } else {
        return format(date, 'dd/MM/yyyy', { locale: ar });
      }
    } catch (error) {
      return '';
    }
  };

  const getTypeCount = (type: string) => {
    return notifications.filter(n => n.type === type).length;
  };

  const notificationTypes = [
    { id: 'all', label: 'الكل', count: notifications.length },
    { id: 'case', label: 'قضايا', count: getTypeCount('case') },
    { id: 'message', label: 'رسائل', count: getTypeCount('message') },
    { id: 'info', label: 'إشعارات', count: getTypeCount('info') },
  ];

  if (loading && notifications.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل الإشعارات...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>الإشعارات</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <MaterialIcons 
                name="mark-email-read" 
                size={24} 
                color={unreadCount === 0 ? colors.textMuted : colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>إجمالي</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              {unreadCount}
            </Text>
            <Text style={styles.statLabel}>غير مقروء</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {notificationTypes.length - 1}
            </Text>
            <Text style={styles.statLabel}>أنواع</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View>
        <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text style={[
            styles.filterText,
            filter === 'all' && styles.filterTextActive,
          ]}>
            الكل
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'unread' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('unread')}
        >
          <View style={styles.filterBadge}>
            <Text style={[
              styles.filterText,
              filter === 'unread' && styles.filterTextActive,
            ]}>
              غير مقروء
            </Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
      </View>


      {/* Type Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.typeFilterContainer}
        contentContainerStyle={styles.typeFilterContent}
      >
        {notificationTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.typeFilterButton,
              selectedType === type.id && styles.typeFilterButtonActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={[
              styles.typeFilterText,
              selectedType === type.id && styles.typeFilterTextActive,
            ]}>
              {type.label}
            </Text>
            {type.count > 0 && (
              <View style={styles.typeCountBadge}>
                <Text style={styles.typeCountText}>{type.count}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <View style={styles.content}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={64}
              color={colors.textMuted}
            />
            <Text style={styles.emptyTitle}>
              لا توجد إشعارات
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'unread' 
                ? 'لا توجد إشعارات غير مقروءة' 
                : selectedType !== 'all'
                ? `لا توجد إشعارات من نوع ${notificationTypes.find(t => t.id === selectedType)?.label}`
                : 'ستظهر هنا جميع الإشعارات الواردة'}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshNotifications}
                colors={[colors.primary]}
                tintColor={colors.primary}
                progressBackgroundColor={colors.surface}
              />
            }
          >
            <View style={styles.notificationsContainer}>
              {filteredNotifications.map(notification => {
                const iconConfig = NOTIFICATION_ICONS[notification.type as keyof typeof NOTIFICATION_ICONS] || 
                                 NOTIFICATION_ICONS.info;
                
                return (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationCard,
                      !notification.read && styles.unreadCard,
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationHeader}>
                      <View style={[
                        styles.notificationIcon,
                        { backgroundColor: iconConfig.color + '20' }
                      ]}>
                        <Ionicons 
                          name={iconConfig.icon as any} 
                          size={20} 
                          color={iconConfig.color} 
                        />
                      </View>
                      
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationTitleRow}>
                          <Text style={styles.notificationTitle} numberOfLines={1}>
                            {notification.title}
                          </Text>
                          <Text style={styles.notificationTime}>
                            {formatDate(notification.created_at)}
                          </Text>
                        </View>
                        
                        <Text style={styles.notificationBody} numberOfLines={2}>
                          {notification.body}
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDelete(notification.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close" size={18} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                    
                    {!notification.read && (
                      <View style={styles.unreadIndicator} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Clear All Button */}
            {filteredNotifications.length > 0 && (
              <TouchableOpacity
                style={styles.clearAllButton}
                onPress={handleClearAll}
              >
                <MaterialIcons name="delete-sweep" size={20} color={colors.danger} />
                <Text style={styles.clearAllText}>حذف جميع الإشعارات</Text>
              </TouchableOpacity>
            )}

            <View style={styles.footerSpace} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textMuted,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  filterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.white,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  typeFilterContainer: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeFilterContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  typeFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeFilterButtonActive: {
    backgroundColor: colors.primary,
  },
  typeFilterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  typeFilterTextActive: {
    color: colors.white,
  },
  typeCountBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeCountText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  unreadCard: {
    borderColor: colors.primary + '40',
    backgroundColor: colors.surfaceLight,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  notificationBody: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  clearAllText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '500',
  },
  footerSpace: {
    height: 32,
  },
});