import { currentUser, inspoBoards, inspoPlaces } from '@/constants/data';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function InspoScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const navChromeColor = useThemeColor({}, 'navChrome');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#f0f0f0', dark: '#2a2d2e' }, 'background');
  const collapsibleHeaderHeight = 101;
  const collapsedAmount = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const currentCollapsed = useRef(0);
  const headerHeight = collapsedAmount.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [insets.top + collapsibleHeaderHeight, insets.top],
    extrapolate: 'clamp',
  });
  const headerTranslateY = collapsedAmount.interpolate({
    inputRange: [0, collapsibleHeaderHeight],
    outputRange: [0, -collapsibleHeaderHeight],
    extrapolate: 'clamp',
  });
  const [tab, setTab] = useState<'boards' | 'posts'>('boards');

  const userInspoBoards = inspoBoards.filter((board) => board.userId === currentUser.id && !board.isDefault);
  const userInspoPosts = inspoPlaces.filter((place) => {
    const board = inspoBoards.find((entry) => entry.id === place.inspoBoardId);
    return place.userId === currentUser.id && board && !board.isDefault;
  });

  const handleScroll = ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = nativeEvent.contentOffset.y;

    if (y < 0) {
      lastScrollY.current = 0;
      return;
    }

    const diff = y - lastScrollY.current;
    lastScrollY.current = y;

    const nextCollapsed = Math.max(0, Math.min(collapsibleHeaderHeight, currentCollapsed.current + diff));
    currentCollapsed.current = nextCollapsed;
    collapsedAmount.setValue(nextCollapsed);
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.headerShell, { height: headerHeight, paddingTop: insets.top, backgroundColor: navChromeColor }]}>
        <Animated.View style={[styles.headerContent, { transform: [{ translateY: headerTranslateY }], backgroundColor: navChromeColor }]}>
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Text style={[styles.title, { color: textColor }]}>Inspo</Text>
          </View>

          <View style={[styles.tabContainer, { borderBottomColor: borderColor }]}>
            <TouchableOpacity style={[styles.tab, tab === 'boards' && styles.tabActive]} onPress={() => setTab('boards')}>
              <Text style={[styles.tabText, tab === 'boards' && styles.tabTextActive, { color: textColor }]}>Boards</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === 'posts' && styles.tabActive]} onPress={() => setTab('posts')}>
              <Text style={[styles.tabText, tab === 'posts' && styles.tabTextActive, { color: textColor }]}>Posts</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        <Animated.View style={{ height: headerHeight }} />
        {tab === 'boards' ? (
          <View style={styles.boardsGrid}>
            {userInspoBoards.map((board) => (
              <TouchableOpacity
                key={board.id}
                style={styles.boardCard}
                onPress={() => router.push(`/inspo/${board.id}`)}>
                <Image source={{ uri: board.coverImage }} style={styles.boardImage} />
                <View style={styles.boardOverlay}>
                  <Text style={styles.boardTitle}>{board.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.postsGrid}>
            {userInspoPosts.map((post) => {
              const board = inspoBoards.find((entry) => entry.id === post.inspoBoardId);

              return (
                <TouchableOpacity key={post.id} style={styles.postCard} onPress={() => router.push(`/post/${post.id}`)}>
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                  <View style={styles.postOverlay}>
                    <Text style={styles.postBoard}>{board?.title}</Text>
                    <Text style={styles.postName}>{post.name}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </Animated.ScrollView>
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
  headerContent: {
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  boardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  boardCard: {
    width: '48%',
    aspectRatio: 5 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  boardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  boardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  postCard: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  postBoard: {
    fontSize: 10,
    color: '#d1d5db',
  },
  postName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});
