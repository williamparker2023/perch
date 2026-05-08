import { currentUser, places, users } from '@/constants/data';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Image, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const collapsibleHeaderHeight = 113;
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
    <View style={styles.screen}>
      <Animated.View style={[styles.headerShell, { height: headerHeight, paddingTop: insets.top }]}>
        <Animated.View style={[styles.headerContent, { transform: [{ translateY: headerTranslateY }] }]}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Perch"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#999"
            />
          </View>

          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagScroll}
            contentContainerStyle={styles.tagContainer}>
            {categories.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}>
                <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}>
        <Animated.View style={{ height: headerHeight }} />
        {searchedUsers.length > 0 && (
          <View style={styles.usersSection}>
            {searchedUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => router.push(`/profile/${user.id}`)}>
                <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userHandle}>{user.handle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.placesGrid}>
          {filteredPlaces.map((place) => (
            <TouchableOpacity key={place.id} style={styles.postCard} onPress={() => router.push(`/post/${place.id}`)}>
              <Image source={{ uri: place.image }} style={styles.postImage} />
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{place.category}</Text>
              </View>
              <View style={styles.postInfo}>
                <Text style={styles.postName}>{place.name}</Text>
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
  headerContent: {
    backgroundColor: '#fff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  tagScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tagActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tagText: {
    fontSize: 13,
    color: '#999',
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
    backgroundColor: '#f5f5f5',
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
    color: '#000',
    textAlign: 'center',
  },
  userHandle: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
  postInfo: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  postName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
