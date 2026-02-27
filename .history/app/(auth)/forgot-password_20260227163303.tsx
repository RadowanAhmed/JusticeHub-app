// app/auth/forgot-password.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { passwordResetManager } from "@/lib/passwordResetManager";
import { supabase } from "@/lib/supabase";
import { styles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  AppState,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { theme, colors, isDarkMode } = useTheme();

  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const codeInputs = useRef<(TextInput | null)[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isRTL = i18n.language === "ar";

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === "background" || nextAppState === "inactive") {
        const hasValidSession = await AsyncStorage.getItem(
          "has_valid_reset_session",
        );
        const isResetInProgress =
          await passwordResetManager.isResetInProgress();

        if (
          (hasValidSession === "true" || isResetInProgress) &&
          step !== "password"
        ) {
          console.log(
            "App going to background with incomplete reset - cleaning up",
          );
          setTimeout(async () => {
            await passwordResetManager.clearSession();
            await AsyncStorage.multiRemove([
              "has_valid_reset_session",
              "recovery_session_active",
            ]);
          }, 1000);
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [step]);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Simple database check - query your users table directly
      const { data, error } = await supabase
        .from("users") // Make sure this matches your actual table name
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (error) {
        console.error("Error checking email:", error);
        return false;
      }

      console.log("Email check result:", data ? "✅ Found" : "❌ Not found");
      return !!data; // Returns true if user exists
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const showSuccess = (message: string) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError(t("auth.enterEmail"));
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setEmailError(t("auth.invalidEmail"));
      return false;
    }

    setEmailError("");
    return true;
  };

  const validateCode = () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setCodeError(t("auth.codeIncomplete"));
      return false;
    }
    setCodeError("");
    return true;
  };

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      setPasswordError(t("auth.fillAllFields"));
      return false;
    }

    if (password.length < 6) {
      setPasswordError(t("auth.passwordTooShort"));
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError(t("auth.passwordsNotMatch"));
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Store email for later (we'll need it for verification)
      setVerifiedEmail(cleanEmail);

      // Send reset email - Supabase handles existence check
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: "yourapp://reset-password", // Update this to your app scheme
      });

      if (error) {
        console.error("Reset password error:", error);

        // Handle specific error cases
        if (
          error.message?.includes("rate limit") ||
          error.message?.includes("too many requests")
        ) {
          showError(
            t("auth.rateLimitExceeded") ||
              "Too many attempts. Please try again later.",
          );
        } else if (
          error.message?.includes("not found") ||
          error.message?.includes("no user")
        ) {
          // For security, you might want to show a generic message instead
          showError(
            t("auth.emailNotFound") || "No account found with this email.",
          );
        } else if (error.message?.includes("not confirmed")) {
          showError(
            t("auth.emailNotConfirmed") || "Please verify your email first.",
          );
        } else {
          showError(
            t("auth.sendCodeError") || "Failed to send code. Please try again.",
          );
        }

        setLoading(false);
        return;
      }

      // Success - code sent
      console.log("✅ Reset code sent successfully");
      setStep("code");
      setCountdown(600); // 10 minutes

      // Focus first code input
      setTimeout(() => {
        codeInputs.current[0]?.focus();
      }, 100);

      showSuccess(t("auth.codeSentMessage") || "Verification code sent!");
    } catch (error: any) {
      console.error("Unexpected error:", error);
      showError(
        t("auth.connectionError") ||
          "Network error. Please check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateCode()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const fullCode = code.join("");
      const { data, error } = await supabase.auth.verifyOtp({
        email: verifiedEmail || email.trim().toLowerCase(),
        token: fullCode,
        type: "recovery",
      });

      if (error) {
        let errorMessage = t("auth.invalidCode");

        if (error.message?.includes("rate limit")) {
          errorMessage = t("auth.tooManyAttempts");
        } else if (error.message?.includes("invalid token")) {
          errorMessage = t("auth.invalidCode");
        } else if (error.message?.includes("expired")) {
          errorMessage = t("auth.codeExpired");
        } else if (error.message?.includes("already used")) {
          errorMessage = t("auth.codeExpired");
        }

        showError(errorMessage);
        setLoading(false);
        return;
      }

      console.log("OTP verified successfully:", data);

      // Store reset session data
      await AsyncStorage.multiSet([
        ["reset_email", verifiedEmail || email.trim().toLowerCase()],
        ["has_valid_reset_session", "true"],
        ["reset_session_timestamp", Date.now().toString()],
        ["recovery_session_active", "true"],
      ]);

      await passwordResetManager.startResetSession();

      setStep("password");
      setCountdown(0);

      showSuccess(t("auth.codeVerified"));
    } catch (error: any) {
      console.error("Error:", error);
      showError(t("auth.verificationError"));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (error) {
        throw new Error(error.message || t("auth.resetError"));
      }

      await handleResetSuccess();
    } catch (error: any) {
      console.error("Reset error:", error);
      showError(error.message || t("auth.resetError"));
      setLoading(false);
    }
  };

  const handleResetSuccess = async () => {
    console.log(
      "Password reset completed successfully - signing out recovery session",
    );

    await supabase.auth.signOut();

    await AsyncStorage.multiRemove([
      "reset_email",
      "has_valid_reset_session",
      "reset_session_timestamp",
      "recovery_session_active",
    ]);

    await passwordResetManager.completeResetProcess();

    console.log("All sessions cleared, navigating to login...");

    setEmail("");
    setCode(["", "", "", "", "", ""]);
    setPassword("");
    setConfirmPassword("");
    setVerifiedEmail("");
    setStep("email");

    router.replace("/(auth)/login");

    setTimeout(() => {
      showSuccess(t("auth.passwordResetSuccess"));
    }, 500);
  };

  const handleCodeChange = (text: string, index: number) => {
    const numericText = text.replace(/[^0-9]/g, "");

    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);
    setCodeError("");

    // Move to next input if text is entered
    if (numericText && index < 5) {
      setTimeout(() => {
        codeInputs.current[index + 1]?.focus();
      }, 10);
    }

    // Auto-verify when all digits are entered
    if (index === 5 && numericText && newCode.every((digit) => digit !== "")) {
      setTimeout(() => handleVerifyCode(), 300);
    }
  };

  const handleCodeKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      setTimeout(() => {
        codeInputs.current[index - 1]?.focus();
      }, 10);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) {
      showError(`${t("auth.resendIn")} ${formatCountdown(countdown)}`);
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const emailToUse = verifiedEmail || email;
      const emailExists = await checkEmailExists(emailToUse);

      if (!emailExists) {
        showError(t("auth.emailNotFound"));
        setLoading(false);
        return;
      }

      await supabase.auth.signOut();
      await passwordResetManager.endResetSession();
      await AsyncStorage.multiRemove([
        "has_valid_reset_session",
        "reset_session_timestamp",
        "recovery_session_active",
      ]);

      const { error } = await supabase.auth.signInWithOtp({
        email: emailToUse,
        options: {
          emailRedirectTo: "yourapp://reset-password",
          shouldCreateUser: false,
        },
      });

      if (error) {
        showError(t("auth.resendFailed"));
      } else {
        setCountdown(600);
        setCode(["", "", "", "", "", ""]);
        showSuccess(t("auth.codeResent"));
      }
    } catch (error: any) {
      showError(t("auth.connectionError"));
    } finally {
      setLoading(false);
    }
  };

  const handleBack = async () => {
    if (step === "code" || step === "password") {
      console.log("Cleaning up reset session due to back navigation");
      await supabase.auth.signOut();
      await passwordResetManager.endResetSession();
      await AsyncStorage.multiRemove([
        "reset_email",
        "has_valid_reset_session",
        "reset_session_timestamp",
        "recovery_session_active",
      ]);
    }

    if (step === "code") {
      setStep("email");
      setErrorMessage("");
      setCode(["", "", "", "", "", ""]);
      setCountdown(0);
      setVerifiedEmail("");
      setEmailError("");
    } else if (step === "password") {
      setStep("code");
      setErrorMessage("");
      setPassword("");
      setConfirmPassword("");
      setPasswordError("");
    }
  };

  const handleBackToLogin = async () => {
    await supabase.auth.signOut();
    await passwordResetManager.clearSession();
    await AsyncStorage.multiRemove([
      "has_valid_reset_session",
      "recovery_session_active",
    ]);

    router.push("/(auth)/login");
  };

  const renderEmailStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.header, { marginTop: 40 }]}>
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="key" size={44} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: 24,
              marginTop: 16,
              marginBottom: 8,
            },
          ]}
        >
          {t("auth.resetPassword")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontSize: 15,
              lineHeight: 22,
              textAlign: "center",
            },
          ]}
        >
          {t("auth.enterEmailToReset")}
        </Text>
      </View>

      <View style={[styles.form, { marginTop: 32 }]}>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {
                color: colors.textPrimary,
                fontSize: 14,
                marginBottom: 8,
                fontWeight: "600",
              },
            ]}
          >
            {t("auth.email")}
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.card,
                borderColor: emailError ? colors.danger : colors.border,
                borderWidth: 1.5,
                borderRadius: 12,
                paddingHorizontal: 0,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={colors.textTertiary}
              style={{ marginHorizontal: 12 }}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  fontSize: 16,
                  paddingVertical: 14,
                  flex: 1,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              placeholder="example@email.com"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
              autoFocus
              onSubmitEditing={handleSendCode}
              returnKeyType="go"
            />
          </View>
          {emailError ? (
            <Text
              style={{
                color: colors.danger,
                fontSize: 12,
                marginTop: 6,
                marginLeft: 4,
              }}
            >
              {emailError}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            {
              backgroundColor: colors.primary,
              marginTop: 24,
              borderRadius: 12,
              paddingVertical: 16,
            },
          ]}
          onPress={handleSendCode}
          disabled={loading || !email.trim()}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: 16,
                  fontWeight: "600",
                },
              ]}
            >
              {t("auth.sendVerificationCode")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.backButton,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
              padding: 12,
            },
          ]}
          onPress={handleBackToLogin}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
          <Text
            style={[
              styles.backButtonText,
              {
                color: colors.textSecondary,
                fontSize: 15,
                marginLeft: 8,
                fontWeight: "500",
              },
            ]}
          >
            {t("auth.backToLogin")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderCodeStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.header, { marginTop: 40 }]}>
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="shield-checkmark" size={44} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: 24,
              marginTop: 16,
              marginBottom: 8,
            },
          ]}
        >
          {t("auth.enterCode")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 12,
              textAlign: "center",
            },
          ]}
        >
          {t("auth.codeSentTo")}:
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.primary,
              fontSize: 15,
              fontWeight: "600",
              marginBottom: 20,
              textAlign: "center",
            },
          ]}
        >
          {verifiedEmail || email}
        </Text>

        {countdown > 0 && (
          <View
            style={{
              backgroundColor: colors.elevated,
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: colors.info,
                textAlign: "center",
                fontWeight: "500",
              }}
            >
              {t("auth.codeExpiresIn")} {formatCountdown(countdown)}
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.form, { alignItems: "center" }]}>
        <Text
          style={[
            styles.label,
            {
              textAlign: "center",
              marginBottom: 16,
              color: colors.textPrimary,
              fontSize: 15,
              fontWeight: "600",
            },
          ]}
        >
          {t("auth.enter6DigitCode")}
        </Text>

        <View style={[styles.codeInputsContainer, { marginBottom: 32 }]}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (codeInputs.current[index] = ref)}
              style={[
                styles.codeInput,
                digit && [
                  styles.codeInputFilled,
                  { borderColor: colors.primary },
                ],
                {
                  backgroundColor: colors.card,
                  borderColor: codeError ? colors.danger : colors.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  color: colors.textPrimary,
                  fontSize: 24,
                  fontWeight: "600",
                  width: (SCREEN_WIDTH - 120) / 6,
                  height: 56,
                  textAlign: "center",
                },
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              onKeyPress={(e) => handleCodeKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
              textAlign="center"
              autoFocus={index === 0}
              contextMenuHidden={true}
              caretHidden={true}
            />
          ))}
        </View>

        {codeError ? (
          <Text
            style={{
              color: colors.danger,
              fontSize: 14,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {codeError}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            {
              backgroundColor: colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              width: "100%",
            },
          ]}
          onPress={handleVerifyCode}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: 16,
                  fontWeight: "600",
                },
              ]}
            >
              {t("auth.verifyCode")}
            </Text>
          )}
        </TouchableOpacity>

        <View style={[styles.resendContainer, { marginTop: 24 }]}>
          <Text
            style={[
              styles.resendText,
              {
                color: colors.textSecondary,
                fontSize: 14,
              },
            ]}
          >
            {t("auth.didNotReceiveCode")}{" "}
          </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={loading || countdown > 0}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.resendLink,
                (loading || countdown > 0) && styles.resendLinkDisabled,
                {
                  color: colors.primary,
                  fontSize: 14,
                  fontWeight: "600",
                },
              ]}
            >
              {countdown > 0
                ? `${t("auth.resendIn")} ${formatCountdown(countdown)}`
                : t("auth.resendCode")}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.backButton,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
              padding: 12,
            },
          ]}
          onPress={handleBack}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
          <Text
            style={[
              styles.backButtonText,
              {
                color: colors.textSecondary,
                fontSize: 15,
                marginLeft: 8,
                fontWeight: "500",
              },
            ]}
          >
            {t("auth.changeEmail")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderPasswordStep = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.header, { marginTop: 40 }]}>
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: colors.elevated,
              borderColor: colors.border,
            },
          ]}
        >
          <Ionicons name="lock-open" size={44} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              fontSize: 24,
              marginTop: 16,
              marginBottom: 8,
            },
          ]}
        >
          {t("auth.createNewPassword")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
              fontSize: 15,
              lineHeight: 22,
              marginBottom: 8,
              textAlign: "center",
            },
          ]}
        >
          {t("auth.enterNewPasswordMessage")}
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: colors.primary,
              fontSize: 15,
              fontWeight: "600",
              marginBottom: 20,
              textAlign: "center",
            },
          ]}
        >
          {verifiedEmail || email}
        </Text>
      </View>

      <View style={[styles.form, { marginTop: 24 }]}>
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.label,
              {
                color: colors.textPrimary,
                fontSize: 14,
                marginBottom: 8,
                fontWeight: "600",
              },
            ]}
          >
            {t("auth.newPassword")}
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.card,
                borderColor: passwordError ? colors.danger : colors.border,
                borderWidth: 1.5,
                borderRadius: 12,
                paddingHorizontal: 0,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textTertiary}
              style={{ marginHorizontal: 12 }}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  fontSize: 16,
                  paddingVertical: 14,
                  flex: 1,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              editable={!loading}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ padding: 12 }}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              color: colors.textTertiary,
              fontSize: 12,
              marginTop: 6,
              marginLeft: 4,
            }}
          >
            {t("auth.min6Characters")}
          </Text>
        </View>

        <View style={[styles.inputContainer, { marginTop: 16 }]}>
          <Text
            style={[
              styles.label,
              {
                color: colors.textPrimary,
                fontSize: 14,
                marginBottom: 8,
                fontWeight: "600",
              },
            ]}
          >
            {t("auth.confirmNewPassword")}
          </Text>
          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: colors.card,
                borderColor: passwordError ? colors.danger : colors.border,
                borderWidth: 1.5,
                borderRadius: 12,
                paddingHorizontal: 0,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={colors.textTertiary}
              style={{ marginHorizontal: 12 }}
            />
            <TextInput
              style={[
                styles.input,
                {
                  color: colors.textPrimary,
                  fontSize: 16,
                  paddingVertical: 14,
                  flex: 1,
                  textAlign: isRTL ? "right" : "left",
                },
              ]}
              placeholder="••••••••"
              placeholderTextColor={colors.textTertiary}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setPasswordError("");
              }}
              secureTextEntry={!showConfirmPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ padding: 12 }}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text
              style={{
                color: colors.danger,
                fontSize: 12,
                marginTop: 6,
                marginLeft: 4,
              }}
            >
              {passwordError}
            </Text>
          ) : password && confirmPassword && password === confirmPassword ? (
            <Text
              style={{
                color: colors.success,
                fontSize: 12,
                marginTop: 6,
                marginLeft: 4,
                fontWeight: "600",
              }}
            >
              ✓ {t("auth.passwordsMatch")}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.buttonDisabled,
            {
              backgroundColor: colors.primary,
              marginTop: 32,
              borderRadius: 12,
              paddingVertical: 16,
            },
          ]}
          onPress={handleResetPassword}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  fontSize: 16,
                  fontWeight: "600",
                },
              ]}
            >
              {t("auth.resetPasswordButton")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.backButton,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 24,
              padding: 12,
            },
          ]}
          onPress={handleBack}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textSecondary} />
          <Text
            style={[
              styles.backButtonText,
              {
                color: colors.textSecondary,
                fontSize: 15,
                marginLeft: 8,
                fontWeight: "500",
              },
            ]}
          >
            {t("common.back")}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const ErrorModal = () => (
    <Modal
      visible={showErrorModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowErrorModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowErrorModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 24,
                width: "100%",
                maxWidth: 400,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.danger + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons name="alert-circle" size={32} color={colors.danger} />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.textPrimary,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                {t("common.error")}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 24,
                }}
              >
                {modalMessage}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.danger,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={() => setShowErrorModal(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: colors.textInverse,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {t("common.ok")}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const SuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowSuccessModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 24,
                width: "100%",
                maxWidth: 400,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: colors.success + "20",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={32}
                  color={colors.success}
                />
              </View>

              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: colors.textPrimary,
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                {t("common.success")}
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: "center",
                  lineHeight: 22,
                  marginBottom: 24,
                }}
              >
                {modalMessage}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.success,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 12,
                  width: "100%",
                  alignItems: "center",
                }}
                onPress={() => setShowSuccessModal(false)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: colors.textInverse,
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {t("common.ok")}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === "email" && renderEmailStep()}
          {step === "code" && renderCodeStep()}
          {step === "password" && renderPasswordStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={{ flex: 1 }}>
        <ErrorModal />
      </View>
      <SuccessModal />
    </View>
  );
}
