/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    secondaryText: '#5f6b76',
    mutedText: '#8b97a3',
    inverseText: '#FFFFFF',
    background: '#fff',
    surface: '#FFFFFF',
    surfaceMuted: '#F3F4F6',
    surfaceSubtle: '#F8FAFC',
    surfaceStrong: '#11181C',
    navChrome: '#FFFFFF',
    border: '#E5E7EB',
    borderStrong: '#D1D5DB',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    secondaryText: '#A7B0B8',
    mutedText: '#7F8892',
    inverseText: '#11181C',
    background: 'rgb(18, 18, 18)',
    surface: '#1C1F20',
    surfaceMuted: '#262A2C',
    surfaceSubtle: '#202426',
    surfaceStrong: '#1C1F20',
    navChrome: 'rgb(18, 18, 18)',
    border: '#2F3437',
    borderStrong: '#41484D',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
