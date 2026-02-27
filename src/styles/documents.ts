// apps/mobile/src/styles/documents.ts
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

  // Header
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },

  // Stats Cards
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
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statIcon: {
    fontSize: 24,
    color: colors.primary,
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
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quickActionIconText: {
    fontSize: 24,
    color: colors.primary,
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

  // Recent Documents
  recentDocumentsSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
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
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  documentTitle: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
  },
  documentType: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  documentSize: {
    ...typography.caption,
    color: colors.textLight,
    marginRight: spacing.md,
  },
  documentDate: {
    ...typography.caption,
    color: colors.textLight,
  },
  documentStatus: {
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

  // Categories
  categoriesSection: {
    marginBottom: spacing.xl,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  categoryChipTextActive: {
    color: colors.white,
  },

  // Empty State
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

  // Analysis Section (للصفحة الرئيسية)
  analysisPreview: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  analysisTitle: {
    ...typography.h4,
    color: colors.text,
  },
  analysisBadge: {
    backgroundColor: colors.warning + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  analysisBadgeText: {
    ...typography.caption,
    color: colors.warning,
    fontWeight: '600',
  },
  analysisSummary: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  analysisHighlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  highlightChip: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  highlightText: {
    ...typography.caption,
    color: colors.primary,
  },

  // Upload Section (للتحليل)
  uploadSection: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  uploadButton: {
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    marginBottom: spacing.md,
  },
  uploadButtonText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  analyzeButtonText: {
    ...typography.button,
    color: colors.white,
  },
  buttonDisabled: {
    backgroundColor: colors.grayLight,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },

  // Analysis Results (للتحليل)
  analysisSection: {
    marginBottom: spacing.xl,
  },
  summaryBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  summaryText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  gridItem: {
    width: '48%',
  },
  gridTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  list: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: borderRadius.round,
    backgroundColor: colors.danger,
    marginTop: spacing.xs,
    marginRight: spacing.sm,
  },
  bulletSuccess: {
    backgroundColor: colors.success,
  },
  listText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  recommendations: {
    marginBottom: spacing.lg,
  },
  recommendationCard: {
    backgroundColor: colors.success + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.success + '30',
  },
  recommendationText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  clauseCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  clauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clauseTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  riskBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  riskBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  clauseText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  suggestionBox: {
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.info + '30',
  },
  suggestionLabel: {
    ...typography.bodySmall,
    color: colors.info,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
});

// مساعدات للألوان
export const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
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

// مساعدات للحالة
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'analyzed':
      return colors.success;
    case 'pending':
      return colors.warning;
    case 'error':
      return colors.danger;
    case 'uploading':
      return colors.info;
    default:
      return colors.gray;
  }
};

// مساعدات لأنواع الملفات
export const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word') || fileType.includes('document')) return '📝';
  if (fileType.includes('image')) return '🖼️';
  return '📎';
};

export default styles;