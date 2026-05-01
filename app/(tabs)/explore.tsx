import { currentUser, places, users } from '@/constants/data';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ExploreScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = ["Do Local", "Fitness", "Food", "Museum", "Shops", "Sights", "Other"];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const showAll = selectedTags.length === 0;

  const filteredPlaces = places.filter(place => {
    const isNotOwnPost = place.userId !== currentUser.id;
    const matchesCategory = showAll || selectedTags.includes(place.category);
    const matchesSearch = searchQuery.trim() === "" ||
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return isNotOwnPost && matchesCategory && matchesSearch;
  });

  const searchedUsers = searchQuery.trim() !== "" 
    ? users.filter(u => u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Perch"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tagScroll}
        contentContainerStyle={styles.tagContainer}
      >
        {CATEGORIES.map(tag => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={[
              styles.tag,
              selectedTags.includes(tag) && styles.tagActive
            ]}
          >
            <Text style={[
              styles.tagText,
              selectedTags.includes(tag) && styles.tagTextActive
            ]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {searchedUsers.length > 0 && (
        <View style={styles.usersSection}>
          {searchedUsers.map(user => (
            <View key={user.id} style={styles.userCard}>
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userHandle}>{user.handle}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.placesGrid}>
        {filteredPlaces.map((place) => (
          <ExplorePostItem key={place.id} place={place} />
        ))}
      </View>
    </ScrollView>
  );
}

function ExplorePostItem({ place }: { place: any }) {
  return (
    <View style={styles.postCard}>
      <Image source={{ uri: place.image }} style={styles.postImage} />
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{place.category}</Text>
      </View>
      <View style={styles.postInfo}>
        <Text style={styles.postName}>{place.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    paddingHorizontal: 16,
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

