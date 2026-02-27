// app/auth/login.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { styles } from "@/styles/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const LANGUAGES = [
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { theme, colors, isDarkMode } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentLanguage =
    LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0];
  const isRTL = i18n.language === "ar";

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleLanguageDropdown = () => {
    if (showLanguageDropdown) {
      // Close animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowLanguageDropdown(false);
      });
    } else {
      setShowLanguageDropdown(true);
      // Open animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const selectLanguage = async (languageCode: string) => {
    if (languageCode !== i18n.language) {
      try {
        await i18n.changeLanguage(languageCode);
      } catch (error) {
        console.error("Error changing language:", error);
        showModalError(t("language.changeError"));
      }
    }
    toggleLanguageDropdown();
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

  const validatePassword = () => {
    if (!password) {
      setPasswordError(t("auth.fillAllFields"));
      return false;
    }

    if (password.length < 6) {
      setPasswordError(t("auth.passwordTooShort"));
      return false;
    }

    setPasswordError("");
    return true;
  };

  const showModalError = (message: string) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const handleLogin = async () => {
    if (!validateEmail() || !validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      // Clear any existing reset sessions
      await AsyncStorage.multiRemove([
        "has_valid_reset_session",
        "recovery_session_active",
        "reset_email",
      ]);

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        let errorMessage = t("auth.loginFailed");

        if (error.message?.includes("Invalid login credentials")) {
          errorMessage = t("auth.loginFailed");
        } else if (error.message?.includes("Email not confirmed")) {
          errorMessage = t("auth.emailNotConfirmed");
        } else if (error.message?.includes("rate limit")) {
          errorMessage = t("auth.rateLimit");
        }

        throw new Error(errorMessage);
      }

      if (!authData.user) {
        throw new Error(t("auth.loginFailed"));
      }

      console.log("Login successful, redirecting to main...");
      // Show success message
    Alert.alert(
      t("common.success"),
      t("auth.loginSuccessful"),
      [{ text: t("common.continue") }]
    );

      // Navigate to main screen
      setTimeout(() => {
        router.replace("/(main)");
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      showModalError(error.message || t("auth.loginFailed"));
    } finally {
      setLoading(false);
    }
  };

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
            padding: 24,
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

      {/* Language Selector in Top-Right Corner */}
      <TouchableOpacity
        style={[
          styles.languageButton,
          isRTL ? styles.languageButtonRTL : styles.languageButtonLTR,
          {
            backgroundColor: colors.elevated,
            borderColor: colors.border,
            top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
            width: 130,
          },
        ]}
        onPress={toggleLanguageDropdown}
        disabled={loading}
      >
        <View style={styles.languageContent}>
          <Ionicons name="globe-outline" size={20} color={colors.primary} />
          <Text
            style={[
              styles.languageText,
              {
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "600",
                marginHorizontal: 8,
              },
            ]}
          >
            {currentLanguage.name}
          </Text>
          <Ionicons
            name={showLanguageDropdown ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.textSecondary}
            style={styles.chevronIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Language Dropdown Modal */}
      <Modal
        visible={showLanguageDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleLanguageDropdown}
      >
        <TouchableWithoutFeedback onPress={toggleLanguageDropdown}>
          <View
            style={[
              styles.modalOverlay,
              { backgroundColor: "rgba(0, 0, 0, 0.7)" },
            ]}
          >
            <Animated.View
              style={[
                styles.dropdownContainer,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                  backgroundColor: colors.elevated,
                  borderColor: colors.border,
                  right: isRTL ? 20 : 20,
                  left: isRTL ? 20 : 180,
                },
              ]}
            >
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageOption,
                    currentLanguage.code === language.code && [
                      styles.languageOptionSelected,
                      { backgroundColor: colors.card },
                    ],
                    { borderBottomColor: colors.border },
                  ]}
                  onPress={() => selectLanguage(language.code)}
                >
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageOptionText,
                      currentLanguage.code === language.code &&
                        styles.languageOptionTextSelected,
                      {
                        color:
                          currentLanguage.code === language.code
                            ? colors.primary
                            : colors.textPrimary,
                        fontSize: 14,
                      },
                    ]}
                  >
                    {language.name}
                  </Text>
                  {currentLanguage.code === language.code && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Header */}
            <View style={[styles.header, { marginBottom: 32 }]}>
              <View
                style={[
                  styles.logoContainer,
                  {
                    backgroundColor: colors.elevated,
                    borderColor: colors.border,
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                  },
                ]}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={44}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                    fontSize: 28,
                    marginTop: 20,
                    marginBottom: 8,
                    fontWeight: "700",
                  },
                ]}
              >
                {t("common.welcome")}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                    fontSize: 16,
                    lineHeight: 22,
                  },
                ]}
              >
                {t("auth.loginToContinue")}
              </Text>
            </View>

            {/* Form */}
            <View style={[styles.form, { marginTop: 8 }]}>
              {/* Email Input */}
              <View style={[styles.inputContainer, { marginBottom: 20 }]}>
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
                      position: "relative",
                    },
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.textTertiary}
                    style={{
                      position: "absolute",
                      [isRTL ? "right" : "left"]: 12,
                      top: "50%",
                      transform: [{ translateY: -10 }], // Half of icon size (20/2)
                      zIndex: 1,
                    }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.textPrimary,
                        fontSize: 16,
                        paddingVertical: 14,
                        paddingLeft: isRTL ? 12 : 44,
                        paddingRight: isRTL ? 44 : 12,
                        width: "100%",
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
                    autoComplete="email"
                    editable={!loading}
                    returnKeyType="next"
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

              {/* Password Input */}
              <View style={[styles.inputContainer, { marginBottom: 20 }]}>
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
                  {t("auth.password")}
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      backgroundColor: colors.card,
                      borderColor: passwordError
                        ? colors.danger
                        : colors.border,
                      borderWidth: 1.5,
                      borderRadius: 12,
                      position: "relative",
                    },
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.textTertiary}
                    style={{
                      position: "absolute",
                      [isRTL ? "right" : "left"]: 12,
                      top: "50%",
                      transform: [{ translateY: -10 }],
                      zIndex: 1,
                    }}
                  />
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: colors.textPrimary,
                        fontSize: 16,
                        paddingVertical: 14,
                        paddingLeft: isRTL ? 48 : 44,
                        paddingRight: isRTL ? 44  : 48, // Extra space for show/hide button
                        width: "100%",
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
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      [isRTL ? "left" : "right"]: 12,
                      top: "50%",
                      transform: [{ translateY: -11 }], // Half of touch area (22/2)
                      padding: 4,
                    }}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={22}
                      color={colors.textSecondary}
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
                ) : null}
              </View>

              {/* Forgot Password */}
              <TouchableOpacity
                style={{
                  alignSelf: isRTL ? "flex-start" : "flex-end",
                  marginBottom: 24,
                  marginTop: 8,
                }}
                onPress={() => router.push("/(auth)/forgot-password")}
                disabled={loading}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {t("auth.forgotPassword")}
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  loading && styles.buttonDisabled,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: 12,
                    paddingVertical: 16,
                    marginTop: 8,
                  },
                ]}
                onPress={handleLogin}
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
                    {t("common.login")}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.divider, { marginVertical: 24 }]}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
                <Text
                  style={[
                    styles.dividerText,
                    {
                      color: colors.textSecondary,
                      fontSize: 14,
                      fontWeight: "500",
                    },
                  ]}
                >
                  {t("auth.or")}
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              {/* Sign Up Link */}
              <View style={[styles.signupContainer, { marginTop: 16 }]}>
                <Text
                  style={[
                    styles.signupText,
                    {
                      color: colors.textSecondary,
                      fontSize: 15,
                    },
                  ]}
                >
                  {t("auth.noAccount")}{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signup")}
                  disabled={loading}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 15,
                      fontWeight: "600",
                    }}
                  >
                    {t("common.signup")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorModal />
    </View>
  );
}
