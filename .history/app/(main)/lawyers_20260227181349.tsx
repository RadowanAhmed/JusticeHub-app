import { useTheme } from "@/contexts/ThemeContext"; // Add this import
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type LawyerStatus = "available" | "busy" | "offline";
type Specialization =
  | "civil"
  | "criminal"
  | "family"
  | "commercial"
  | "labor"
  | "real-estate";

interface Lawyer {
  id: string;
  name: string;
  specialization: Specialization;
  rating: number;
  reviews: number;
  experience: number;
  status: LawyerStatus;
  fee: number;
  description: string;
  verified: boolean;
  responseTime?: string;
  languages?: string[];
}

const specializations = [
  { id: "all", label: "الكل", icon: "apps" },
  { id: "civil", label: "مدني", icon: "balance-scale" },
  { id: "criminal", label: "جنائي", icon: "gavel" },
  { id: "family", label: "أحوال شخصية", icon: "family-restroom" },
  { id: "commercial", label: "تجاري", icon: "store" },
  { id: "labor", label: "عمل", icon: "briefcase" },
];

const consultationTypes = [
  { id: "video", label: "فيديو", icon: "videocam" },
  { id: "chat", label: "محادثة", icon: "chatbubble" },
];

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "د. أحمد محمد",
    specialization: "civil",
    rating: 4.9,
    reviews: 245,
    experience: 18,
    status: "available",
    fee: 450,
    description: "محامي متخصص في القضايا المدنية والعقود",
    verified: true,
    responseTime: "ساعة واحدة",
    languages: ["العربية", "الإنجليزية"],
  },
  {
    id: "2",
    name: "أ. سارة أحمد",
    specialization: "family",
    rating: 4.8,
    reviews: 189,
    experience: 15,
    status: "available",
    fee: 500,
    description: "محامية متخصصة في قضايا الأحوال الشخصية",
    verified: true,
    responseTime: "ساعتين",
    languages: ["العربية"],
  },
  {
    id: "3",
    name: "د. خالد عبدالله",
    specialization: "criminal",
    rating: 4.7,
    reviews: 312,
    experience: 22,
    status: "busy",
    fee: 600,
    description: "محامي جنائي معتمد مع خبرة طويلة",
    verified: true,
  },
  {
    id: "4",
    name: "أ. محمد العتيبي",
    specialization: "commercial",
    rating: 4.6,
    reviews: 167,
    experience: 12,
    status: "available",
    fee: 400,
    description: "محامي تجاري متخصص في عقود الشركات",
    verified: true,
    responseTime: "ساعة واحدة",
    languages: ["العربية", "الإنجليزية"],
  },
  {
    id: "5",
    name: "د. نورة السعيد",
    specialization: "labor",
    rating: 4.5,
    reviews: 134,
    experience: 10,
    status: "available",
    fee: 350,
    description: "محامية متخصصة في قانون العمل",
    verified: true,
    responseTime: "ساعتين",
  },
  {
    id: "6",
    name: "أ. فهد الرشيد",
    specialization: "real-estate",
    rating: 4.4,
    reviews: 98,
    experience: 8,
    status: "offline",
    fee: 300,
    description: "محامي عقارات متخصص",
    verified: false,
  },
];

