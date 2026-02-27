// apps/mobile/app/(main)/index.tsx
import { useNotification } from "@/backend/notifications/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import { supabase } from "@/lib/supabase";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414;

// Animation Constants
const HEADER_MAX_HEIGHT = isSmallScreen ? 100 : isMediumScreen ? 110 : 120;
const HEADER_MIN_HEIGHT = 45;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

// Responsive sizing
const responsiveScale = {
  xs: isSmallScreen ? 2 : isMediumScreen ? 3 : 4,
  sm: isSmallScreen ? 4 : isMediumScreen ? 6 : 8,
  md: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
  lg: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
  xl: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
  xxl: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
  xxxl: isSmallScreen ? 28 : isMediumScreen ? 30 : 32,
};

const SPACING = {
  xs: responsiveScale.xs,
  sm: responsiveScale.sm,
  md: responsiveScale.md,
  lg: responsiveScale.lg,
  xl: responsiveScale.xl,
  xxl: responsiveScale.xxl,
  xxxl: responsiveScale.xxxl,
};

const HomeScreen = () => {
  const { t } = useTranslation();
  const { profile, user, refreshProfile } = useAuth();
  const { colors, isDarkMode } = useTheme(); // Add this line

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    cases: 0,
    activeCases: 0,
    consultations: 0,
    documents: 0,
    appointments: 0,
  });

  const { unreadCount } = useNotification();
  const router = useRouter();

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const avatarScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.7],
    extrapolate: "clamp",
  });

  const avatarTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const greetingOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const greetingTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  const userNameFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [isSmallScreen ? 16 : 18, isSmallScreen ? 14 : 16],
    extrapolate: "clamp",
  });

  const userNameOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  // Only 3 Quick Actions
  const QUICK_ACTIONS = [
    {
      id: "ai-chat",
      title: t("home.actions.aiChat"),
      description: t("home.actions.aiChatDesc"),
      icon: "robot",
      color: colors.primary,
      iconType: "material",
      route: "/(main)/chat",
    },
    {
      id: "new-case",
      title: t("home.actions.newCase"),
      description: t("home.actions.newCaseDesc"),
      icon: "add-circle",
      color: colors.success,
      iconType: "ionicons",
      route: "/(main)/cases/new",
    },
    {
      id: "documents",
      title: t("home.actions.documents"),
      description: t("home.actions.documentsDesc"),
      icon: "file-text",
      color: colors.warning,
      iconType: "feather",
      route: "/(main)/documents",
    },
  ];

  // Features - reduced to 3
  const FEATURES = [
    {
      id: "document-analysis",
      title: t("home.features.documentAnalysis"),
      icon: "analytics",
      color: colors.secondary,
      route: "/(main)/analysis",
    },
    {
      id: "knowledge-base",
      title: t("home.features.knowledgeBase"),
      icon: "book",
      color: colors.success,
      route: "/(main)/knowledge",
    },
    {
      id: "legal-calculators",
      title: t("home.features.legalCalculators"),
      icon: "calculator",
      color: colors.warning,
      route: "/(main)/calculators",
    },
  ];

  // Recent Activity
  const ACTIVITY_ITEMS = [
    {
      id: 1,
      type: "case",
      title: "تم تحديث حالة القضية",
      time: "قبل 2 ساعة",
      icon: "briefcase-outline",
      color: colors.primary,
    },
    {
      id: 2,
      type: "message",
      title: "رد جديد من المحامي",
      time: "قبل 4 ساعات",
      icon: "chatbubble-outline",
      color: colors.success,
    },
    {
      id: 3,
      type: "document",
      title: "تم تحميل المستندات",
      time: "أمس",
      icon: "document-text-outline",
      color: colors.warning,
    },
  ];

  // Stats Config
  const STATS_CONFIG = [
    {
      key: "cases",
      label: t("home.stats.totalCases"),
      icon: "briefcase-outline",
      color: colors.primary,
    },
    {
      key: "activeCases",
      label: t("home.stats.activeCases"),
      icon: "trending-up-outline",
      color: colors.success,
    },
    {
      key: "consultations",
      label: t("home.stats.consultations"),
      icon: "chatbubble-ellipses-outline",
      color: colors.secondary,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [casesResult, conversationsResult] = await Promise.all([
        supabase
          .from("cases")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("conversations")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
      ]);

      const { data: activeCases } = await supabase
        .from("cases")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "active");

      setStats({
        cases: casesResult.count || 0,
        activeCases: activeCases?.count || 0,
        consultations: conversationsResult.count || 0,
        documents: 0,
        appointments: 0,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "☀️";
    if (hour < 18) return "🌤️";
    return "🌙";
  };

  const renderIcon = (
    icon: string,
    type: string = "ionicons",
    color: string = colors.white,
    size: number = 20,
  ) => {
    switch (type) {
      case "material":
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case "material-community":
        return (
          <MaterialCommunityIcons
            name={icon as any}
            size={size}
            color={color}
          />
        );
      case "feather":
        return <Feather name={icon as any} size={size} color={color} />;
      default:
        return <Ionicons name={icon as any} size={size} color={color} />;
    }
  };

  // Create dynamic styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: SPACING.md,
      color: colors.textSecondary,
      fontSize: 16,
      fontFamily: "System",
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      paddingBottom: SPACING.xxxl,
    },
    contentSpacer: {
      height: HEADER_MAX_HEIGHT,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.card,
      zIndex: 1000,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      overflow: "hidden",
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: isSmallScreen ? 36 : 40,
      paddingBottom: SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      marginRight: SPACING.lg,
    },
    avatarContainer: {
      width: isSmallScreen ? 42 : 48,
      height: isSmallScreen ? 42 : 48,
      borderRadius: isSmallScreen ? 21 : 24,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.md,
    },
    avatarText: {
      fontSize: isSmallScreen ? 16 : 18,
      fontWeight: "bold",
      color: colors.textInverse,
      fontFamily: "System",
    },
    greetingContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: isSmallScreen ? 12 : 14,
      color: colors.textSecondary,
      marginBottom: SPACING.xs,
      fontFamily: "System",
      fontWeight: "500",
    },
    userName: {
      fontWeight: "bold",
      color: colors.textPrimary,
      fontFamily: "System",
    },
    notificationButton: {
      position: "relative",
      padding: SPACING.sm,
      borderRadius: 8,
      backgroundColor: colors.elevated,
    },
    notificationBadge: {
      position: "absolute",
      top: 4,
      right: 4,
      backgroundColor: colors.danger,
      borderRadius: 8,
      width: 18,
      height: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.card,
    },
    notificationBadgeText: {
      color: colors.textInverse,
      fontSize: 9,
      fontWeight: "bold",
      fontFamily: "System",
    },
    statsSection: {
      paddingHorizontal: SPACING.lg,
      marginTop: SPACING.lg,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: SPACING.lg,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statCard: {
      flex: 1,
      alignItems: "center",
    },
    statIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.sm,
    },
    statValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      fontFamily: "System",
      marginBottom: SPACING.xs,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontFamily: "System",
    },
    aiBanner: {
      marginHorizontal: SPACING.lg,
      marginTop: SPACING.lg,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 6,
    },
    aiGradient: {
      padding: 16,
      borderRadius: 16,
    },
    aiBannerContent: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    aiIconContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      padding: SPACING.md,
      borderRadius: 12,
      marginRight: SPACING.lg,
    },
    aiTextContainer: {
      flex: 1,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textInverse,
      fontFamily: "System",
      marginBottom: SPACING.xs,
    },
    aiDescription: {
      fontSize: 13,
      color: "rgba(255, 255, 255, 0.9)",
      fontFamily: "System",
    },
    aiArrowContainer: {
      padding: SPACING.sm,
      borderRadius: 12,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    aiActionText: {
      fontSize: 12,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      fontFamily: "System",
    },
    section: {
      paddingHorizontal: SPACING.lg,
      marginTop: SPACING.xl,
    },
    lastSection: {
      marginBottom: SPACING.xxxl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textPrimary,
      fontFamily: "System",
    },
    viewAllButton: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: 8,
      backgroundColor: colors.elevated,
    },
    viewAll: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
      fontFamily: "System",
    },
    actionsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    actionCard: {
      width: "31%",
      alignItems: "center",
    },
    actionIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    actionTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      fontFamily: "System",
      marginBottom: SPACING.xs,
      textAlign: "center",
    },
    actionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      fontFamily: "System",
      lineHeight: 16,
    },
    featuresGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    featureCard: {
      alignItems: "center",
      width: "31%",
    },
    featureIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: SPACING.md,
    },
    featureTitle: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.textPrimary,
      fontFamily: "System",
      textAlign: "center",
    },
    activityList: {
      backgroundColor: colors.card,
      borderRadius: 16,
      overflow: "hidden",
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginRight: SPACING.md,
    },
    activityContent: {
      flex: 1,
    },
    activityTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textPrimary,
      fontFamily: "System",
      marginBottom: SPACING.xs,
    },
    activityTime: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "System",
    },
    footerSpace: {
      height: SPACING.xxxl,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t("common.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
        translucent={false}
      />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: headerOpacity,
              transform: [{ translateY: avatarTranslateY }],
            },
          ]}
        >
          <View style={styles.userInfo}>
            <Animated.View
              style={[
                styles.avatarContainer,
                {
                  transform: [{ scale: avatarScale }],
                },
              ]}
            >
              <Text style={styles.avatarText}>
                {profile?.first_name?.[0]}
                {profile?.last_name?.[0]}
              </Text>
            </Animated.View>
            <View style={styles.greetingContainer}>
              <Animated.Text
                style={[
                  styles.greeting,
                  {
                    opacity: greetingOpacity,
                    transform: [{ translateY: greetingTranslateY }],
                  },
                ]}
              >
                {getGreeting()} {getGreetingEmoji()}
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.userName,
                  {
                    fontSize: userNameFontSize,
                    opacity: userNameOpacity,
                  },
                ]}
              >
                {profile?.first_name} {profile?.last_name}
              </Animated.Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/(main)/notifications")}
            activeOpacity={0.6}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.textPrimary}
            />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={styles.contentSpacer} />

        {/* Stats Section - 3 stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsContainer}>
            {STATS_CONFIG.map((stat, index) => (
              <TouchableOpacity
                key={stat.key}
                style={styles.statCard}
                activeOpacity={0.7}
                onPress={() => {
                  if (stat.key === "cases" || stat.key === "activeCases")
                    router.push("/(main)/cases");
                  if (stat.key === "consultations") router.push("/(main)/chat");
                }}
              >
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: stat.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={stat.icon as any}
                    size={20}
                    color={stat.color}
                  />
                </View>
                <Text style={styles.statValue}>
                  {stats[stat.key as keyof typeof stats] || 0}
                </Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Assistant Banner */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => router.push("/(main)/chat")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.primaryDark || "#3730A3", colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.aiGradient}
          >
            <View style={styles.aiBannerContent}>
              <View style={styles.aiIconContainer}>
                <MaterialIcons
                  name="gavel"
                  size={28}
                  color={colors.textInverse}
                />
              </View>
              <View style={styles.aiTextContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text style={styles.aiTitle}>{t("home.support.title")}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.aiDescription}>
                    {t("home.support.subtitle")}
                  </Text>
                </View>
              </View>
              <View style={styles.aiArrowContainer}>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textInverse}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <Ionicons
                name="hand-left-outline"
                size={12}
                color={colors.textInverse}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.aiActionText}>
                {t("home.support.tapToStart")}
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Actions - 3 items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.quickActions")}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/(main)/cases")}
              activeOpacity={0.6}
            >
              <Text style={styles.viewAll}>{t("common.viewAll")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsGrid}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIconContainer,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                  {renderIcon(action.icon, action.iconType, action.color, 20)}
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription} numberOfLines={2}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section - 3 items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.features.title")}</Text>
          </View>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.featureCard}
                onPress={() => router.push(feature.route as any)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.featureIconContainer,
                    { backgroundColor: feature.color + "20" },
                  ]}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color={feature.color}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity - 3 items */}
        <View style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("home.recentActivity")}</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/(main)/notifications")}
              activeOpacity={0.6}
            >
              <Text style={styles.viewAll}>{t("common.viewAll")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {ACTIVITY_ITEMS.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityItem}
                activeOpacity={0.6}
                onPress={() => {
                  if (activity.type === "case") router.push("/(main)/cases");
                  if (activity.type === "message") router.push("/(main)/chat");
                  if (activity.type === "document")
                    router.push("/(main)/documents");
                }}
              >
                <View
                  style={[
                    styles.activityIcon,
                    { backgroundColor: activity.color + "15" },
                  ]}
                >
                  <Ionicons
                    name={activity.icon as any}
                    size={18}
                    color={activity.color}
                  />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer Space */}
        <View style={styles.footerSpace} />
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
