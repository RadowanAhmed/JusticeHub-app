// components/TestNotification.tsx
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function TestNotification() {
  const testLocalNotification = async () => {
    try {
      console.log('Testing local notification...');
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from the app!",
          sound: true,
          badge: 1,
        },
        trigger: {
          type: 'timeInterval',
          seconds: 1,
          repeats: false,
        },
      });
      
      Alert.alert("Success", "Test notification scheduled!");
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", "Failed to schedule notification");
    }
  };

  const testPushNotification = async () => {
    try {
      console.log('Testing push notification...');
      
      // Get permission status
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Notification permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Please enable notifications in your phone settings"
        );
        return;
      }
      
      // Schedule a notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Push Test 🔔",
          body: "This should appear as a push notification!",
          sound: true,
          data: { test: true },
        },
        trigger: {
          type: 'timeInterval',
          seconds: 2,
          repeats: false,
        },
      });
      
      Alert.alert("Success", "Push test scheduled!");
    } catch (error) {
      console.error('Push test error:', error);
      Alert.alert("Error", error.message || "Failed to test push");
    }
  };

  const checkPermissions = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      Alert.alert(
        "Permissions",
        `Notification permission status: ${status}`
      );
      console.log('Current permission:', status);
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
        Notification Test
      </Text>
      
      <TouchableOpacity
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={testLocalNotification}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Test Local Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 8, marginBottom: 10 }}
        onPress={testPushNotification}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Test Push Notification</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{ backgroundColor: '#8E8E93', padding: 15, borderRadius: 8 }}
        onPress={checkPermissions}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Check Permissions</Text>
      </TouchableOpacity>
    </View>
  );
}