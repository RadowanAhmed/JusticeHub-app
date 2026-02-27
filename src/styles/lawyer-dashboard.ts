// apps/mobile/src/styles/lawyer-dashboard.ts
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    padding: spacing.md,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    width: 20,
    height: 20,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationCount: {
    ...typography.caption,
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  trendText: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionText: {
    ...typography.bodySmall,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Recent Cases Section
  recentCasesSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },
  casesList: {
    marginBottom: spacing.md,
  },
  caseCard: {
    width: width * 0.7,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginRight: spacing.md,
    ...shadows.sm,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  caseTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    marginRight: spacing.sm,
  },
  caseDate: {
    ...typography.caption,
    color: colors.textLight,
  },
  caseClient: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  caseCategory: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  caseStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '600',
  },
  casePriority: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
  },
  priorityText: {
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
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  appointmentTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  appointmentTime: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentDetails: {
    marginBottom: spacing.md,
  },
  appointmentClient: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  appointmentCase: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  appointmentType: {
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  appointmentTypeText: {
    ...typography.caption,
    color: colors.text,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  joinButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '500',
  },
  rescheduleButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rescheduleText: {
    ...typography.bodySmall,
    color: colors.text,
  },

  // Performance Metrics
  performanceSection: {
    marginBottom: spacing.xl,
  },
  performanceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  performanceTitle: {
    ...typography.h4,
    color: colors.text,
  },
  performanceValue: {
    ...typography.h2,
    color: colors.primary,
  },
  performanceLabel: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    ...typography.h3,
    color: colors.text,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Earnings Overview
  earningsSection: {
    marginBottom: spacing.xl,
  },
  earningsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  earningsTitle: {
    ...typography.h4,
    color: colors.text,
  },
  earningsAmount: {
    ...typography.h2,
    color: colors.success,
  },
  earningsPeriod: {
    ...typography.bodySmall,
    color: colors.textLight,
  },
  earningsChart: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  chartBar: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    width: 30,
  },
  chartLabel: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },

  // Empty States
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  emptyStateIcon: {
    fontSize: 64,
    color: colors.grayLight,
    marginBottom: spacing.lg,
  },
  emptyStateTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.lg,
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

  // Quick Stats
  quickStats: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    ...typography.h2,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  quickStatLabel: {
    ...typography.bodySmall,
    color: colors.white + 'CC',
  },

  // Today's Schedule
  todaysSchedule: {
    marginBottom: spacing.xl,
  },
  scheduleCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  scheduleIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  scheduleTitle: {
    ...typography.h4,
    color: colors.text,
    flex: 1,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scheduleTime: {
    width: 60,
  },
  scheduleTimeText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  scheduleInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  scheduleEvent: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  scheduleClient: {
    ...typography.caption,
    color: colors.textLight,
  },
  scheduleType: {
    ...typography.caption,
    color: colors.textLight,
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
});

// مساعدات للألوان
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'in_progress':
      return colors.info;
    case 'completed':
      return colors.success;
    case 'cancelled':
      return colors.danger;
    case 'scheduled':
      return colors.primary;
    case 'ongoing':
      return colors.info;
    default:
      return colors.gray;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return colors.danger;
    case 'medium':
      return colors.warning;
    case 'low':
      return colors.success;
    default:
      return colors.gray;
  }
};

export const getMeetingTypeColor = (type: string) => {
  switch (type) {
    case 'video':
      return colors.info;
    case 'in_person':
      return colors.success;
    case 'phone':
      return colors.warning;
    default:
      return colors.gray;
  }
};

// مساعدات للأيقونات
export const getCaseIcon = (category: string) => {
  switch (category) {
    case 'civil':
      return '⚖️';
    case 'criminal':
      return '⚔️';
    case 'family':
      return '👨‍👩‍👧‍👦';
    case 'commercial':
      return '💼';
    case 'labor':
      return '👷';
    case 'real_estate':
      return '🏠';
    default:
      return '📄';
  }
};

export const getMeetingIcon = (type: string) => {
  switch (type) {
    case 'video':
      return '📹';
    case 'in_person':
      return '👥';
    case 'phone':
      return '📞';
    default:
      return '📅';
  }
};

export const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
  switch (trend) {
    case 'up':
      return '📈';
    case 'down':
      return '📉';
    default:
      return '➡️';
  }
};

export default styles;