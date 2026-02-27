// utils/deviceInfo.ts
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const getDeviceInfo = () => {
  return {
    model: Device.modelName || 'Unknown Device',
    os: Platform.OS,
    version: Platform.Version,
    brand: Device.brand || 'Unknown',
    manufacturer: Device.manufacturer || 'Unknown',
    isDevice: Device.isDevice,
    deviceType: Device.deviceType || 0,
  };
};

export const formatDeviceInfo = (): string => {
  const info = getDeviceInfo();
  return `${info.model} (${info.os} ${info.version})`;
};

export const getLocationInfo = async (): Promise<string | null> => {
  // You can integrate geolocation here if needed
  // import * as Location from 'expo-location';
  return null;
};