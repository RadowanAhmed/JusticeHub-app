import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import * as Localization from 'expo-localization';

import { LanguageStorage } from '@/services/LanguageStorage';
import ar from './ar';
import en from './en';

// Default language
const DEFAULT_LANGUAGE = 'ar';

// Initialize i18n WITHOUT language detector
const initI18n = async () => {
  try {
    console.log('🚀 [i18n] Initializing...');
    
    // Get saved language from our storage service
    const savedLanguage = await LanguageStorage.getLanguage();
    console.log('📱 [i18n] Saved language from storage:', savedLanguage);
    
    // Determine initial language
    let initialLanguage = DEFAULT_LANGUAGE;
    
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      initialLanguage = savedLanguage;
      console.log('✅ [i18n] Using saved language:', initialLanguage);
    } else {
      // No saved language, use device language
      try {
        if (Localization.locale) {
          const deviceLang = Localization.locale.toLowerCase();
          console.log('📱 [i18n] Device locale:', deviceLang);
          
          if (deviceLang.startsWith('ar')) {
            initialLanguage = 'ar';
          } else if (deviceLang.startsWith('en')) {
            initialLanguage = 'en';
          }
        }
      } catch (error) {
        console.error('❌ [i18n] Error getting device language:', error);
      }
      
      // Save device language
      await LanguageStorage.saveLanguage(initialLanguage);
      console.log('💾 [i18n] Saved device language:', initialLanguage);
    }
    
    // Initialize i18n
    i18n.use(initReactI18next).init({
      resources: {
        ar: { translation: ar },
        en: { translation: en },
      },
      lng: initialLanguage,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      compatibilityJSON: 'v3',
    });
    
    // Set RTL for Arabic
    if (initialLanguage === 'ar' && !I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      console.log('🔄 [i18n] RTL enabled for Arabic');
    } else if (initialLanguage === 'en' && I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
      console.log('🔄 [i18n] RTL disabled for English');
    }
    
    console.log('🎉 [i18n] Initialization complete. Language:', initialLanguage);
    return initialLanguage;
  } catch (error) {
    console.error('❌ [i18n] Initialization error:', error);
    
    // Fallback initialization
    i18n.use(initReactI18next).init({
      resources: {
        ar: { translation: ar },
        en: { translation: en },
      },
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      compatibilityJSON: 'v3',
    });
    
    return DEFAULT_LANGUAGE;
  }
};

// Export a promise that resolves when i18n is initialized
export const i18nInitPromise = initI18n();

// Function to change language
export const changeLanguage = async (lang: 'ar' | 'en'): Promise<boolean> => {
  try {
    console.log('🔄 [i18n] Changing language to:', lang);
    
    // Save to storage FIRST
    const saved = await LanguageStorage.saveLanguage(lang);
    if (!saved) {
      throw new Error('Failed to save language to storage');
    }
    
    // Change i18n language
    await i18n.changeLanguage(lang);
    
    // Update RTL settings
    if (lang === 'ar' && !I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
    } else if (lang === 'en' && I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    }
    
    console.log('✅ [i18n] Language changed successfully to:', lang);
    return true;
  } catch (error) {
    console.error('❌ [i18n] Error changing language:', error);
    return false;
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || DEFAULT_LANGUAGE;
};

// Check if RTL
export const isRTL = (): boolean => {
  return getCurrentLanguage() === 'ar';
};

export default i18n;