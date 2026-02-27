// apps/mobile/src/styles/profile.ts
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
    flexGrow: 1,
  },

  // Header
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarText: {
    ...typography.h1,
    color: colors.primary,
    fontSize: 36,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  userTypeBadge: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  userTypeText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    ...typography.button,
    color: colors.white,
    fontSize: 14,
  },

  // Menu Section
  menuSection: {
    backgroundColor: colors.white,
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    marginRight: spacing.md,
    width: 24,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  menuArrow: {
    color: colors.textLight,
  },

  // Logout Section
  logoutSection: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.danger + '30',
    ...shadows.sm,
  },
  logoutIcon: {
    marginRight: spacing.sm,
  },
  logoutText: {
    ...typography.body,
    color: colors.danger,
    fontWeight: '600',
  },

  // Version Section
  versionSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  versionText: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  copyrightText: {
    ...typography.caption,
    color: colors.textLight,
    textAlign: 'center',
  },

  // Edit Profile Styles
  editContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  editTitle: {
    ...typography.h3,
    color: colors.text,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formLabel: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  formInput: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.text,
  },

  // Avatar Upload
  avatarUploadContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarUpload: {
    position: 'relative',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.round,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  avatarUploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  avatarUploadIcon: {
    color: colors.white,
    fontSize: 20,
  },

  // Help & About Pages
  helpContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  helpItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  helpQuestion: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  helpAnswer: {
    ...typography.body,
    color: colors.textLight,
    lineHeight: 24,
  },
  contactContainer: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  contactTitle: {
    ...typography.h4,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  contactIcon: {
    marginRight: spacing.md,
    color: colors.primary,
  },
  contactText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },

  // Personal Info Page
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textLight,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  infoSectionTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },

  // Loading States
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

  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  errorIcon: {
    fontSize: 64,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    ...typography.h4,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Success States
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  successIcon: {
    fontSize: 64,
    color: colors.success,
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h4,
    color: colors.success,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Badge Styles
  badge: {
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

// مساعدات للألوان
export const getBadgeColor = (type: string) => {
  switch (type) {
    case 'premium':
      return { bg: colors.warning + '20', text: colors.warning };
    case 'verified':
      return { bg: colors.success + '20', text: colors.success };
    case 'pending':
      return { bg: colors.warning + '20', text: colors.warning };
    case 'active':
      return { bg: colors.success + '20', text: colors.success };
    default:
      return { bg: colors.grayLight, text: colors.textLight };
  }
};

// مساعدات للصور
export const getAvatarInitials = (name: string) => {
  if (!name) return 'U';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export default styles;