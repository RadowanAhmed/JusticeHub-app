import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { LanguageStorage } from '@/services/LanguageStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LanguageTestScreen() {
  const { language, changeLanguage, isRTL } = useLanguage();
  const { t, i18n } = useTranslation();
  const [storageData, setStorageData] = useState<any[]>([]);

  const checkStorage = async () => {
    try {
      console.log('🔍 Checking storage...');
      await LanguageStorage.debug();
      
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      setStorageData(items);
      
      Alert.alert('Storage Check', `Found ${keys.length} keys in storage`);
    } catch (error) {
      console.error('Error checking storage:', error);
    }
  };

  const forceSetEnglish = async () => {
    try {
      console.log('🔧 Forcing English...');
      await LanguageStorage.saveLanguage('en');
      await changeLanguage('en');
      Alert.alert('Success', 'Language forced to English');
    } catch (error) {
      Alert.alert('Error', 'Failed to force English');
    }
  };

  const forceSetArabic = async () => {
    try {
      console.log('🔧 Forcing Arabic...');
      await LanguageStorage.saveLanguage('ar');
      await changeLanguage('ar');
      Alert.alert('Success', 'Language forced to Arabic');
    } catch (error) {
      Alert.alert('Error', 'Failed to force Arabic');
    }
  };

  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      setStorageData([]);
      Alert.alert('Cleared', 'All storage cleared. Please restart app.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear storage');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Language Test Screen</Text>
        
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Current Language: <Text style={styles.highlight}>{language}</Text>
          </Text>
          <Text style={styles.infoText}>
            i18n Language: <Text style={styles.highlight}>{i18n.language}</Text>
          </Text>
          <Text style={styles.infoText}>
            Direction: <Text style={styles.highlight}>{i18n.dir()}</Text>
          </Text>
          <Text style={styles.infoText}>
            Is RTL: <Text style={styles.highlight}>{isRTL ? 'Yes' : 'No'}</Text>
          </Text>
          <Text style={styles.infoText}>
            Translation Test: <Text style={styles.highlight}>{t('common.hello')}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Actions</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, language === 'ar' && styles.activeButton]}
            onPress={() => changeLanguage('ar')}
          >
            <Text style={styles.buttonText}>Set Arabic</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, language === 'en' && styles.activeButton]}
            onPress={() => changeLanguage('en')}
          >
            <Text style={styles.buttonText}>Set English</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Actions</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.button} onPress={checkStorage}>
            <Text style={styles.buttonText}>Check Storage</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={forceSetEnglish}>
            <Text style={styles.buttonText}>Force English</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={forceSetArabic}>
            <Text style={styles.buttonText}>Force Arabic</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]} 
            onPress={clearAllStorage}
          >
            <Text style={[styles.buttonText, styles.dangerText]}>
              Clear All Storage
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {storageData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Contents</Text>
          <View style={styles.storageCard}>
            {storageData.map(([key, value], index) => (
              <View key={key} style={styles.storageItem}>
                <Text style={styles.storageKey}>{key}:</Text>
                <Text style={styles.storageValue}>{value || '(empty)'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsCard}>
          <Text style={styles.instruction}>
            1. Set language to English using the button above
          </Text>
          <Text style={styles.instruction}>
            2. Close the app completely (swipe away from recent apps)
          </Text>
          <Text style={styles.instruction}>
            3. Reopen the app and check if it's still English
          </Text>
          <Text style={styles.instruction}>
            4. Use "Check Storage" to verify what's saved
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  highlight: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  buttonGroup: {
    gap: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#1e40af',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerText: {
    color: '#dc2626',
  },
  storageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  storageKey: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  storageValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    maxWidth: '60%',
  },
  instructionsCard: {
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
  },
  instruction: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 8,
    lineHeight: 20,
  },
});