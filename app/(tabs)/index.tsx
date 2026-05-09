import { collections, places, users } from '@/constants/data';
import { router } from 'expo-router';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const navChromeColor = useThemeColor({}, 'navChrome');
  const textColor = useThemeColor({}, 'text');
  const titleBarHeight = 52;
  const collapsedAmount = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const currentCollapsed = useRef(0);
  const headerHeight = collapsedAmount.interpolate({
    inputRange: [0, titleBarHeight],
    outputRange: [insets.top + titleBarHeight, insets.top],
    extrapolate: 'clamp',
  });
  const titleBarTranslateY = collapsedAmount.interpolate({
    inputRange: [0, titleBarHeight],
    outputRange: [0, -titleBarHeight],
    extrapolate: 'clamp',
  });
  const feedItems = places
    .map((place) => {
      const user = users.find((entry) => entry.id === place.userId)!;
      const collection = collections.find((entry) => entry.id === place.collectionId)!;
      return { ...place, user, collection };
    })
    .reverse();

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = nativeEvent.contentOffset.y;

    if (y < 0) {
      lastScrollY.current = 0;
      return;
    }

    const diff = y - lastScrollY.current;
    lastScrollY.current = y;

    const nextCollapsed = Math.max(0, Math.min(titleBarHeight, currentCollapsed.current + diff));
    currentCollapsed.current = nextCollapsed;
    collapsedAmount.setValue(nextCollapsed);
  };

  return (
    <View style={[styles.screen, { backgroundColor: navChromeColor }]}>
      <Animated.View style={[styles.headerShell, { height: headerHeight, paddingTop: insets.top, backgroundColor: navChromeColor }]}>
        <Animated.View style={[styles.titleBar, { transform: [{ translateY: titleBarTranslateY }], backgroundColor: navChromeColor }]}>
          <Text style={[styles.title, { color: textColor }]}>Perch</Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.container, { backgroundColor: navChromeColor }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        <Animated.View style={{ height: headerHeight }} />
        {feedItems.map((item) => (
          <PostItem key={item.id} item={item} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function PostItem({ item }: { item: any }) {
  const navChromeColor = useThemeColor({}, 'navChrome');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const mutedTextColor = useThemeColor({}, 'mutedText');
  const iconColor = useThemeColor({}, 'text');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;

  const handleDoubleClick = () => {
    setIsLiked(true);
    setShowHeartAnim(true);
    heartScale.setValue(0);
    Animated.spring(heartScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowHeartAnim(false), 800);
    });
  };

  return (
    <View style={{ backgroundColor: navChromeColor }}>
      <View style={[styles.postHeader, { backgroundColor: navChromeColor }]}>
        <TouchableOpacity onPress={() => router.push(`/profile/${item.user.id}`)}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push(`/profile/${item.user.id}`)}>
            <Text style={[styles.userName, { color: textColor }]}>{item.user.handle}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/collection/${item.collection.id}`)}>
            <Text style={[styles.collectionInfo, { color: secondaryTextColor }]}>
              {item.collection.title}: {item.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.95}
        onPress={handleDoubleClick}
        style={[styles.imageContainer, { backgroundColor: surfaceMutedColor }]}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
        {showHeartAnim && (
          <Animated.View style={[styles.heartAnimation, { transform: [{ scale: heartScale }] }]}>
            <Heart size={80} color="#fff" fill="#fff" />
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={[styles.contentFooter, { backgroundColor: navChromeColor }]}>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Heart size={24} color={isLiked ? '#ef4444' : iconColor} fill={isLiked ? '#ef4444' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
            <MessageCircle size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 size={24} color={iconColor} />
          </TouchableOpacity>
          <View style={styles.flexEnd}>
            <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
              <Sparkles size={24} color={iconColor} fill={isSaved ? iconColor : 'none'} />
            </TouchableOpacity>
          </View>
        </View>

        {item.notes && (
          <Text style={[styles.caption, { color: textColor }]}>
            <Text style={styles.captionHandle}>{item.user.handle} </Text>
            <Text style={[styles.captionText, { color: textColor }]}>{item.notes}</Text>
          </Text>
        )}

        <Text style={[styles.timestamp, { color: mutedTextColor }]}>{item.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 13,
    fontWeight: '700',
  },
  collectionInfo: {
    fontSize: 11,
    marginTop: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  contentFooter: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  flexEnd: {
    marginLeft: 'auto',
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  captionHandle: {
    fontWeight: '700',
  },
  captionText: {
  },
  timestamp: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
