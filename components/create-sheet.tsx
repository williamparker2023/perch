import { router } from 'expo-router';
import { LayoutGrid, PlusSquare, Sparkles, X } from 'lucide-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

type CreateSheetProps = {
  visible: boolean;
  onClose: () => void;
};

const SHEET_HEIGHT = 340;

export function CreateSheet({ visible, onClose }: CreateSheetProps) {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const surfaceSubtleColor = useThemeColor({}, 'surfaceSubtle');
  const borderStrongColor = useThemeColor({}, 'borderStrong');
  const [isMounted, setIsMounted] = useState(visible);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT + 80)).current;

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 90,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT + 80,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setIsMounted(false);
      }
    });
  }, [backdropOpacity, translateY, visible]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          gestureState.dy > 8 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
        onPanResponderMove: (_, gestureState) => {
          translateY.setValue(Math.max(0, gestureState.dy));
        },
        onPanResponderRelease: (_, gestureState) => {
          if (gestureState.dy > 90 || gestureState.vy > 1.1) {
            onClose();
            return;
          }

          Animated.spring(translateY, {
            toValue: 0,
            tension: 90,
            friction: 12,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateY, {
            toValue: 0,
            tension: 90,
            friction: 12,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onClose, translateY]
  );

  const navigateTo = (href: '/board/new' | '/post/select-board' | '/inspo/new') => {
    onClose();
    router.push(href);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: surfaceColor,
            paddingBottom: Math.max(insets.bottom, 20),
            transform: [{ translateY }],
          },
        ]}
        {...panResponder.panHandlers}>
        <View style={[styles.handle, { backgroundColor: borderStrongColor }]} />
        <View style={styles.sheetHeader}>
          <Text style={[styles.title, { color: textColor }]}>Create</Text>
          <TouchableOpacity style={[styles.closeButton, { backgroundColor: surfaceMutedColor }]} onPress={onClose}>
            <X size={20} color={secondaryTextColor} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>Quick actions for creating boards, posts, or inspiration.</Text>

        <View style={styles.contentContainer}>
          <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]} onPress={() => navigateTo('/board/new')}>
            <View style={[styles.iconContainer, styles.boardIcon, { backgroundColor: surfaceMutedColor }]}>
              <LayoutGrid size={20} color={textColor} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Add Board</Text>
              <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Create a collection for a trip or city</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]} onPress={() => navigateTo('/post/select-board')}>
            <View style={[styles.iconContainer, styles.postIcon, { backgroundColor: surfaceMutedColor }]}>
              <PlusSquare size={20} color={textColor} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Add Post</Text>
              <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Document a new place you visited</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.createOption, { backgroundColor: surfaceSubtleColor }]} onPress={() => navigateTo('/inspo/new')}>
            <View style={[styles.iconContainer, styles.inspoIcon, { backgroundColor: surfaceMutedColor }]}>
              <Sparkles size={20} color={textColor} />
            </View>
            <View style={styles.optionText}>
              <Text style={[styles.optionTitle, { color: textColor }]}>Get Inspo</Text>
              <Text style={[styles.optionDescription, { color: secondaryTextColor }]}>Browse ideas and save inspiration</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.24)',
  },
  sheet: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  contentContainer: {
    gap: 14,
  },
  createOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardIcon: {
  },
  postIcon: {
  },
  inspoIcon: {
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
  },
});
