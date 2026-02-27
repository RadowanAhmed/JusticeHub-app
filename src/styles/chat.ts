// apps/mobile/src/styles/chat.ts
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './global';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    ...shadows.sm,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: colors.textLight,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    left: spacing.md,
    top: Platform.OS === 'ios' ? spacing.xxl : spacing.lg,
    zIndex: 1,
    padding: spacing.sm,
  },

  // Messages List
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xl,
  },

  // Message Container
  messageContainer: {
    marginVertical: spacing.xs,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
  },

  // Message Bubble
  messageBubble: {
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.xs,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.xs,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Message Text
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.white,
  },
  aiText: {
    color: colors.text,
  },

  // Message Time
  timestamp: {
    ...typography.caption,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  aiTimestamp: {
    textAlign: 'left',
  },

  // Loading Message
  loadingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.round,
    backgroundColor: colors.textLight,
    marginHorizontal: spacing.xs,
  },

  // Input Container
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
    marginRight: spacing.md,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
    paddingVertical: spacing.sm,
    paddingRight: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.grayLight,
  },
  sendButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Attachment Button
  attachmentButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  attachmentIcon: {
    color: colors.textLight,
    fontSize: 24,
  },

  // File Attachment Preview
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  fileIcon: {
    fontSize: 24,
    color: colors.primary,
    marginRight: spacing.md,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  fileSize: {
    ...typography.caption,
    color: colors.textLight,
  },
  removeFileButton: {
    padding: spacing.sm,
  },
  removeFileIcon: {
    fontSize: 20,
    color: colors.danger,
  },

  // Quick Actions
  quickActionsContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
  },
  quickActionsTitle: {
    ...typography.bodySmall,
    color: colors.textLight,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  quickActionsScroll: {
    paddingHorizontal: spacing.md,
  },
  quickActionButton: {
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
  },
  quickActionText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },

  // Disclaimer
  disclaimer: {
    backgroundColor: colors.warning + '10',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.warning + '30',
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.warning,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },

  // Welcome Message
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  welcomeIcon: {
    fontSize: 64,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  welcomeSubtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  welcomeFeatures: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  welcomeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  welcomeFeatureIcon: {
    fontSize: 20,
    color: colors.primary,
    marginRight: spacing.md,
    width: 24,
  },
  welcomeFeatureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },

  // Suggestion Chips
  suggestionsContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  suggestionsTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionChip: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.xs,
  },
  suggestionText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginLeft: spacing.md,
    marginVertical: spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    maxWidth: '60%',
  },
  typingText: {
    ...typography.body,
    color: colors.textLight,
    marginLeft: spacing.sm,
    fontStyle: 'italic',
  },

  // Error Message
  errorMessage: {
    backgroundColor: colors.danger + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.danger,
    textAlign: 'center',
  },

  // Legal References
  legalReferences: {
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.info + '30',
  },
  legalReferencesTitle: {
    ...typography.bodySmall,
    color: colors.info,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  legalReference: {
    ...typography.caption,
    color: colors.info,
    marginBottom: spacing.xs,
    lineHeight: 16,
  },

  // Scroll to Bottom Button
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 80,
    right: spacing.md,
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
    zIndex: 100,
  },
  scrollToBottomIcon: {
    color: colors.white,
    fontSize: 20,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateIcon: {
    fontSize: 80,
    color: colors.grayLight,
    marginBottom: spacing.lg,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  // Message Actions
  messageActions: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  messageActionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
  },
  messageActionText: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 12,
  },

  // Audio Message
  audioMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  audioPlayButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  audioPlayIcon: {
    color: colors.white,
    fontSize: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioDuration: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  audioProgressBar: {
    height: 4,
    backgroundColor: colors.grayLight,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  audioProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});

// ظلال إضافية
export const extendedShadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
};

// دالة لإنشاء أنماط ديناميكية
export const createChatStyles = (theme: 'light' | 'dark' = 'light') => {
  const themeColors = theme === 'dark' ? {
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    textLight: '#aaaaaa',
    border: '#333333',
  } : {
    background: colors.background,
    card: colors.white,
    text: colors.text,
    textLight: colors.textLight,
    border: colors.border,
  };

  return StyleSheet.create({
    ...styles,
    container: {
      ...styles.container,
      backgroundColor: themeColors.background,
    },
    header: {
      ...styles.header,
      backgroundColor: themeColors.card,
      borderBottomColor: themeColors.border,
    },
    aiBubble: {
      ...styles.aiBubble,
      backgroundColor: themeColors.card,
      borderColor: themeColors.border,
    },
    aiText: {
      ...styles.aiText,
      color: themeColors.text,
    },
  });
};

// مساعدات للألوان
export const chatColors = {
  userMessage: colors.primary,
  aiMessage: colors.white,
  systemMessage: colors.grayLight,
  warning: colors.warning,
  success: colors.success,
  error: colors.danger,
  info: colors.info,
};

// مساعدات للقياسات
export const chatMetrics = {
  messageMaxWidth: width * 0.85,
  inputMaxHeight: 120,
  quickActionHeight: 36,
  typingIndicatorWidth: 100,
};

export default styles;