export default function LawyersScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme(); // Add this line

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = () => {
    setLoading(true);
    setTimeout(() => {
      setLawyers(mockLawyers);
      setLoading(false);
    }, 500);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    if (selectedSpec !== "all" && lawyer.specialization !== selectedSpec)
      return false;
    if (
      searchQuery &&
      !lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleBookConsultation = (lawyer: Lawyer, type: string) => {
    router.push({
      pathname: "/(main)/appointments/new",
      params: {
        lawyerId: lawyer.id,
        lawyerName: lawyer.name,
        consultationType: type,
      },
    });
  };

  const handleViewProfile = (lawyer: Lawyer) => {
    router.push({
      pathname: "/(main)/lawyers/[id]",
      params: { id: lawyer.id },
    });
  };

  const getStatusConfig = (status: LawyerStatus) => {
    switch (status) {
      case "available":
        return { label: "متاح", color: colors.success };
      case "busy":
        return { label: "مشغول", color: colors.warning };
      case "offline":
        return { label: "غير متصل", color: colors.textSecondary };
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={12}
            color={colors.warning}
          />
        ))}
      </View>
    );
  };

  const renderLawyerCard = ({ item }: { item: Lawyer }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.lawyerCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
        onPress={() => handleViewProfile(item)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.lawyerInfo}>
            <View
              style={[
                styles.avatarContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.textInverse }]}>
                {item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
              {item.verified && (
                <View
                  style={[
                    styles.verifiedBadge,
                    {
                      backgroundColor: colors.success,
                      borderColor: colors.card,
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={10}
                    color={colors.textInverse}
                  />
                </View>
              )}
            </View>
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConfig.color + "20" },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: statusConfig.color },
                    ]}
                  />
                  <Text
                    style={[styles.statusText, { color: statusConfig.color }]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </View>
              <Text
                style={[styles.specialization, { color: colors.textSecondary }]}
              >
                {
                  specializations.find((s) => s.id === item.specialization)
                    ?.label
                }
              </Text>
              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
                <Text
                  style={[styles.ratingText, { color: colors.textPrimary }]}
                >
                  {item.rating}
                </Text>
                <Text
                  style={[styles.reviewsText, { color: colors.textSecondary }]}
                >
                  {" "}
                  ({item.reviews})
                </Text>
                <Text
                  style={[
                    styles.experienceText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {" "}
                  • {item.experience} سنة
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.feeContainer}>
            <Text style={[styles.fee, { color: colors.primary }]}>
              {item.fee}
            </Text>
            <Text style={[styles.feeLabel, { color: colors.textSecondary }]}>
              ريال
            </Text>
          </View>
        </View>

        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {item.responseTime && (
          <View style={styles.responseTime}>
            <Ionicons
              name="time-outline"
              size={12}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.responseTimeText, { color: colors.textSecondary }]}
            >
              الرد خلال {item.responseTime}
            </Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={[
              styles.chatButton,
              {
                backgroundColor: colors.elevated,
                borderColor: colors.border,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              router.push(`/(main)/chat/${item.id}`);
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.chatButtonText, { color: colors.primary }]}>
              محادثة
            </Text>
          </TouchableOpacity>

          <View style={styles.consultButtons}>
            {consultationTypes.map((type, index) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.consultButton,
                  {
                    backgroundColor:
                      index === 0
                        ? colors.primary + "20"
                        : colors.success + "20",
                  },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  handleBookConsultation(item, type.id);
                }}
              >
                <Ionicons
                  name={type.icon as any}
                  size={12}
                  color={index === 0 ? colors.primary : colors.success}
                />
                <Text
                  style={[
                    styles.consultText,
                    {
                      color: index === 0 ? colors.primary : colors.success,
                    },
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      marginTop: 12,
      color: colors.textSecondary,
      fontSize: 14,
    },
    header: {
      backgroundColor: colors.card,
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    filterButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: colors.elevated,
      justifyContent: "center",
      alignItems: "center",
    },
    searchContainer: {
      marginBottom: 4,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.elevated,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
      textAlign: "right",
      padding: 0,
    },
    specsContainer: {
      backgroundColor: colors.card,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    specsContent: {
      paddingHorizontal: 16,
      gap: 12,
    },
    specButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.elevated,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      gap: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    specButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    specLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "500",
    },
    specLabelActive: {
      color: colors.textInverse,
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    lawyerCard: {
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    lawyerInfo: {
      flexDirection: "row",
      flex: 1,
      gap: 12,
    },
    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    avatarText: {
      fontSize: 16,
      fontWeight: "bold",
    },
    verifiedBadge: {
      position: "absolute",
      bottom: -2,
      right: -2,
      width: 16,
      height: 16,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
    },
    info: {
      flex: 1,
    },
    nameRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 4,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 11,
      fontWeight: "500",
    },
    specialization: {
      fontSize: 14,
      marginBottom: 6,
    },
    ratingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    stars: {
      flexDirection: "row",
      gap: 1,
    },
    ratingText: {
      fontSize: 13,
      fontWeight: "600",
      marginLeft: 4,
    },
    reviewsText: {
      fontSize: 12,
    },
    experienceText: {
      fontSize: 12,
      marginLeft: 4,
    },
    feeContainer: {
      alignItems: "flex-end",
    },
    fee: {
      fontSize: 18,
      fontWeight: "bold",
    },
    feeLabel: {
      fontSize: 12,
    },
    description: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    responseTime: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 12,
    },
    responseTimeText: {
      fontSize: 13,
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    chatButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      gap: 6,
      borderWidth: 1,
    },
    chatButtonText: {
      fontSize: 14,
      fontWeight: "500",
    },
    consultButtons: {
      flexDirection: "row",
      gap: 8,
    },
    consultButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
      gap: 4,
    },
    consultText: {
      fontSize: 12,
      fontWeight: "500",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.textPrimary,
      marginTop: 16,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
    },
    clearButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    clearButtonText: {
      color: colors.textInverse,
      fontSize: 16,
      fontWeight: "600",
    },
    footer: {
      marginTop: 8,
    },
    aiCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    aiContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    aiText: {
      flex: 1,
      marginHorizontal: 12,
    },
    aiTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 2,
    },
    aiDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.card}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>المحامون</Text>
            <Text style={styles.subtitle}>
              {filteredLawyers.length} محامي متاح
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={18}
              color={colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن محامي..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Specializations */}
      <View style={styles.specsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.specsContent}
        >
          {specializations.map((spec) => (
            <TouchableOpacity
              key={spec.id}
              style={[
                styles.specButton,
                selectedSpec === spec.id && styles.specButtonActive,
              ]}
              onPress={() => setSelectedSpec(spec.id)}
            >
              <MaterialIcons
                name={spec.icon as any}
                size={20}
                color={
                  selectedSpec === spec.id
                    ? colors.textInverse
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.specLabel,
                  selectedSpec === spec.id && styles.specLabelActive,
                ]}
              >
                {spec.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lawyers List */}
      <FlatList
        data={filteredLawyers}
        renderItem={renderLawyerCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons
              name="account-circle"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>لا توجد نتائج</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "لم نعثر على محامين يطابقون بحثك"
                : "لا يوجد محامون متاحون حالياً"}
            </Text>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => setSearchQuery("")}
              >
                <Text style={styles.clearButtonText}>مسح البحث</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.aiCard}
              onPress={() => router.push("/(main)/chat")}
            >
              <View style={styles.aiContent}>
                <MaterialIcons
                  name="psychology"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.aiText}>
                  <Text style={styles.aiTitle}>استشارة مع المساعد الذكي</Text>
                  <Text style={styles.aiDescription}>
                    اسأل عن أي استفسار قانوني مجاناً
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
