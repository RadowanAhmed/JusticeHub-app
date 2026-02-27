import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Custom animated tab button
const AnimatedTabButton = ({
  route,
  onPress,
  isFocused,
  label,
  iconName,
  outlineIconName,
  colors,
}: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scale animation with native driver for performance
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.15 : 1,
      tension: 200,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const handlePress = () => {
    // Fast press animation
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        tension: 200,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.15 : 1,
        tension: 200,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Call onPress after a tiny delay
    setTimeout(() => {
      onPress();
    }, 50);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.tabItem}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Ionicons
          name={isFocused ? iconName : outlineIconName}
          size={24}
          color={isFocused ? colors.primary : colors.textSecondary}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: isFocused ? colors.primary : colors.textSecondary },
          isFocused && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// Custom tab bar component
export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const { t, i18n } = useTranslation();
  const { colors, isDarkMode } = useTheme();
  const isRTL = i18n.language === "ar";

  // Force re-render when language changes
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Force re-render when language or theme changes
    setRefreshKey((prev) => prev + 1);
  }, [i18n.language, isDarkMode]);

  // Define tabs configuration with translation keys
  const tabs = [
    {
      name: "index",
      labelKey: "tabs.home",
      icon: "home",
      outlineIcon: "home-outline",
    },
    {
      name: "cases",
      labelKey: "tabs.cases",
      icon: "briefcase",
      outlineIcon: "briefcase-outline",
    },
    {
      name: "chat",
      labelKey: "tabs.chat",
      icon: "chatbubble-ellipses",
      outlineIcon: "chatbubble-ellipses-outline",
    },
    {
      name: "lawyers",
      labelKey: "tabs.lawyers",
      icon: "people",
      outlineIcon: "people-outline",
    },
    {
      name: "profile",
      labelKey: "tabs.profile",
      icon: "person",
      outlineIcon: "person-outline",
    },
  ];

  // Get translated labels
  const translatedTabs = tabs.map((tab) => ({
    ...tab,
    label: t(tab.labelKey),
  }));

  // For RTL (Arabic), tabs flow from right to left
  const orderedTabs = isRTL ? translatedTabs : [...translatedTabs];

  return (
    <View
      key={`tabbar-${refreshKey}-${i18n.language}-${isDarkMode ? "dark" : "light"}`}
      style={[
        styles.tabBarContainer,
        isRTL && styles.tabBarRTL,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          shadowColor: isDarkMode ? "#000000" : colors.shadowColor,
        },
      ]}
    >
      {orderedTabs.map((tab, index) => {
        const route = state.routes.find((r: any) => r.name === tab.name);
        if (!route) return null;

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <AnimatedTabButton
            key={`${tab.name}-${i18n.language}-${index}-${isDarkMode ? "dark" : "light"}`}
            route={route}
            onPress={onPress}
            isFocused={isFocused}
            label={tab.label}
            iconName={tab.icon}
            outlineIconName={tab.outlineIcon}
            colors={colors}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  tabBarRTL: {
    // In RTL, flexDirection: 'row' already shows items from right to left
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  labelActive: {
    fontWeight: "700",
  },
});
