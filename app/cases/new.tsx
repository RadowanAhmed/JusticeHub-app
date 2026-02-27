import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from '@/backend/services/NotificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Colors from your CasesScreen
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

// Case categories
const CASE_CATEGORIES = [
  { label: 'عقارات', value: 'real-estate' },
  { label: 'عمل', value: 'labor' },
  { label: 'تجاري', value: 'commercial' },
  { label: 'أحوال شخصية', value: 'family' },
  { label: 'مدني', value: 'civil' },
  { label: 'جنائي', value: 'criminal' },
  { label: 'إداري', value: 'administrative' },
  { label: 'ضريبي', value: 'tax' },
  { label: 'ملكية فكرية', value: 'intellectual-property' },
  { label: 'تأمين', value: 'insurance' },
  { label: 'بنوك', value: 'banking' },
  { label: 'أخرى', value: 'other' },
];

// Court types
const COURT_TYPES = [
  { label: 'المحكمة العامة', value: 'general-court' },
  { label: 'المحكمة التجارية', value: 'commercial-court' },
  { label: 'محكمة العمل', value: 'labor-court' },
  { label: 'محكمة الأحوال الشخصية', value: 'family-court' },
  { label: 'محكمة التنفيذ', value: 'execution-court' },
  { label: 'ديوان المظالم', value: 'board-of-grievances' },
  { label: 'لجنة التحكيم', value: 'arbitration-committee' },
  { label: 'غير محدد', value: 'not-specified' },
];

// Priority levels
const PRIORITY_LEVELS = [
  { label: 'منخفض', value: 'low' },
  { label: 'متوسط', value: 'medium' },
  { label: 'مرتفع', value: 'high' },
  { label: 'عاجل', value: 'urgent' },
];

// Estimated duration
const ESTIMATED_DURATION = [
  { label: 'شهر واحد', value: '1-month' },
  { label: '3 أشهر', value: '3-months' },
  { label: '6 أشهر', value: '6-months' },
  { label: 'سنة', value: '1-year' },
  { label: 'أكثر من سنة', value: 'more-than-1-year' },
  { label: 'غير محدد', value: 'not-specified' },
];

interface CaseFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  court_type?: string;
  estimated_duration?: string;
  budget?: string;
  documents: any[];
}

