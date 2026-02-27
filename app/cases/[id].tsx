import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

const colors = {
  primary: '#4F46E5',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textLight: '#CBD5E1',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#334155',
  white: '#FFFFFF',
};

interface CaseDetail {
  id: string;
  case_number: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  court_type?: string;
  estimated_duration?: string;
  budget?: number;
  documents: string[];
  created_at: string;
  updated_at: string;
  assigned_to?: string;
}

export default function CaseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchCaseDetail();
  }, [id]);

  const fetchCaseDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCaseDetail(data);
    } catch (error) {
      console.error('Error fetching case:', error);
      Alert.alert('خطأ', 'فشل في تحميل تفاصيل القضية');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return colors.success;
      case 'pending': return colors.warning;
      case 'completed': return colors.primary;
      case 'review': return colors.info;
      default: return colors.textMuted;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return colors.danger;
      case 'high': return colors.warning;
      case 'medium': return colors.success;
      case 'low': return colors.textMuted;
      default: return colors.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشطة';
      case 'pending': return 'قيد الانتظار';
      case 'completed': return 'مكتملة';
      case 'review': return 'قيد المراجعة';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'مرتفع';
      case 'medium': return 'متوسط';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadDocument = async (documentPath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('case-documents')
        .createSignedUrl(documentPath, 60); // 60 seconds expiration

      if (error) throw error;
      
      await Linking.openURL(data.signedUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('خطأ', 'فشل في فتح المستند');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل تفاصيل القضية...</Text>
      </View>
    );
  }

  if (!caseDetail) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={64} color={colors.danger} />
        <Text style={styles.errorText}>القضية غير موجودة</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>رجوع</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>تفاصيل القضية</Text>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => router.push(`/(main)/chat?case=${id}`)}
            >
              <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.caseHeader}>
            <View>
              <Text style={styles.caseNumber}>#{caseDetail.case_number}</Text>
              <Text style={styles.caseTitle}>{caseDetail.title}</Text>
              <View style={styles.caseMeta}>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(caseDetail.status)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(caseDetail.status) }]}>
                    {getStatusText(caseDetail.status)}
                  </Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(caseDetail.priority)}20` }]}>
                  <Text style={[styles.priorityText, { color: getPriorityColor(caseDetail.priority) }]}>
                    {getPriorityText(caseDetail.priority)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Case Details */}
        <View style={styles.detailsContainer}>
          {/* Description */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>وصف القضية</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{caseDetail.description}</Text>
            </View>
          </View>

          {/* Case Info */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>معلومات القضية</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="pricetag-outline" size={20} color={colors.textMuted} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>التصنيف</Text>
                  <Text style={styles.infoValue}>{caseDetail.category}</Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <MaterialCommunityIcons name="gavel" size={20} color={colors.textMuted} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>نوع المحكمة</Text>
                  <Text style={styles.infoValue}>
                    {caseDetail.court_type || 'غير محدد'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>المدة المتوقعة</Text>
                  <Text style={styles.infoValue}>
                    {caseDetail.estimated_duration || 'غير محددة'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={20} color={colors.textMuted} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>الميزانية</Text>
                  <Text style={styles.infoValue}>
                    {caseDetail.budget ? `${caseDetail.budget} ريال` : 'غير محددة'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Dates */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>التواريخ</Text>
            <View style={styles.datesGrid}>
              <View style={styles.dateItem}>
                <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>تاريخ الإنشاء</Text>
                  <Text style={styles.dateValue}>{formatDate(caseDetail.created_at)}</Text>
                </View>
              </View>
              
              <View style={styles.dateItem}>
                <Ionicons name="refresh-circle-outline" size={20} color={colors.warning} />
                <View style={styles.dateContent}>
                  <Text style={styles.dateLabel}>آخر تحديث</Text>
                  <Text style={styles.dateValue}>{formatDate(caseDetail.updated_at)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Documents */}
          {caseDetail.documents && caseDetail.documents.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>المستندات ({caseDetail.documents.length})</Text>
              <View style={styles.documentsList}>
                {caseDetail.documents.map((doc, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.documentItem}
                    onPress={() => downloadDocument(doc)}
                  >
                    <MaterialIcons name="description" size={24} color={colors.primary} />
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>
                        مستند {index + 1}
                      </Text>
                      <Text style={styles.documentAction}>اضغط للتحميل</Text>
                    </View>
                    <Ionicons name="download-outline" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push(`/(main)/chat?case=${id}`)}
            >
              <Ionicons name="chatbubble-ellipses" size={20} color={colors.white} />
              <Text style={styles.actionButtonText}>محادثة القضية</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryAction]}
              onPress={() => router.push(`/(main)/cases/new`)}
            >
              <Ionicons name="add-circle" size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, styles.secondaryActionText]}>
                قضية جديدة
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    color: colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  caseHeader: {
    marginTop: 8,
  },
  caseNumber: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  caseMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsContainer: {
    padding: 16,
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 24,
    textAlign: 'right',
  },
  infoGrid: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  datesGrid: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateContent: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: colors.text,
  },
  documentsList: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  documentAction: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  secondaryAction: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryActionText: {
    color: colors.text,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 16,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 16,
  },
});
