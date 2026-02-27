// apps/mobile/src/styles/notifications.ts
import { StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  }, 
  settingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  settingText: {
    fontSize: typography.md,
    color: colors.text,
  },
  toggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  toggleText: {
    fontSize: typography.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: spacing.sm,
  },
  toggleSwitchText: {
    fontSize: typography.md,
    color: colors.text,
    marginLeft: spacing.sm,

  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: spacing.sm,
  },
  settingSwitchText: {
    fontSize: typography.md,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  settingSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  settingTitle: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  settingDescription: {
    fontSize: typography.sm,
    color: colors.text,
  },
  settingList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  settingItemTitle: {
    fontSize: typography.md,
  },
  settingItemDescription: {
    
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  settingItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemText: {
    fontSize: typography.md,
    color: colors.text,
  },
  settingItemIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.md,
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
  },
  headerDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  headerButtonText: {
    fontSize: typography.md,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  settingsContainer: {
    flex: 1,
    padding: spacing.md,

  },

  header: {
    marginBottom: spacing.lg,
  },  

  subtitle: {
    fontSize: typography.md,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  settingsSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  quietHoursSection: {
    marginBottom: spacing.lg,
  },
  quietHoursTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  quietHoursDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  quietHoursButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.md,
    backgroundColor: colors.primary,
    marginBottom: spacing.sm,
  },
  quietHoursButtonText: {
    fontSize: typography.md,
    color: colors.background,
    marginLeft: spacing.sm,
  },
  notificationsSection: {
    marginBottom: spacing.lg,
  },
  notificationsTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  quietHoursCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationsCard: {
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationsCardTitle: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  quietHoursInfo: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  quietHoursTime: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  notificationsList: {
    marginTop: spacing.sm,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  notificationTitle: {
    fontSize: typography.sm,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: spacing.sm,
  },
  notificationDescription: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  notificationSwitch: {
    marginLeft: 'auto',
  },
  editButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary, // Add your desired background color here
    color: colors.white, // Add your desired text color here
  },
  editButtonText: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.white, // Add your desired text color here
  },
  helpSection: {
    padding: spacing.md,
    backgroundColor: colors.card, // Add your desired background color here
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  helpText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  helpTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold', // Add your desired text color here
    marginBottom: spacing.sm,
  },
  helpLink: {
    fontSize: typography.sm,
    color: colors.primary, // Add your desired text color here
    textDecorationLine: 'underline',
  },
  contactButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  contactButtonText: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.primary, // Add your desired text color here
  },
});