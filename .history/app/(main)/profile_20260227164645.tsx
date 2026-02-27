import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, profile, signOut, updateProfile, refreshProfile } = useAuth();
  const { theme, toggleTheme, colors, isDarkMode } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDarkMode);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    country: "",
    city: "",
    address: "",
    bio: "",
  });

  // Stats data
  const [stats, setStats] = useState({
    cases: 0,
    consultations: 0,
    documents: 0,
    appointments: 0,
  });

  // Menu items with enhanced icons
  const menuItems = [
    {
      id: "edit-profile",
      title: t("profile.menu.editProfile"),
      icon: "edit-3",
      color: colors.primary,
      onPress: () => setShowEditModal(true),
    },
    {
      id: "documents",
      title: t("profile.menu.myDocuments"),
      icon: "file-text",
      color: colors.warning,
      route: "/(main)/documents",
    },
    {
      id: "appointments",
      title: t("profile.menu.myAppointments"),
      icon: "calendar",
      color: colors.success,
      route: "/(main)/appointments",
    },
    {
      id: "notifications",
      title: t("profile.menu.notifications"),
      icon: "bell",
      color: colors.accent,
      route: "/(main)/notifications",
    },
    {
      id: "settings",
      title: t("profile.menu.settings"),
      icon: "settings",
      color: colors.textSecondary,
      onPress: () => setShowSettingsModal(true),
    },
    {
      id: "help",
      title: t("profile.menu.helpSupport"),
      icon: "help-circle",
      color: colors.danger,
      onPress: () => Linking.openURL("mailto:support@orient.com"),
    },
    {
      id: "about",
      title: t("profile.menu.about"),
      icon: "info",
      color: colors.info,
      onPress: () => router.push("/(main)/about"),
    },
  ];

  useEffect(() => {
    if (user && !profile) {
      // If user exists but profile is null, try to refresh
      refreshProfile();
    }

    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        date_of_birth: profile.date_of_birth || "",
        gender: profile.gender || "",
        country: profile.country || "",
        city: profile.city || "",
        address: profile.address || "",
        bio: profile.bio || "",
      });
    }

    if (user) {
      fetchStats();
    }
  }, [profile, user]);

  useEffect(() => {
    setDarkModeEnabled(isDarkMode);
  }, [isDarkMode]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [
        casesResult,
        conversationsResult,
        documentsResult,
        appointmentsResult,
      ] = await Promise.all([
        supabase
          .from("cases")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("legal_documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      setStats({
        cases: casesResult.count || 0,
        consultations: conversationsResult.count || 0,
        documents: documentsResult.count || 0,
        appointments: appointmentsResult.count || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(t("profile.logout.title"), t("profile.logout.message"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("profile.logout.confirm"),
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/(auth)/login");
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert(t("common.error"), t("common.error"));
          }
        },
      },
    ]);
  };

  const handleEditProfile = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      Alert.alert(t("common.error"), t("auth.fillAllFields"));
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      setShowEditModal(false);
      Alert.alert(t("common.success"), t("profile.profileUpdated"));
      refreshProfile(); // Refresh profile after update
    } catch (error: any) {
      Alert.alert(t("common.error"), error.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t("common.error"),
          t(
            "profile.permissionDenied",
            "Permission to access photos is required",
          ),
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        Alert.alert(t("common.success"), t("profile.imageUpdated"));
        refreshProfile();
      }
    } catch (error) {
      console.error("Image pick error:", error);
      Alert.alert(t("common.error"), t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (value: boolean) => {
    setDarkModeEnabled(value);
    toggleTheme(value ? "dark" : "light");
  };

  const getCompletionPercentage = () => {
    if (!profile) return 0;

    let completed = 0;
    const fields = [
      profile?.first_name,
      profile?.last_name,
      profile?.phone,
      profile?.date_of_birth,
      profile?.gender,
      profile?.country,
      profile?.city,
    ];

    fields.forEach((field) => {
      if (field && field.trim().length > 0) completed++;
    });

    return Math.round((completed / fields.length) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  // Get user initials safely
  const getUserInitials = () => {
    if (!profile) return "U";
    const first = profile.first_name?.[0] || "";
    const last = profile.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  // Get user full name safely
  const getUserFullName = () => {
    if (!profile) return "User";
    return (
      `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User"
    );
  };

  // Get user email safely
  const getUserEmail = () => {
    return profile?.email || user?.email || "";
  };

  // Create styles with theme colors
  const styles = StyleSheet.create({
    // Container
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },

    // Profile Header
    profileHeader: {
      backgroundColor: colors.card,
      padding: 20,
      alignItems: "center",
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      elevation: 4,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    profileImageContainer: {
      position: "relative",
      marginBottom: 12,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 4,
      borderColor: colors.border,
      backgroundColor: colors.primary + "20", // Add background color
    },
    editImageButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: colors.card,
      elevation: 2,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
    },
    verifiedBadge: {
      position: "absolute",
      top: 0,
      right: 0,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
      elevation: 2,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 2,
    },
    profileName: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: isDarkMode ? "#422006" : "#fffbeb",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 12,
    },
    ratingText: {
      fontSize: 11,
      color: colors.warning,
      fontWeight: "500",
      marginLeft: 4,
    },
    completionContainer: {
      width: "100%",
      marginBottom: 20,
    },
    completionTextRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    completionText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    completionPercentage: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.primary,
    },
    completionBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 10,
    },
    completionFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    completionHint: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: "center",
    },
    editProfileButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.elevated,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editProfileText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "600",
    },

    // Stats Container
    statsContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      margin: 16,
      borderRadius: 12,
      padding: 16,
      elevation: 4,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      backgroundColor: colors.elevated,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontWeight: "500",
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
    },

    // Section
    section: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      flex: 1,
    },

    // Info Card
    infoCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 6,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    infoIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: colors.elevated,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.textPrimary,
    },
    verifyBadge: {
      backgroundColor: isDarkMode
        ? colors.success + "20"
        : colors.success + "10",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDarkMode ? colors.success + "40" : colors.success + "20",
    },
    verifyText: {
      fontSize: 11,
      color: colors.success,
      fontWeight: "600",
    },
    infoDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 16,
    },

    // Settings Card
    settingsCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 6,
    },
    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 18,
    },
    settingInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: colors.elevated,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    settingDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 20,
    },

    // Menu Card
    menuCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 6,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: colors.elevated,
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },

    // Actions Card
    actionsCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
      overflow: "hidden",
      elevation: 3,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 6,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
      backgroundColor: colors.elevated,
    },
    actionText: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    dangerText: {
      color: colors.danger,
    },
    actionDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 18,
    },

    // Logout Button
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.card,
      marginHorizontal: 20,
      marginBottom: 30,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.danger + "40",
      elevation: 2,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      gap: 8,
    },
    logoutText: {
      fontSize: 16,
      color: colors.danger,
      fontWeight: "600",
    },

    // Version Container
    versionContainer: {
      alignItems: "center",
      padding: 16,
      paddingBottom: 30,
    },
    logo: {
      width: 48,
      height: 48,
      borderRadius: 12,
      marginBottom: 12,
      backgroundColor: colors.elevated,
    },
    appName: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
      letterSpacing: 1,
    },
    versionText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
      fontWeight: "500",
    },
    copyrightText: {
      fontSize: 12,
      color: colors.textTertiary,
      fontWeight: "500",
    },

    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: colors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: "90%",
      elevation: 5,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: isDarkMode ? 0.5 : 0.1,
      shadowRadius: 8,
    },
    settingsModal: {
      maxHeight: "80%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    modalCloseButton: {
      padding: 4,
    },
    modalContent: {
      padding: 20,
      maxHeight: 400,
    },
    modalSectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 12,
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    formGroup: {
      marginBottom: 16,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 6,
    },
    formInput: {
      backgroundColor: colors.elevated,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      color: colors.textPrimary,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    genderOptions: {
      flexDirection: "row",
      gap: 12,
    },
    genderOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: 12,
      gap: 8,
      backgroundColor: colors.elevated,
    },
    genderOptionSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    genderText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    genderTextSelected: {
      color: colors.textInverse,
    },
    modalFooter: {
      flexDirection: "row",
      padding: 20,
      paddingTop: 0,
      gap: 12,
    },
    cancelButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: "center",
      backgroundColor: colors.elevated,
    },
    cancelButtonText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    saveButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 15,
      borderRadius: 12,
      backgroundColor: colors.primary,
      gap: 8,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    saveButtonText: {
      fontSize: 16,
      color: colors.textInverse,
      fontWeight: "600",
    },
    closeButton: {
      flex: 1,
      padding: 15,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    closeButtonText: {
      fontSize: 16,
      color: colors.textInverse,
      fontWeight: "600",
      textAlign: "center",
    },
  });

  // If no profile and still loading, show loading
  if (!profile && loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary }}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  profile?.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserFullName())}&background=${colors.primary.replace("#", "")}&color=ffffff&size=128`,
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={handleImagePick}
              disabled={loading}
            >
              <Feather name="camera" size={16} color={colors.textInverse} />
            </TouchableOpacity>
            {completionPercentage === 100 && (
              <View style={styles.verifiedBadge}>
                <Feather name="check-circle" size={16} color={colors.success} />
              </View>
            )}
          </View>

          <Text style={styles.profileName}>{getUserFullName()}</Text>
          <Text style={styles.profileEmail}>{getUserEmail()}</Text>

          {/* Rating Badge */}
          <View style={styles.ratingBadge}>
            <Feather name="star" size={14} color={colors.warning} />
            <Text style={styles.ratingText}>
              4.8 • {t("profile.memberSince")} 2024
            </Text>
          </View>

          {/* Profile Completion */}
          <View style={styles.completionContainer}>
            <View style={styles.completionTextRow}>
              <Text style={styles.completionText}>
                {t("profile.completion", "اكتمال الملف الشخصي")}
              </Text>
              <Text style={styles.completionPercentage}>
                {completionPercentage}%
              </Text>
            </View>
            <View style={styles.completionBar}>
              <View
                style={[
                  styles.completionFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.completionHint}>
              {completionPercentage < 100
                ? t(
                    "profile.completeProfileHint",
                    "أكمل ملفك الشخصي للحصول على تجربة أفضل",
                  )
                : t("profile.completeProfileDone", "ملفك الشخصي مكتمل!")}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowEditModal(true)}
            disabled={loading}
          >
            <Feather name="edit-3" size={16} color={colors.primary} />
            <Text style={styles.editProfileText}>
              {t("profile.editProfile")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Feather name="briefcase" size={20} color={colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.cases}</Text>
            <Text style={styles.statLabel}>{t("profile.stats.cases")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.warning + "20" },
              ]}
            >
              <Feather name="message-square" size={20} color={colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.consultations}</Text>
            <Text style={styles.statLabel}>
              {t("profile.stats.consultations")}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.success + "20" },
              ]}
            >
              <Feather name="file-text" size={20} color={colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.documents}</Text>
            <Text style={styles.statLabel}>{t("profile.stats.documents")}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View
              style={[styles.statIcon, { backgroundColor: colors.info + "20" }]}
            >
              <Feather name="calendar" size={20} color={colors.info} />
            </View>
            <Text style={styles.statValue}>{stats.appointments}</Text>
            <Text style={styles.statLabel}>
              {t("home.stats.upcomingAppointments")}
            </Text>
          </View>
        </View>

        {/* Account Information - Enhanced */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="user" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("profile.personalInfo")}</Text>
            <TouchableOpacity onPress={() => setShowEditModal(true)}>
              <Feather name="edit-2" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Feather name="user" size={16} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t("auth.fullName")}</Text>
                <Text style={styles.infoValue}>{getUserFullName()}</Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.success + "20" },
                ]}
              >
                <Feather name="mail" size={16} color={colors.success} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t("auth.email")}</Text>
                <Text style={styles.infoValue}>{getUserEmail()}</Text>
              </View>
              <TouchableOpacity style={styles.verifyBadge}>
                <Text style={styles.verifyText}>{t("profile.verified")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.warning + "20" },
                ]}
              >
                <Feather name="phone" size={16} color={colors.warning} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t("profile.phone")}</Text>
                <Text style={styles.infoValue}>
                  {profile?.phone || t("profile.notSet")}
                </Text>
              </View>
            </View>

            <View style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View
                style={[
                  styles.infoIconContainer,
                  { backgroundColor: colors.info + "20" },
                ]}
              >
                <Feather name="calendar" size={16} color={colors.info} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{t("profile.dateOfBirth")}</Text>
                <Text style={styles.infoValue}>
                  {profile?.date_of_birth || t("profile.notSet")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Settings - Enhanced */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="settings" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {t("profile.quickSettings")}
            </Text>
          </View>
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.warning + "20" },
                  ]}
                >
                  <Feather name="bell" size={20} color={colors.warning} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    {t("profile.notifications")}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {t("profile.notificationsDesc")}
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                ios_backgroundColor={colors.border}
                thumbColor={colors.card}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.accent + "20" },
                  ]}
                >
                  <Feather name="moon" size={20} color={colors.accent} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    {t("profile.darkMode")}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {t("profile.darkModeDesc")}
                  </Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={handleThemeChange}
                trackColor={{ false: colors.border, true: colors.primary }}
                ios_backgroundColor={colors.border}
                thumbColor={colors.card}
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Feather name="globe" size={20} color={colors.primary} />
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    {t("profile.language")}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {t("profile.languageDesc", "تغيير لغة التطبيق")}
                  </Text>
                </View>
              </View>
              <LanguageSwitcher />
            </View>
          </View>
        </View>

        {/* Menu Items - Enhanced */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="menu" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>{t("profile.menu.title")}</Text>
          </View>
          <View style={styles.menuCard}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress || (() => router.push(item.route as any))}
                disabled={loading}
              >
                <View style={styles.menuItemLeft}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Feather
                      name={item.icon as any}
                      size={18}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.menuText}>{item.title}</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account Actions - Enhanced */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shield" size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {t("profile.accountActions")}
            </Text>
          </View>
          <View style={styles.actionsCard}>
            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Feather name="lock" size={18} color={colors.primary} />
              </View>
              <Text style={styles.actionText}>
                {t("profile.changePassword", "تغيير كلمة المرور")}
              </Text>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: colors.danger + "20" },
                ]}
              >
                <Feather name="trash-2" size={18} color={colors.danger} />
              </View>
              <Text style={[styles.actionText, styles.dangerText]}>
                {t("profile.deleteAccount", "حذف الحساب")}
              </Text>
              <Feather
                name="chevron-right"
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={18} color={colors.danger} />
          <Text style={styles.logoutText}>{t("profile.logout.title")}</Text>
        </TouchableOpacity>

        {/* App Version - Enhanced */}
        <View style={styles.versionContainer}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=ORIENT&background=${colors.primary.replace("#", "")}&color=ffffff&size=64`,
            }}
            style={[
              styles.logo,
              { borderWidth: 1, borderColor: colors.border },
            ]}
          />
          <Text style={styles.appName}>ORIENT</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
          <Text style={styles.copyrightText}>
            © 2024 Orient. {t("splash.allRightsReserved")}
          </Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal - Enhanced */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("profile.editProfile")}</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowEditModal(false)}
              >
                <Feather name="x" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={[styles.modalSectionTitle, { color: colors.primary }]}
              >
                <Feather name="user" size={16} color={colors.primary} />{" "}
                {t("profile.personalInfo")}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("auth.firstName")} *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.first_name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, first_name: text })
                  }
                  placeholder={t("auth.firstNamePlaceholder")}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("auth.lastName")} *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.last_name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, last_name: text })
                  }
                  placeholder={t("auth.lastNamePlaceholder")}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.phone")}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  placeholder="+966 5X XXX XXXX"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.dateOfBirth")}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.date_of_birth}
                  onChangeText={(text) =>
                    setFormData({ ...formData, date_of_birth: text })
                  }
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <Text
                style={[styles.modalSectionTitle, { color: colors.success }]}
              >
                <Feather name="map-pin" size={16} color={colors.success} />{" "}
                {t("profile.addressInfo")}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.country")}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.country}
                  onChangeText={(text) =>
                    setFormData({ ...formData, country: text })
                  }
                  placeholder={t("profile.countryPlaceholder", "البلد")}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.city")}</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.city}
                  onChangeText={(text) =>
                    setFormData({ ...formData, city: text })
                  }
                  placeholder={t("profile.cityPlaceholder", "المدينة")}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.address")}</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                  placeholder={t("profile.addressPlaceholder", "العنوان")}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Text
                style={[styles.modalSectionTitle, { color: colors.accent }]}
              >
                <Feather name="info" size={16} color={colors.accent} />{" "}
                {t("profile.aboutYou")}
              </Text>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.gender")}</Text>
                <View style={styles.genderOptions}>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === "male" && styles.genderOptionSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, gender: "male" })}
                  >
                    <Feather
                      name="user"
                      size={16}
                      color={
                        formData.gender === "male"
                          ? colors.textInverse
                          : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.genderText,
                        formData.gender === "male" && styles.genderTextSelected,
                      ]}
                    >
                      {t("profile.genderMale", "ذكر")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderOption,
                      formData.gender === "female" &&
                        styles.genderOptionSelected,
                    ]}
                    onPress={() =>
                      setFormData({ ...formData, gender: "female" })
                    }
                  >
                    <Feather
                      name="user"
                      size={16}
                      color={
                        formData.gender === "female"
                          ? colors.textInverse
                          : colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.genderText,
                        formData.gender === "female" &&
                          styles.genderTextSelected,
                      ]}
                    >
                      {t("profile.genderFemale", "أنثى")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>{t("profile.bio")}</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  value={formData.bio}
                  onChangeText={(text) =>
                    setFormData({ ...formData, bio: text })
                  }
                  placeholder={t("profile.bioPlaceholder", "نبذة عنك")}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={4}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>
                  {t("common.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  loading && styles.saveButtonDisabled,
                ]}
                onPress={handleEditProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.textInverse} />
                ) : (
                  <>
                    <Feather name="save" size={16} color={colors.textInverse} />
                    <Text style={styles.saveButtonText}>
                      {t("common.save")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
