import {
  Platform,
  PlatformAndroidStatic,
  PlatformIOSStatic,
} from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const releaseVersion =
  Platform.select({
    ios: (Platform as unknown as PlatformIOSStatic).constants.osVersion,
    android: (Platform as unknown as PlatformAndroidStatic).constants.Release,
  }) ?? '0';
