import i18n from "@/i18n";
import { LanguageStorage } from "@/services/LanguageStorage";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { ActivityIndicator, Linking, Platform, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// Import providers
import { NotificationProvider } from "@/backend/notifications/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    console.log("🔔 RootLayout: Setting up notification listeners...");

    // Setup notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "📱 Notification received in root:",
          notification.request.content.title,
        );
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(
          "👆 User tapped notification:",
          response.notification.request.content.title,
        );

        const data = response.notification.request.content.data;
        console.log("Notification data:", data);

        // Handle navigation based on notification data
        if (data?.screen) {
          router.push(data.screen);
        }
      });

    // Setup Android notification channel
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
      }).then(() => {
        console.log("✅ Android notification channel created");
      });
    }

    // Request permissions on app start
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        console.log("🔔 Initial notification permission:", status);

        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          console.log("🔔 Requested permission result:", newStatus);
        }
      } catch (error) {
        console.error("❌ Error requesting notification permissions:", error);
      }
    };

    requestPermissions();

    return () => {
      // CORRECTED: Use removeNotificationSubscription (singular) instead of removeNotificationSubscriptions (plural)
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log("Deep link received:", url);

      // Handle password reset deep link
      if (url.includes("reset-password")) {
        try {
          const urlObj = new URL(url);
          const token = urlObj.searchParams.get("token");
          const type = urlObj.searchParams.get("type");

          if (token && type === "recovery") {
            const sixDigitCode = token.slice(-6);
            console.log("Extracted 6-digit code:", sixDigitCode);

            await AsyncStorage.setItem("reset_auto_code", sixDigitCode);

            router.replace({
              pathname: "/(auth)/forgot-password",
              params: { autoCode: sixDigitCode },
            });
          }
        } catch (error) {
          console.error("Error handling deep link:", error);
        }
      }
    };

    // Listen for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check initial URL if app was opened from deep link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🚀 [RootLayout] Initializing app...");

        // Debug: Show storage contents
        await LanguageStorage.debug();

        // Wait a moment for i18n to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));

        console.log("✅ [RootLayout] App initialized");
        setIsReady(true);
      } catch (error) {
        console.error("❌ [RootLayout] Initialization error:", error);
        setIsReady(true); // Continue anyway
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 12, color: "#64748b" }}>
          جاري تحميل التطبيق...
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <LanguageProvider>
              <AuthProvider>
                <NotificationProvider>
                  <StatusBar style="auto" />
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(main)" />
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </NotificationProvider>
              </AuthProvider>
            </LanguageProvider>
          </I18nextProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
