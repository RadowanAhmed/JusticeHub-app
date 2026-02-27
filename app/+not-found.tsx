// apps/mobile/app/+not-found.tsx
import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: t('errors.notFound'),
          headerShown: false 
        }} 
      />
      <View style={styles.container}>
        {/* Simple Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="search-outline" size={64} color="#64748B" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>404</Text>
          </View>
        </View>

        {/* Minimal Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {t('errors.pageNotFound') || 'Not Found'}
          </Text>
          <Text style={styles.message}>
            {t('errors.pageNotFoundMessage') || "This page doesn't exist."}
          </Text>
        </View>

        {/* Single Action Button */}
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="home" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {t('errors.goHome') || 'Go Home'}
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#64748B',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
    minWidth: 140,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});