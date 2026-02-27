// apps/mobile/src/styles/case-details.ts
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

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.h4,
    color: colors.danger,
    textAlign: 'center',
  },

  // Header Section
  header: {
    marginBottom: spacing.lg,
  },
  caseNumber: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  caseTitle: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Status Section
  statusSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  statusBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
  },
  statusText: {
    ...typography.button,
    fontWeight: '600',
  },
  statusActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusButtonText: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '500',
  },

  // Details Section
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textLight,
    flex: 1,
  },
  detailValue: {
    ...typography.body,
    color: colors.text,
    flex: 2,
    textAlign: 'right',
  },
  priorityBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  priorityText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },

  // Description Section
  descriptionSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  descriptionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginTop: spacing.sm,
  },

  // Lawyer Section
  lawyerSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  lawyerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  lawyerAvatar: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lawyerAvatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  lawyerInfo: {
    flex: 1,
  },
  lawyerName: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lawyerSpecialization: {
    ...typography.bodySmall,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  lawyerContact: {
    ...typography.bodySmall,
    color: colors.textLight,
  },

  // Documents Section
  documentsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  addButtonText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
  documentsList: {
    marginTop: spacing.sm,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  documentIcon: {
    fontSize: 24,
    marginRight: spacing.md,
    color: colors.primary,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  documentDate: {
    ...typography.caption,
    color: colors.textLight,
  },
  aiBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  aiBadgeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: spacing.xl,
    fontStyle: 'italic',
  },

  // Appointments Section
  appointmentsSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  appointmentsList: {
    marginTop: spacing.sm,
  },
  appointmentCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  appointmentTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appointmentDate: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  appointmentDuration: {
    ...typography.body,
    color: colors.primary,
  },
  appointmentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentStatus: {
    ...typography.bodySmall,
    color: colors.textLight,
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
    fontWeight: '600',
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    fontSize: 24,
    color: colors.textLight,
    padding: spacing.xs,
  },
  modalContent: {
    flex: 1,
    padding: spacing.lg,
  },
  documentContent: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },

  // Section Titles
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Utility Classes
  notSpecified: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
  notScheduled: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
});

// دالة مساعدة للحصول على لون الحالة
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#f59e0b'; // برتقالي
    case 'in_progress':
      return '#3b82f6'; // أزرق
    case 'completed':
      return '#10b981'; // أخضر
    case 'cancelled':
      return '#ef4444'; // أحمر
    default:
      return '#6b7280'; // رمادي
  }
};

// دالة مساعدة للحصول على لون الأولوية
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // أحمر
    case 'medium':
      return '#f59e0b'; // برتقالي
    case 'low':
      return '#10b981'; // أخضر
    default:
      return '#6b7280'; // رمادي
  }
};

export default styles;