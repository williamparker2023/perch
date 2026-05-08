import { collections, places, users } from '@/constants/data';
import { router } from 'expo-router';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
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
    <View style={styles.screen}>
      <Animated.View style={[styles.headerShell, { height: headerHeight, paddingTop: insets.top }]}>
        <Animated.View style={[styles.titleBar, { transform: [{ translateY: titleBarTranslateY }] }]}>
          <Text style={styles.title}>Perch</Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
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
    <View>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => router.push(`/profile/${item.user.id}`)}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <TouchableOpacity onPress={() => router.push(`/profile/${item.user.id}`)}>
            <Text style={styles.userName}>{item.user.handle}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/collection/${item.collection.id}`)}>
            <Text style={styles.collectionInfo}>
              {item.collection.title}: {item.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.95} onPress={handleDoubleClick} style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.postImage} />
        {showHeartAnim && (
          <Animated.View style={[styles.heartAnimation, { transform: [{ scale: heartScale }] }]}>
            <Heart size={80} color="#fff" fill="#fff" />
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={styles.contentFooter}>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
            <Heart size={24} color={isLiked ? '#ef4444' : '#000'} fill={isLiked ? '#ef4444' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/post/${item.id}`)}>
            <MessageCircle size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.flexEnd}>
            <TouchableOpacity onPress={() => setIsSaved(!isSaved)}>
              <Sparkles size={24} color="#000" fill={isSaved ? '#000' : 'none'} />
            </TouchableOpacity>
          </View>
        </View>

        {item.notes && (
          <Text style={styles.caption}>
            <Text style={styles.captionHandle}>{item.user.handle} </Text>
            <Text style={styles.captionText}>{item.notes}</Text>
          </Text>
        )}

        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerShell: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    overflow: 'hidden',
    zIndex: 10,
  },
  titleBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
  },
  collectionInfo: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: '#f0f0f0',
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
    color: '#000',
    lineHeight: 18,
    marginBottom: 8,
  },
  captionHandle: {
    fontWeight: '700',
  },
  captionText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    letterSpacing: 0.5,
  },
});
