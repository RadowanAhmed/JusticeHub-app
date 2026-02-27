// apps/mobile/app/(main)/cases.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import { supabase } from "@/lib/supabase";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type CaseStatus = "active" | "pending" | "completed" | "review";

interface Case {
  id: string;
  case_number: string;
  title: string;
  status: CaseStatus;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  description: string;
  created_at: string;
  updated_at: string;
  court_type?: string;
  estimated_duration?: string;
  budget?: number;
  documents?: string[];
  assigned_to?: string;
}

export default function CasesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colors, isDarkMode } = useTheme(); // Add this line

  const [filter, setFilter] = useState<"all" | CaseStatus>("all");
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExpoGo, setIsExpoGo] = useState(false);

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
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    header: {
      backgroundColor: colors.card,
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 16,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerContent: {
      flex: 1,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    newCaseButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 32,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginTop: 16,
    },
    statCard: {
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 12,
      flex: 1,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    filtersContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      marginTop: 20,
      gap: 8,
    },
    filterButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    filterTextActive: {
      color: colors.textInverse,
    },
    casesSection: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
    },
    caseCount: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 32,
      backgroundColor: colors.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: "dashed",
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
      textAlign: "center",
      paddingHorizontal: 20,
    },
    startCaseButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      gap: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    startCaseButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
    casesList: {
      gap: 12,
    },
    caseCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    caseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    caseInfo: {
      flex: 1,
      marginRight: 12,
    },
    caseNumberRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    caseNumber: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
    },
    priorityBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    priorityText: {
      fontSize: 10,
      fontWeight: "500",
    },
    caseTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 8,
    },
    caseMeta: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
    },
    categoryBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.elevated,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    caseCategory: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    courtBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.elevated,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      gap: 4,
    },
    courtText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "500",
    },
    caseFooter: {
      marginTop: 12,
    },
    caseDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 20,
      textAlign: "right",
      marginBottom: 12,
    },
    caseActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    lastUpdateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    lastUpdate: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    chatButton: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.elevated,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionsSection: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    quickActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    quickAction: {
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 12,
      flex: 1,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    quickActionText: {
      fontSize: 14,
      color: colors.textPrimary,
      fontWeight: "500",
    },
    helpSection: {
      paddingHorizontal: 16,
      marginTop: 24,
    },
    helpCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    helpIcon: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
    },
    helpContent: {
      flex: 1,
    },
    helpTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    helpText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
      textAlign: "right",
    },
    helpButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      gap: 8,
      alignSelf: "flex-start",
    },
    helpButtonText: {
      color: colors.textInverse,
      fontSize: 14,
      fontWeight: "600",
    },
    environmentNotice: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      backgroundColor: colors.warning + "10",
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.warning + "20",
      gap: 8,
    },
    environmentText: {
      fontSize: 12,
      color: colors.warning,
      fontWeight: "500",
    },
  });

  useEffect(() => {
    checkEnvironment();
    if (user) {
      fetchCases();
    }
  }, [user]);

  const checkEnvironment = () => {
    // Check if we're in Expo Go (no real database access)
    const isExpo =
      window.location?.href?.includes("exp.host") ||
      window.location?.href?.includes("expo.dev");
    setIsExpoGo(isExpo);
  };

  const fetchCases = async () => {
    try {
      setLoading(true);

      if (!user) {
        Alert.alert("خطأ", "يرجى تسجيل الدخول أولاً");
        router.push("/(auth)/login");
        return;
      }

      console.log("Fetching cases for user:", user.id);

      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);

        // If RLS permission error, show sample data
        if (error.code === "42501") {
          Alert.alert("ملاحظة", "جارٍ تهيئة النظام. يتم عرض بيانات تجريبية.", [
            { text: "حسناً" },
          ]);
          setCases(getSampleCases());
          return;
        }

        throw error;
      }

      console.log("Fetched cases:", data?.length || 0);
      setCases(data || []);
    } catch (error: any) {
      console.error("Error fetching cases:", error);

      // Fallback to sample data
      setCases(getSampleCases());

      Alert.alert("ملاحظة", "جارٍ تحميل النظام. يتم عرض بيانات تجريبية.", [
        { text: "حسناً" },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getSampleCases = (): Case[] => {
    return [
      {
        id: "sample-1",
        case_number: "2024-001",
        title: "قضية تعويض عقاري",
        status: "active",
        category: "عقارات",
        priority: "high",
        description: "قضية تعويض عن عقد عقاري",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "sample-2",
        case_number: "2024-002",
        title: "قضية عمل - فصل تعسفي",
        status: "pending",
        category: "عمل",
        priority: "medium",
        description: "قضية فصل تعسفي من العمل",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "sample-3",
        case_number: "2024-003",
        title: "قضية تجارية",
        status: "active",
        category: "تجاري",
        priority: "high",
        description: "نزاع تجاري مع شريك",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: "sample-4",
        case_number: "2024-004",
        title: "قضية نفقة",
        status: "completed",
        category: "أحوال شخصية",
        priority: "medium",
        description: "قضية نفقة للأبناء",
        created_at: new Date(Date.now() - 604800000).toISOString(),
        updated_at: new Date(Date.now() - 604800000).toISOString(),
      },
    ];
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCases();
  };

  const handleFilterChange = (newFilter: "all" | CaseStatus) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilter(newFilter);
  };

  const handleCasePress = (caseItem: Case) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/cases/${caseItem.id}`);
  };

  const handleNewCasePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/cases/new");
  };

  const handleChatPress = (caseId: string, e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/(main)/chat?case=${caseId}`);
  };

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case "active":
        return colors.success;
      case "pending":
        return colors.warning;
      case "completed":
        return colors.primary;
      case "review":
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const getFilteredCases = () => {
    if (filter === "all") return cases;
    return cases.filter((c) => c.status === filter);
  };

  const getStatusIcon = (status: CaseStatus) => {
    switch (status) {
      case "active":
        return "play-circle";
      case "pending":
        return "time";
      case "completed":
        return "checkmark-circle";
      case "review":
        return "refresh-circle";
      default:
        return "help-circle";
    }
  };

  const getStatusText = (status: CaseStatus) => {
    switch (status) {
      case "active":
        return "نشطة";
      case "pending":
        return "قيد الانتظار";
      case "completed":
        return "مكتملة";
      case "review":
        return "قيد المراجعة";
      default:
        return "غير معروفة";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return colors.danger;
      case "high":
        return colors.warning;
      case "medium":
        return colors.success;
      case "low":
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "عاجل";
      case "high":
        return "مرتفع";
      case "medium":
        return "متوسط";
      case "low":
        return "منخفض";
      default:
        return priority;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "اليوم";
      if (diffDays === 1) return "أمس";
      if (diffDays === 2) return "قبل يومين";
      if (diffDays < 7) return `قبل ${diffDays} أيام`;
      if (diffDays < 30) return `قبل ${Math.floor(diffDays / 7)} أسابيع`;
      return `قبل ${Math.floor(diffDays / 30)} أشهر`;
    } catch (error) {
      return "تاريخ غير معروف";
    }
  };

  const casesCount = cases.length;
  const activeCount = cases.filter((c) => c.status === "active").length;
  const pendingCount = cases.filter((c) => c.status === "pending").length;
  const completedCount = cases.filter((c) => c.status === "completed").length;

  const filteredCases = getFilteredCases();

  if (loading && cases.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل القضايا...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>قضاياي</Text>
              <Text style={styles.headerSubtitle}>لديك {casesCount} قضية</Text>
            </View>

            <TouchableOpacity
              style={styles.newCaseButton}
              onPress={handleNewCasePress}
            >
              <Ionicons name="add" size={24} color={colors.textInverse} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleFilterChange("all")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <MaterialIcons
                name="briefcase"
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.statNumber}>{casesCount}</Text>
            <Text style={styles.statLabel}>إجمالي</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleFilterChange("active")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.success + "20" },
              ]}
            >
              <Ionicons name="play-circle" size={20} color={colors.success} />
            </View>
            <Text style={styles.statNumber}>{activeCount}</Text>
            <Text style={styles.statLabel}>نشطة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => handleFilterChange("pending")}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: colors.warning + "20" },
              ]}
            >
              <Ionicons name="time" size={20} color={colors.warning} />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>قيد الانتظار</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("all")}
          >
            <Text
              style={[
                styles.filterText,
                filter === "all" && styles.filterTextActive,
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "active" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("active")}
          >
            <Ionicons
              name="play-circle"
              size={16}
              color={filter === "active" ? colors.textInverse : colors.success}
            />
            <Text
              style={[
                styles.filterText,
                filter === "active" && styles.filterTextActive,
              ]}
            >
              نشطة
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "pending" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("pending")}
          >
            <Ionicons
              name="time"
              size={16}
              color={filter === "pending" ? colors.textInverse : colors.warning}
            />
            <Text
              style={[
                styles.filterText,
                filter === "pending" && styles.filterTextActive,
              ]}
            >
              قيد الانتظار
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === "completed" && styles.filterButtonActive,
            ]}
            onPress={() => handleFilterChange("completed")}
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={
                filter === "completed" ? colors.textInverse : colors.primary
              }
            />
            <Text
              style={[
                styles.filterText,
                filter === "completed" && styles.filterTextActive,
              ]}
            >
              مكتملة
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cases List */}
        <View style={styles.casesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>قائمة القضايا</Text>
            <Text style={styles.caseCount}>{filteredCases.length} قضية</Text>
          </View>

          {filteredCases.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="briefcase-off"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyTitle}>
                {filter === "all"
                  ? "لا توجد قضايا"
                  : `لا توجد قضايا بحالة "${getStatusText(filter)}"`}
              </Text>
              <Text style={styles.emptyText}>
                {filter === "all"
                  ? "ابدأ قضيتك الأولى مع Orient Team"
                  : "جرب تصفية أخرى أو أنشئ قضية جديدة"}
              </Text>
              <TouchableOpacity
                style={styles.startCaseButton}
                onPress={handleNewCasePress}
              >
                <Ionicons name="add" size={20} color={colors.textInverse} />
                <Text style={styles.startCaseButtonText}>بدء قضية جديدة</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.casesList}>
              {filteredCases.map((caseItem) => (
                <TouchableOpacity
                  key={caseItem.id}
                  style={styles.caseCard}
                  onPress={() => handleCasePress(caseItem)}
                  activeOpacity={0.8}
                >
                  <View style={styles.caseHeader}>
                    <View style={styles.caseInfo}>
                      <View style={styles.caseNumberRow}>
                        <Text style={styles.caseNumber}>
                          #{caseItem.case_number}
                        </Text>
                        <View
                          style={[
                            styles.priorityBadge,
                            {
                              backgroundColor:
                                getPriorityColor(caseItem.priority) + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.priorityText,
                              { color: getPriorityColor(caseItem.priority) },
                            ]}
                          >
                            {getPriorityText(caseItem.priority)}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.caseTitle}>{caseItem.title}</Text>
                      <View style={styles.caseMeta}>
                        <View style={styles.categoryBadge}>
                          <MaterialIcons
                            name="category"
                            size={12}
                            color={colors.textSecondary}
                          />
                          <Text style={styles.caseCategory}>
                            {caseItem.category}
                          </Text>
                        </View>
                        {caseItem.court_type && (
                          <View style={styles.courtBadge}>
                            <MaterialCommunityIcons
                              name="gavel"
                              size={12}
                              color={colors.textSecondary}
                            />
                            <Text style={styles.courtText}>
                              {caseItem.court_type}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            getStatusColor(caseItem.status) + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(caseItem.status)}
                        size={16}
                        color={getStatusColor(caseItem.status)}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(caseItem.status) },
                        ]}
                      >
                        {getStatusText(caseItem.status)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.caseFooter}>
                    <Text style={styles.caseDescription} numberOfLines={2}>
                      {caseItem.description}
                    </Text>

                    <View style={styles.caseActions}>
                      <View style={styles.lastUpdateContainer}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.lastUpdate}>
                          آخر تحديث: {formatDate(caseItem.updated_at)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.chatButton}
                        onPress={(e) => handleChatPress(caseItem.id, e)}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={18}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/cases/new");
              }}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons name="add-circle" size={24} color={colors.primary} />
              </View>
              <Text style={styles.quickActionText}>قضية جديدة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(main)/chat");
              }}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.success + "20" },
                ]}
              >
                <Ionicons name="chatbubble" size={24} color={colors.success} />
              </View>
              <Text style={styles.quickActionText}>استشارة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/documents/analyze");
              }}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colors.warning + "20" },
                ]}
              >
                <Ionicons name="folder" size={24} color={colors.warning} />
              </View>
              <Text style={styles.quickActionText}>مستندات</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <View
              style={[
                styles.helpIcon,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="help-circle" size={32} color={colors.primary} />
            </View>
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>هل تحتاج مساعدة؟</Text>
              <Text style={styles.helpText}>
                فريق Orient Team متاح دائماً للإجابة على استفساراتك وتقديم الدعم
                القانوني
              </Text>
              <TouchableOpacity
                style={styles.helpButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/(main)/chat");
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={18}
                  color={colors.textInverse}
                />
                <Text style={styles.helpButtonText}>تواصل مع الدعم</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Environment Notice */}
        {isExpoGo && (
          <View style={styles.environmentNotice}>
            <Ionicons name="phone-portrait" size={20} color={colors.warning} />
            <Text style={styles.environmentText}>
              وضع التجربة - بيانات تجريبية
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
