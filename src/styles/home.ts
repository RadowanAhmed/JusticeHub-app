// apps/mobile/src/styles/home.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  dateBadge: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dateText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },

  // Stats Section
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionTitle: {
    ...typography.h4,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  quickActionDescription: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },

  // Recent Activity
  recentActivitySection: {
    marginBottom: spacing.xl,
  },
  activityCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  activityTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  activityTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  activityDescription: {
    ...typography.bodySmall,
    color: colors.textLight,
    lineHeight: 20,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
  statusText: {
    ...typography.caption,
    color: colors.textLight,
  },

  // Upcoming Appointments
  appointmentsSection: {
    marginBottom: spacing.xl,
  },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  appointmentTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  appointmentDate: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  appointmentType: {
    ...typography.caption,
    color: colors.textLight,
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  appointmentDuration: {
    ...typography.caption,
    color: colors.textLight,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  joinButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },

  // AI Assistant Card
  aiAssistantCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  aiAssistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  aiAssistantIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  aiAssistantIconText: {
    fontSize: 24,
    color: colors.primary,
  },
  aiAssistantTitle: {
    ...typography.h4,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  aiAssistantSubtitle: {
    ...typography.bodySmall,
    color: colors.white + 'CC',
  },
  aiAssistantDescription: {
    ...typography.body,
    color: colors.white,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  aiAssistantButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  aiAssistantButtonText: {
    ...typography.button,
    color: colors.primary,
  },

  // Empty States
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyStateIcon: {
    fontSize: 64,
    color: colors.grayLight,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  emptyStateButtonText: {
    ...typography.button,
    color: colors.white,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.md,
  },

  // Section Titles
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
  },

  // View All Button
  viewAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },


  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },


  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  welcomeMessage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
});


// مساعدات للألوان
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return colors.success;
    case 'in_progress':
      return colors.info;
    case 'pending':
      return colors.warning;
    case 'cancelled':
      return colors.danger;
    default:
      return colors.gray;
  }
};

// مساعدات لأنواع النشاط
export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'case_update':
      return '⚖️';
    case 'document_upload':
      return '📄';
    case 'consultation':
      return '💬';
    case 'appointment':
      return '📅';
    case 'payment':
      return '💳';
    default:
      return '📌';
  }
};

export default styles;