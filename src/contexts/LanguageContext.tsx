import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager, Alert } from 'react-native';
import i18n, { i18nInitPromise, changeLanguage as changeI18nLanguage, getCurrentLanguage } from '@/i18n';

interface LanguageContextType {
  language: string;
  isRTL: boolean;
  changeLanguage: (lang: string) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeLanguage();
  }, []);

  const initializeLanguage = async () => {
    try {
      console.log('🔄 [LanguageContext] Initializing language...');
      setIsLoading(true);
      
      // Wait for i18n to initialize
      await i18nInitPromise;
      
      // Get current language from i18n
      const currentLang = getCurrentLanguage();
      console.log('📱 [LanguageContext] Current language:', currentLang);
      
      // Update state
      setLanguage(currentLang);
      setIsRTL(currentLang === 'ar');
      
      console.log('✅ [LanguageContext] Initialized. Language:', currentLang, 'RTL:', currentLang === 'ar');
    } catch (error) {
      console.error('❌ [LanguageContext] Initialization error:', error);
      setLanguage('ar');
      setIsRTL(true);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (lang: string) => {
    if (lang !== 'ar' && lang !== 'en') {
      console.error('❌ [LanguageContext] Invalid language code:', lang);
      return;
    }

    try {
      console.log('🔄 [LanguageContext] Changing language to:', lang);
      
      // Change language using i18n function
      const success = await changeI18nLanguage(lang as 'ar' | 'en');
      
      if (success) {
        // Update local state
        setLanguage(lang);
        setIsRTL(lang === 'ar');
        
        console.log('✅ [LanguageContext] Language changed to:', lang);
        
        // Show restart alert if RTL changed
        const currentRTL = i18n.dir() === 'rtl';
        const newRTL = lang === 'ar';
        if (currentRTL !== newRTL) {
          showRestartAlert();
        }
      } else {
        throw new Error('Failed to change language');
      }
    } catch (error) {
      console.error('❌ [LanguageContext] Error changing language:', error);
      Alert.alert('Error', 'Failed to change language');
    }
  };

  const showRestartAlert = () => {
    Alert.alert(
      i18n.t('language.restartTitle', 'Restart Required'),
      i18n.t('language.restartMessage', 'Some changes require a restart to take full effect.'),
      [
        {
          text: i18n.t('common.ok', 'OK'),
          style: 'default'
        }
      ]
    );
  };

  // Don't render until language is loaded
  if (isLoading) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, isRTL, changeLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};