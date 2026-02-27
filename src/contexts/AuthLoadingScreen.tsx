// apps/mobile/components/AuthLoadingScreen.tsx
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function AuthLoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#1e40af" />
      <Text style={{ marginTop: 10, color: '#1e40af' }}>
        جاري التحقق من المصادقة...
      </Text>
    </View>
  );
}