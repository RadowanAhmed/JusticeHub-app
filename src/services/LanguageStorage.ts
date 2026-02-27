import AsyncStorage from '@react-native-async-storage/async-storage';

// Define storage keys
const LANGUAGE_KEY = 'app-language';
const LANGUAGE_VERSION_KEY = 'app-language-version';
const CURRENT_VERSION = '1.0';

export const LanguageStorage = {
  // Save language with version
  saveLanguage: async (language: string): Promise<boolean> => {
    try {
      console.log('💾 [LanguageStorage] Saving language:', language);
      
      // Save language
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      
      // Save version
      await AsyncStorage.setItem(LANGUAGE_VERSION_KEY, CURRENT_VERSION);
      
      // Verify both were saved
      const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      const savedVersion = await AsyncStorage.getItem(LANGUAGE_VERSION_KEY);
      
      const success = savedLang === language && savedVersion === CURRENT_VERSION;
      
      if (success) {
        console.log('✅ [LanguageStorage] Language saved successfully');
      } else {
        console.error('❌ [LanguageStorage] Failed to verify saved language');
      }
      
      return success;
    } catch (error) {
      console.error('❌ [LanguageStorage] Error saving language:', error);
      return false;
    }
  },

  // Get saved language
  getLanguage: async (): Promise<string | null> => {
    try {
      // Check version first
      const version = await AsyncStorage.getItem(LANGUAGE_VERSION_KEY);
      
      // If no version or wrong version, clear and return null
      if (version !== CURRENT_VERSION) {
        console.log('🔄 [LanguageStorage] Version mismatch, clearing old data');
        await AsyncStorage.removeItem(LANGUAGE_KEY);
        await AsyncStorage.removeItem(LANGUAGE_VERSION_KEY);
        return null;
      }
      
      const language = await AsyncStorage.getItem(LANGUAGE_KEY);
      console.log('📱 [LanguageStorage] Retrieved language:', language);
      return language;
    } catch (error) {
      console.error('❌ [LanguageStorage] Error getting language:', error);
      return null;
    }
  },

  // Clear all language data
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([LANGUAGE_KEY, LANGUAGE_VERSION_KEY]);
      console.log('🧹 [LanguageStorage] All language data cleared');
    } catch (error) {
      console.error('❌ [LanguageStorage] Error clearing data:', error);
    }
  },

  // Debug: Show all storage contents
  debug: async (): Promise<void> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('🔑 [LanguageStorage] All keys:', keys);
      
      const items = await AsyncStorage.multiGet(keys);
      console.log('📄 [LanguageStorage] All items:');
      items.forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    } catch (error) {
      console.error('❌ [LanguageStorage] Debug error:', error);
    }
  }
};