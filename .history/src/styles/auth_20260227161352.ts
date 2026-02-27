// apps/mobile/src/styles/auth.ts
import i18n from "@/i18n";
import { Dimensions, StatusBar, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  // Common styles
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 32,
    paddingBottom: 48,
  },
  header: {
    alignItems: "center",
    marginTop: 32,
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  form: {
    marginTop: 8,
  },

  // Input styles
  inputContainer: {
    marginBottom: 14,
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#0E293B",
    borderRadius: 10,
    elevation: 1,
    paddingVertical: 2,
  },
  inputIcon: {
    marginLeft: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 14,
    paddingRight: 8,
    fontWeight: "400",
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 8,
  },

  // Name container for signup
  nameContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },

  // User type selection
  userTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0E293B",
    backgroundColor: "#FFFFFF",
  },
  userTypeButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },
  userTypeTextActive: {
    color: "#FFFFFF",
  },

  // Password requirements
  requirementsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  requirementsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 11.5,
    color: "#64748B",
    marginLeft: 8,
    fontWeight: "400",
  },

  // Button styles
  button: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Link styles
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "500",
    marginLeft: 4,
  },

  // Divider
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 14,
    color: "#94A3B8",
    marginHorizontal: 16,
    fontWeight: "500",
  },

  // Signup/Login links
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 15,
    color: "#64748B",
    fontWeight: "400",
  },
  signupLink: {
    fontSize: 15,
    color: "#3B82F6",
    fontWeight: "600",
    marginLeft: 4,
  },

  // Forgot password specific
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    padding: 8,
  },
  backButtonText: {
    fontSize: 15,
    color: "#64748B",
    marginLeft: 8,
    fontWeight: "500",
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 16,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 15,
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 300,
  },
  emailText: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
    marginVertical: 8,
    textAlign: "center",
  },

  // Secondary button
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#64748B",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    minWidth: 200,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500",
  },

  //sign up

  // Add these to your existing auth.ts styles
  termsContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#0E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  termsLink: {
    color: "#3B82F6",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  // Add these to your existing auth.ts styles
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 4,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s ease",
    backgroundColor: "#10B981",
  },
  strengthInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B",
  },
  strengthIcon: {
    marginLeft: 4,
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  matchIcon: {
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  matchText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  matchSuccess: {
    color: "#10B981",
  },
  matchError: {
    color: "#EF4444",
  },

  // Add these to your existing auth.ts styles:
  // Language selector styles
  languageButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
    backgroundColor: "#FFFFFF",
    width: 96,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    minWidth: 110,
  },
  languageButtonRTL: {
    right: undefined,
    left: 20,
    zIndex: 100,
  },
  languageButtonLTR: {
    right: 20,
    left: undefined,
    zIndex: 100,
  },
  languageContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    zIndex: 100,
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
    flex: 1,
    textAlign: "center",
  },
  chevronIcon: {
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-start",
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 40 : 90,
    alignItems: i18n.language === "ar" ? "flex-start" : "flex-end",
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 8,
    width: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  languageOptionSelected: {
    backgroundColor: "#F8FAFC",
  },
  languageOptionText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500",
    flex: 1,
    marginLeft: 12,
  },
  languageOptionTextSelected: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  languageFlag: {
    fontSize: 20,
  },
  checkIcon: {
    marginLeft: 8,
  },

  // Input icon positions
  inputIconRTL: {
    marginRight: 0,
    marginLeft: 12,
  },
  inputIconLTR: {
    marginRight: 12,
    marginLeft: 0,
  },

  // Eye button positions
  eyeButtonRTL: {
    right: "auto",
    left: 12,
  },
  eyeButtonLTR: {
    right: 12,
    left: "auto",
  },

  // Forgot password alignment
  forgotPasswordRTL: {
    alignSelf: "flex-start",
  },
  forgotPasswordLTR: {
    alignSelf: "flex-end",
  },

  codeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  codeLabel: {
    fontSize: 16,
    color: "#64748B",
    marginBottom: 24,
    textAlign: "center",
  },
  inputsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  codeInputFilled: {
    borderColor: "#3B82F6",
    backgroundColor: "#F8FAFC",
  },
  resendText: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },
  resendLinkDisabled: {
    color: "#94A3B8",
  },

  codeInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  codeInput: {
    width: (width - 96) / 6, // 6 inputs with gaps
    height: 56,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    fontSize: 24,
    fontWeight: "600",
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  codeInputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  codeInputSuccess: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },

  // Input status styles
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputSuccess: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },

  // Helper text
  helperText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  // Resend container
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 16,
    flexWrap: "wrap",
  },

  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#334155",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F1F5F9",
    marginTop: 12,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  codeDisplay: {
    backgroundColor: "#0F172A",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  codeValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#818CF8",
    letterSpacing: 8,
    marginBottom: 12,
  },
  codeHint: {
    fontSize: 14,
    color: "#CBD5E1",
    textAlign: "center",
  },
  modalNote: {
    flexDirection: "row",
    backgroundColor: "#374151",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  noteText: {
    fontSize: 14,
    color: "#D1D5DB",
    marginLeft: 12,
    flex: 1,
  },
  modalButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Error/Success Styles
  errorContainer: {
    flexDirection: "row",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  successContainer: {
    flexDirection: "row",
    backgroundColor: "#DCFCE7",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  successText: {
    color: "#16A34A",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },

  // Timer Styles
  timerContainer: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    fontSize: 13,
    color: "#60A5FA",
    marginLeft: 8,
  },

  // Email Display
  emailDisplay: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  // Code Hint
  codeHintContainer: {
    flexDirection: "row",
    backgroundColor: "#374151",
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: "center",
  },
  codeHintText: {
    fontSize: 14,
    color: "#D1D5DB",
    marginLeft: 8,
    flex: 1,
  },

  // Validation
  validationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  validationText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