export default function NewCaseScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    court_type: '',
    estimated_duration: '',
    budget: '',
    documents: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<any[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCourtModal, setShowCourtModal] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);

  const generateCaseNumber = () => {
    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000);
    return `CASE-${timestamp}-${randomNum}`;
  };

  const handleDocumentPick = async () => {
    try {
      setUploadingDocs(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: true,
      });

      if (!result.canceled) {
        const newDocuments = result.assets.map((doc, index) => ({
          id: `doc-${Date.now()}-${index}`,
          name: doc.name,
          size: doc.size,
          uri: doc.uri,
          type: doc.mimeType,
        }));
        
        setSelectedDocuments(prev => [...prev, ...newDocuments]);
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, ...newDocuments],
        }));
        
        Alert.alert('تم', `تمت إضافة ${newDocuments.length} مستند`);
      }
    } catch (error) {
      console.error('Error picking documents:', error);
      Alert.alert('خطأ', 'فشل في اختيار المستندات');
    } finally {
      setUploadingDocs(false);
    }
  };

  const removeDocument = (id: string) => {
    setSelectedDocuments(prev => prev.filter(doc => doc.id !== id));
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((doc: any) => doc.id !== id),
    }));
  };

  const uploadDocumentToStorage = async (document: any, caseId: string) => {
    try {
      const fileExt = document.name.split('.').pop();
      const fileName = `${caseId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const formData = new FormData();
      formData.append('file', {
        uri: document.uri,
        name: document.name,
        type: document.type,
      } as any);

      const { data, error } = await supabase.storage
        .from('case-documents')
        .upload(fileName, formData);

      if (error) throw error;
      
      return data.path;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const sendNotificationToAdmin = async (caseData: any) => {
    try {
      const ADMIN_USER_ID = '1636d781-ca01-4ba4-9251-3bd6485dae71'; // Your admin user ID
      
      // Create notification in Supabase
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: ADMIN_USER_ID,
            title: 'قضية جديدة',
            message: `تم إنشاء قضية جديدة: ${caseData.title}`,
            type: 'case',
            category: 'case-updates',
            priority: 'high',
            data: {
              case_id: caseData.id,
              case_number: caseData.case_number,
              category: caseData.category,
              created_by: user?.email,
            },
          },
        ]);

      if (error) throw error;

      // Send push notification via Firebase (you'll need to implement this)
      // await sendPushNotification(ADMIN_USER_ID, {
      //   title: 'قضية جديدة',
      //   body: `تم إنشاء قضية جديدة: ${caseData.title}`,
      //   data: { caseId: caseData.id },
      // });

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      // Don't fail the whole process if notification fails
      return false;
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان القضية');
      return;
    }
    
    if (!formData.description.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال وصف القضية');
      return;
    }
    
    if (!formData.category) {
      Alert.alert('خطأ', 'يرجى اختيار تصنيف القضية');
      return;
    }
    
    if (!formData.priority) {
      Alert.alert('خطأ', 'يرجى اختيار أولوية القضية');
      return;
    }

    try {
      setLoading(true);
    
    if (!user) {
      Alert.alert('خطأ', 'يرجى تسجيل الدخول أولاً');
      router.push('/(auth)/login');
      return;
    }

    // Generate case number
    const caseNumber = generateCaseNumber();

    // Prepare case data
    const caseData = {
      user_id: user.id,
      case_number: caseNumber,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      status: 'pending',
      priority: formData.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('Creating case:', caseData);

    // Insert case into Supabase
    const { data: newCase, error: caseError } = await supabase
      .from('cases')
      .insert([caseData])
      .select()
      .single();

    if (caseError) {
      console.error('Case creation error:', caseError);
      throw new Error('فشل في إنشاء القضية');
    }

    console.log('✅ Case created:', newCase);

    // Send notifications (this will work even if Supabase fails)
    const notificationResult = await notificationService.sendCaseNotification(newCase, user.id);
    console.log('Notification result:', notificationResult);


    if (caseError) throw caseError;

      // Upload documents if any
      let documentPaths: string[] = [];
      if (selectedDocuments.length > 0 && newCase) {
        for (const doc of selectedDocuments) {
          try {
            const path = await uploadDocumentToStorage(doc, newCase.id);
            documentPaths.push(path);
          } catch (uploadError) {
            console.error('Failed to upload document:', uploadError);
            // Continue with other documents
          }
        }
        
        // Update case with document paths
        if (documentPaths.length > 0) {
          await supabase
            .from('cases')
            .update({ documents: documentPaths })
            .eq('id', newCase.id);
        }
      }

      // Send notification to admin
      await sendNotificationToAdmin(newCase);

      // Success message with notifications sent
    
      
    // Success
    Alert.alert(
      '✅ تم بنجاح',
      'تم إنشاء القضية بنجاح وتم إرسال الإشعارات',
      [
        {
          text: 'عرض القضية',
          onPress: () => router.push(`/cases/${newCase.id}`),
        },
        {
          text: 'رجوع للقائمة',
          onPress: () => router.push('/(main)/cases'),
        },
      ]
    );
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        court_type: '',
        estimated_duration: '',
        budget: '',
        documents: [],
      });
      setSelectedDocuments([]);

    } catch (error: any) {
      console.error('Error creating case:', error);
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء إنشاء القضية');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (value: string) => {
    const category = CASE_CATEGORIES.find(c => c.value === value);
    return category?.label || 'اختر التصنيف';
  };

  const getCourtLabel = (value: string) => {
    const court = COURT_TYPES.find(c => c.value === value);
    return court?.label || 'اختر نوع المحكمة';
  };

  const getPriorityLabel = (value: string) => {
    const priority = PRIORITY_LEVELS.find(p => p.value === value);
    return priority?.label || 'اختر الأولوية';
  };

  const getDurationLabel = (value: string) => {
    const duration = ESTIMATED_DURATION.find(d => d.value === value);
    return duration?.label || 'اختر المدة المتوقعة';
  };

  const renderPickerModal = (
    visible: boolean,
    setVisible: (visible: boolean) => void,
    title: string,
    items: Array<{ label: string; value: string }>,
    selectedValue: string,
    onSelect: (value: string) => void,
    getLabel: (value: string) => string
  ) => (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.modalItem,
                  selectedValue === item.value && styles.modalItemSelected
                ]}
                onPress={() => {
                  onSelect(item.value);
                  setVisible(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
                {selectedValue === item.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
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
              <Text style={styles.headerTitle}>إنشاء قضية جديدة</Text>
              <View style={styles.headerPlaceholder} />
            </View>
            
            <Text style={styles.headerSubtitle}>
              ابدأ قضيتك القانونية مع فريق Orient Team
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Case Title */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>عنوان القضية *</Text>
              <TextInput
                style={styles.textInput}
                value={formData.title}
                onChangeText={(text) => setFormData({...formData, title: text})}
                placeholder="مثال: قضية تعويض عن فصل تعسفي"
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={200}
              />
              <Text style={styles.charCount}>
                {formData.title.length}/200
              </Text>
            </View>

            {/* Case Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>وصف القضية *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="صف تفاصيل القضية، الأطراف المعنية، الحقائق المهمة..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={6}
                maxLength={2000}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {formData.description.length}/2000
              </Text>
            </View>

            {/* Category Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>تصنيف القضية *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCategoryModal(true)}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !formData.category && styles.pickerButtonPlaceholder
                ]}>
                  {getCategoryLabel(formData.category)}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Priority Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>أولوية القضية *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPriorityModal(true)}
              >
                <View style={styles.pickerButtonContent}>
                  <View style={[
                    styles.priorityIndicator,
                    { 
                      backgroundColor: 
                        formData.priority === 'urgent' ? colors.danger :
                        formData.priority === 'high' ? colors.warning :
                        formData.priority === 'medium' ? colors.success : colors.textMuted
                    }
                  ]} />
                  <Text style={styles.pickerButtonText}>
                    {getPriorityLabel(formData.priority)}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Court Type Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>نوع المحكمة (اختياري)</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowCourtModal(true)}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !formData.court_type && styles.pickerButtonPlaceholder
                ]}>
                  {getCourtLabel(formData.court_type || '')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Estimated Duration Picker */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>المدة المتوقعة (اختياري)</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowDurationModal(true)}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !formData.estimated_duration && styles.pickerButtonPlaceholder
                ]}>
                  {getDurationLabel(formData.estimated_duration || '')}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Budget Input */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>الميزانية المتوقعة (اختياري)</Text>
              <View style={styles.budgetContainer}>
                <TextInput
                  style={[styles.textInput, styles.budgetInput]}
                  value={formData.budget}
                  onChangeText={(text) => setFormData({...formData, budget: text.replace(/[^0-9]/g, '')})}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text style={styles.currencyText}>ريال سعودي</Text>
              </View>
            </View>

            {/* Document Upload */}
            <View style={styles.formGroup}>
              <View style={styles.documentsHeader}>
                <Text style={styles.formLabel}>المستندات (اختياري)</Text>
                <Text style={styles.documentsSubLabel}>
                  يمكنك رفع العقود، الصور، المستندات الرسمية
                </Text>
              </View>
              
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleDocumentPick}
                disabled={uploadingDocs}
              >
                <View style={styles.uploadIcon}>
                  <MaterialIcons 
                    name={uploadingDocs ? "cloud-upload" : "attach-file"} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View style={styles.uploadTextContainer}>
                  <Text style={styles.uploadTitle}>
                    {uploadingDocs ? 'جاري الرفع...' : 'رفع المستندات'}
                  </Text>
                  <Text style={styles.uploadSubtitle}>
                    PDF, Word, صور (حتى 10 ملفات)
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Selected Documents List */}
              {selectedDocuments.length > 0 && (
                <View style={styles.documentsList}>
                  {selectedDocuments.map((doc) => (
                    <View key={doc.id} style={styles.documentItem}>
                      <View style={styles.documentInfo}>
                        <MaterialIcons name="description" size={20} color={colors.primary} />
                        <View style={styles.documentDetails}>
                          <Text style={styles.documentName} numberOfLines={1}>
                            {doc.name}
                          </Text>
                          <Text style={styles.documentSize}>
                            {(doc.size / 1024 / 1024).toFixed(2)} MB
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.removeDocumentButton}
                        onPress={() => removeDocument(doc.id)}
                      >
                        <Ionicons name="close-circle" size={20} color={colors.danger} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Important Notes */}
            <View style={styles.notesContainer}>
              <View style={styles.notesHeader}>
                <MaterialCommunityIcons name="information" size={20} color={colors.warning} />
                <Text style={styles.notesTitle}>ملاحظات هامة</Text>
              </View>
              <Text style={styles.notesText}>
                • سيتم مراجعة قضيتك من قبل فريقنا القانوني خلال 24 ساعة{"\n"}
                • تأكد من صحة ودقة المعلومات المقدمة{"\n"}
                • المستندات المرفوعة تساعد في تقييم قضيتك بدقة{"\n"}
                • يمكنك متابعة حالة القضية من قسم "قضاياي"
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!formData.title || !formData.description || !formData.category || !formData.priority) && 
                styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={loading || !formData.title || !formData.description || !formData.category || !formData.priority}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <>
                  <Ionicons name="document-text" size={20} color={colors.white} />
                  <Text style={styles.submitButtonText}>إنشاء القضية</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Category Modal */}
      {renderPickerModal(
        showCategoryModal,
        setShowCategoryModal,
        'اختر تصنيف القضية',
        CASE_CATEGORIES,
        formData.category,
        (value) => setFormData({...formData, category: value}),
        getCategoryLabel
      )}

      {/* Court Type Modal */}
      {renderPickerModal(
        showCourtModal,
        setShowCourtModal,
        'اختر نوع المحكمة',
        COURT_TYPES,
        formData.court_type || '',
        (value) => setFormData({...formData, court_type: value}),
        getCourtLabel
      )}

      {/* Priority Modal */}
      {renderPickerModal(
        showPriorityModal,
        setShowPriorityModal,
        'اختر أولوية القضية',
        PRIORITY_LEVELS,
        formData.priority,
        (value) => setFormData({...formData, priority: value}),
        getPriorityLabel
      )}

      {/* Duration Modal */}
      {renderPickerModal(
        showDurationModal,
        setShowDurationModal,
        'اختر المدة المتوقعة',
        ESTIMATED_DURATION,
        formData.estimated_duration || '',
        (value) => setFormData({...formData, estimated_duration: value}),
        getDurationLabel
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 40,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'left',
    marginTop: 4,
  },
  pickerButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'right',
  },
  pickerButtonPlaceholder: {
    color: colors.textMuted,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetInput: {
    flex: 1,
  },
  currencyText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  documentsHeader: {
    marginBottom: 12,
  },
  documentsSubLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  uploadButton: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    borderRadius: 16,
    padding: 20,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  documentsList: {
    marginTop: 16,
    gap: 8,
  },
  documentItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  documentDetails: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  documentSize: {
    fontSize: 12,
    color: colors.textMuted,
  },
  removeDocumentButton: {
    padding: 4,
  },
  notesContainer: {
    backgroundColor: colors.warning + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.warning + '20',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.warning,
  },
  notesText: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 22,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: colors.border,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  modalItemText: {
    fontSize: 16,
    color: colors.text,
  },
  modalItemTextSelected: {
    color: colors.primary,
    fontWeight: '500',
  },
});