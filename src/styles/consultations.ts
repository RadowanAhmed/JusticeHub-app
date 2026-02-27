// apps/mobile/src/styles/consultations.ts
import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';

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
  headerTitle: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginLeft: spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
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
  categoryChipIcon: {
    marginRight: spacing.xs,
  },

  // Popular Questions
  popularQuestionsSection: {
    marginBottom: spacing.xl,
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  questionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  questionArrow: {
    color: colors.primary,
    fontSize: 18,
    marginLeft: spacing.sm,
  },
  questionCategory: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
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

  // Recent Consultations
  recentConsultationsSection: {
    marginBottom: spacing.xl,
  },
  consultationCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  consultationTitle: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '600',
  },
  consultationTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  consultationPreview: {
    ...typography.bodySmall,
    color: colors.textLight,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  consultationStatus: {
    flexDirection: 'row',
    alignItems: 'center',
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
});