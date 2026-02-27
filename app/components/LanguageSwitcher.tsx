// components/LanguageSwitcher.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, isLoading } = useLanguage();
  const { colors, isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [changing, setChanging] = useState(false);

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === language || changing) {
      setModalVisible(false);
      return;
    }

    setChanging(true);
    try {
      await changeLanguage(langCode);
      setModalVisible(false);
    } catch (error) {
      console.error('Error changing language:', error);
      Alert.alert(t('common.error'), t('language.changeError'));
    } finally {
      setChanging(false);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const styles = StyleSheet.create({
    languageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: isDarkMode ? `${colors.primary}20` : 'rgba(59, 130, 246, 0.1)',
      gap: 6,
    },
    languageText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 20,
      width: '85%',
      maxWidth: 400,
      elevation: 5,
      shadowColor: colors.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.3 : 0.1,
      shadowRadius: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    languagesList: {
      marginBottom: 10,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.elevated,
    },
    languageOptionSelected: {
      backgroundColor: isDarkMode ? `${colors.primary}20` : '#dbeafe',
      borderColor: colors.primary,
    },
    languageOptionDisabled: {
      opacity: 0.7,
    },
    languageOptionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    languageOptionRight: {
      width: 30,
      alignItems: 'center',
    },
    languageFlag: {
      fontSize: 24,
      marginRight: 12,
    },
    languageOptionText: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    languageOptionTextSelected: {
      color: colors.primary,
      fontWeight: '600',
    },
    savingText: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: 'center',
      fontStyle: 'italic',
      paddingTop: 10,
    },
  });

  return (
    <>
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setModalVisible(true)}
        disabled={changing || isLoading}
      >
        <Ionicons name="language" size={22} color={colors.primary} />
        <Text style={styles.languageText}>
          {currentLanguage.name}
        </Text>
        <Ionicons 
          name={modalVisible ? "chevron-up" : "chevron-down"} 
          size={18} 
          color={colors.textSecondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => !changing && setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('language.selectLanguage', 'اختر اللغة')}
              </Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                disabled={changing}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.languagesList}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageOption,
                    language === lang.code && styles.languageOptionSelected,
                    changing && styles.languageOptionDisabled,
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                  disabled={changing || isLoading}
                >
                  <View style={styles.languageOptionContent}>
                    <Text style={styles.languageFlag}>{lang.flag}</Text>
                    <Text style={[
                      styles.languageOptionText,
                      language === lang.code && styles.languageOptionTextSelected,
                    ]}>
                      {lang.name}
                    </Text>
                  </View>
                  
                  <View style={styles.languageOptionRight}>
                    {changing && language === lang.code && (
                      <ActivityIndicator size="small" color={colors.primary} />
                    )}
                    {!changing && language === lang.code && (
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            {changing && (
              <Text style={styles.savingText}>
                {t('language.saving', 'جاري حفظ اللغة...')}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default LanguageSwitcher;