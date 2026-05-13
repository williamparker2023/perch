import { currentUser, places, users } from '@/constants/data';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

const FEED_HEADER_HEIGHT = 52;
const SEARCH_BOTTOM_PADDING = 16;
const EXPLORE_FILTERS_HEIGHT = 49;

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const navChromeColor = useThemeColor({}, 'navChrome');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const surfaceStrongColor = useThemeColor({}, 'surfaceStrong');
  const collapsibleHeaderHeight = FEED_HEADER_HEIGHT + SEARCH_BOTTOM_PADDING + EXPLORE_FILTERS_HEIGHT;
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Do Local', 'Fitness', 'Food', 'Museum', 'Shops', 'Sights', 'Other'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((value) => value !== tag));
      return;
    }
    setSelectedTags([...selectedTags, tag]);
  };

  const showAll = selectedTags.length === 0;

  const filteredPlaces = places.filter((place) => {
    const isNotOwnPost = place.userId !== currentUser.id;
    const matchesCategory = showAll || selectedTags.includes(place.category);
    const matchesSearch =
      searchQuery.trim() === '' ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());

    return isNotOwnPost && matchesCategory && matchesSearch;
  });

  const searchedUsers =
    searchQuery.trim() === ''
      ? []
      : users.filter((user) => user.handle.toLowerCase().includes(searchQuery.toLowerCase()));

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
    <View style={[styles.screen, { backgroundColor: navChromeColor }]}>
      <Animated.View style={[styles.headerShell, { height: headerHeight, paddingTop: insets.top, backgroundColor: navChromeColor }]}>
        <Animated.View style={[styles.headerContent, { transform: [{ translateY: headerTranslateY }], backgroundColor: navChromeColor }]}>
          <View style={[styles.searchContainer, { borderBottomColor: borderColor }]}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: surfaceMutedColor, color: textColor }]}
              placeholder="Search Perch"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={secondaryTextColor}
            />
          </View>

          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.tagScroll, { borderBottomColor: borderColor }]}
            contentContainerStyle={styles.tagContainer}>
            {categories.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[
                  styles.tag,
                  { borderColor, backgroundColor: surfaceColor },
                  selectedTags.includes(tag) && styles.tagActive,
                  selectedTags.includes(tag) && { backgroundColor: surfaceStrongColor, borderColor: surfaceStrongColor },
                ]}>
                <Text
                  style={[
                  styles.tagText,
                  { color: secondaryTextColor },
                  selectedTags.includes(tag) && styles.tagTextActive,
                  ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={[styles.container, { backgroundColor: navChromeColor }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        <Animated.View style={{ height: headerHeight }} />
        {searchedUsers.length > 0 && (
          <View style={styles.usersSection}>
            {searchedUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.userCard, { backgroundColor: surfaceMutedColor }]}
                onPress={() => router.push(`/profile/${user.id}`)}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <Text style={[styles.userName, { color: textColor }]}>{user.name}</Text>
                <Text style={[styles.userHandle, { color: secondaryTextColor }]}>{user.handle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.placesGrid}>
          {filteredPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={[styles.postCard, { backgroundColor: surfaceMutedColor }]}
              onPress={() => router.push(`/post/${place.id}`)}>
              <Image source={{ uri: place.image }} style={styles.postImage} />
              <View style={styles.categoryBadge}>
                <Text style={[styles.categoryText, { color: secondaryTextColor }]}>{place.category}</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={[styles.postName, { color: textColor }]}>{place.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: SEARCH_BOTTOM_PADDING,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },
  tagScroll: {
    borderBottomWidth: 1,
  },
  tagContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagActive: {
  },
  tagText: {
    fontSize: 13,
  },
  tagTextActive: {
    color: '#fff',
  },
  usersSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  userCard: {
    width: '48%',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 12,
    textAlign: 'center',
  },
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  postCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  postImage: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  postInfo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postName: {
    fontSize: 14,
    fontWeight: '600',
  },
});
