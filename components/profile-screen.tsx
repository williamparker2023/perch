import { collections, currentUser, places, users } from '@/constants/data';
import { router } from 'expo-router';
import { Edit3, Settings } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

type ProfileScreenProps = {
  userId?: string;
};

const TOP_HEADER_HEIGHT = 52;

export function ProfileScreen({ userId }: ProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const navChromeColor = useThemeColor({}, 'navChrome');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const [tab, setTab] = useState<'boards' | 'posts'>('boards');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileUser = useMemo(
    () => (userId ? users.find((user) => user.id === userId) ?? currentUser : currentUser),
    [userId]
  );
  const isOwnProfile = profileUser.id === currentUser.id;

  const userCollections = collections.filter(
    (collection) => collection.userId === profileUser.id && (isOwnProfile || collection.isPublic)
  );
  const userPosts = places.filter((place) => {
    if (place.userId !== profileUser.id) {
      return false;
    }

    if (isOwnProfile) {
      return true;
    }

    const board = collections.find((collection) => collection.id === place.collectionId);
    return Boolean(board?.isPublic);
  });

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <View style={[styles.headerShell, { paddingTop: insets.top, backgroundColor: navChromeColor }]}>
          <View style={[styles.headerRow, { backgroundColor: navChromeColor, borderBottomColor: borderColor }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>{profileUser.handle}</Text>
            {isOwnProfile && (
              <TouchableOpacity onPress={() => setIsMenuOpen((open) => !open)}>
                <Settings size={22} color={textColor} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.bannerContainer}>
          <Image source={{ uri: profileUser.banner }} style={styles.banner} />

          <View style={styles.avatarWrapper}>
            <Image source={{ uri: profileUser.avatar }} style={styles.avatar} />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileUser.followers}</Text>
              <Text style={styles.statLabel}>flock</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileUser.following}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: textColor }]}>{profileUser.name}</Text>
          {!!profileUser.bio && <Text style={[styles.bio, { color: secondaryTextColor }]}>{profileUser.bio}</Text>}
        </View>

        <View style={[styles.tabContainer, { borderColor }]}>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab('boards')}>
            <Text
              style={[
                styles.tabButtonText,
                { color: secondaryTextColor },
                tab === 'boards' && styles.tabButtonTextActive,
                tab === 'boards' && { color: textColor },
              ]}>
              Boards
            </Text>
            {tab === 'boards' && <View style={[styles.tabUnderline, { backgroundColor: textColor }]} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={() => setTab('posts')}>
            <Text
              style={[
                styles.tabButtonText,
                { color: secondaryTextColor },
                tab === 'posts' && styles.tabButtonTextActive,
                tab === 'posts' && { color: textColor },
              ]}>
              Posts
            </Text>
            {tab === 'posts' && <View style={[styles.tabUnderline, { backgroundColor: textColor }]} />}
          </TouchableOpacity>
        </View>

        <View style={styles.contentGrid}>
          {tab === 'boards'
            ? userCollections.map((collection) => (
                <Pressable
                  key={collection.id}
                  onPress={() => router.push(`/collection/${collection.id}`)}
                  style={[styles.boardItem, { backgroundColor: surfaceMutedColor }]}>
                  <Image source={{ uri: collection.coverImage }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridSubtitle}>{collection.isPublic ? 'Public' : 'Private'}</Text>
                    <Text style={styles.gridTitle}>{collection.title}</Text>
                  </View>
                </Pressable>
              ))
            : userPosts.map((post) => {
                const board = collections.find((collection) => collection.id === post.collectionId);

                return (
                  <Pressable
                    key={post.id}
                    onPress={() => router.push(`/post/${post.id}`)}
                    style={[styles.postItem, { backgroundColor: surfaceMutedColor }]}>
                    <Image source={{ uri: post.image }} style={styles.gridImage} />
                    <View style={styles.gridOverlay}>
                      <Text style={styles.gridSubtitle}>{board?.title}</Text>
                      <Text style={styles.gridTitle}>{post.name}</Text>
                    </View>
                  </Pressable>
                );
              })}
        </View>
      </ScrollView>

      {isMenuOpen && (
        <Pressable
          style={[styles.menuOverlay, { paddingTop: insets.top + 60 }]}
          onPress={() => setIsMenuOpen(false)}>
          <View style={[styles.menuContainer, { backgroundColor: surfaceColor }]}>
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: borderColor }]}
              onPress={() => {
                setIsMenuOpen(false);
                router.push('/profile/edit');
              }}>
              <Edit3 size={20} color={textColor} />
              <Text style={[styles.menuItemText, { color: textColor }]}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: borderColor }]} onPress={() => setIsMenuOpen(false)}>
              <Settings size={20} color={textColor} />
              <Text style={[styles.menuItemText, { color: textColor }]}>Settings</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
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
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: TOP_HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  bannerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    alignItems: 'flex-end',
  },
  statNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
  },
  tabButtonTextActive: {
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  boardItem: {
    width: '48%',
    aspectRatio: 5 / 3,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'flex-end',
    padding: 8,
  },
  gridSubtitle: {
    fontSize: 10,
    color: '#d1d5db',
    marginBottom: 2,
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  menuContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 15,
  },
});
