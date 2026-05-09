import { collections, currentUser, places, users } from '@/constants/data';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Menu, Plus, Sparkles, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceMutedColor = useThemeColor({}, 'surfaceMuted');
  const surfaceStrongColor = useThemeColor({}, 'surfaceStrong');
  const iconColor = useThemeColor({}, 'text');
  const collection = collections.find((entry) => entry.id === id);
  const collectionPlaces = places.filter((place) => place.collectionId === id);
  const owner = users.find((user) => user.id === collection?.userId);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [savedPlaceId, setSavedPlaceId] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(collectionPlaces.map((place) => place.category))),
    [collectionPlaces]
  );

  if (!collection || !owner) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={[styles.emptyText, { color: secondaryTextColor }]}>Collection not found.</Text>
      </View>
    );
  }

  const filteredPlaces =
    activeCategory === null
      ? collectionPlaces
      : collectionPlaces.filter((place) => place.category === activeCategory);
  const isOwnBoard = owner.id === currentUser.id;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { borderBottomColor: borderColor }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Menu size={24} color={iconColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: collection.coverImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <TouchableOpacity onPress={() => router.push(`/profile/${owner.id}`)}>
              <Image source={{ uri: owner.avatar }} style={styles.ownerAvatar} />
            </TouchableOpacity>
            <View>
              <Text style={styles.heroTitle}>{collection.title}</Text>
              <Text style={styles.heroSubtitle}>{collectionPlaces.length} Posts</Text>
            </View>
          </View>
        </View>

        {!!categories.length && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categories}
            contentContainerStyle={styles.categoriesContent}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  { borderColor, backgroundColor: surfaceColor },
                  activeCategory === category && styles.categoryChipActive,
                  activeCategory === category && { backgroundColor: surfaceStrongColor, borderColor: surfaceStrongColor },
                ]}
                onPress={() => setActiveCategory(activeCategory === category ? null : category)}>
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: secondaryTextColor },
                    activeCategory === category && styles.categoryChipTextActive,
                  ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.grid}>
          {filteredPlaces.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={[styles.gridItem, { backgroundColor: surfaceMutedColor }]}
              onPress={() => router.push(`/post/${place.id}`)}>
              <Image source={{ uri: place.image }} style={styles.gridImage} />
              {!isOwnBoard && (
                <TouchableOpacity
                  style={styles.saveBadge}
                  onPress={() => setSavedPlaceId(savedPlaceId === place.id ? null : place.id)}>
                  <Sparkles size={14} color="#fff" fill={savedPlaceId === place.id ? '#fff' : 'none'} />
                </TouchableOpacity>
              )}
              <View style={styles.gridOverlay}>
                <Text style={styles.gridTitle}>{place.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: surfaceStrongColor }]}
        onPress={() => router.push({ pathname: '/post/new', params: { boardId: collection.id } })}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      {showMenu && (
        <Pressable style={styles.sheetOverlay} onPress={() => setShowMenu(false)}>
          <View style={[styles.sheet, { backgroundColor: surfaceColor }]}>
            <View style={styles.sheetHeader}>
              <Text style={[styles.sheetTitle, { color: textColor }]}>Options</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <X size={20} color={secondaryTextColor} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setShowMenu(false)}>
              <Text style={[styles.sheetItemText, { color: textColor }]}>Share Collection</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setShowMenu(false)}>
              <Text style={[styles.sheetItemText, { color: textColor }]}>More Options</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  hero: {
    height: 180,
    position: 'relative',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  heroSubtitle: {
    color: '#e5e7eb',
    fontSize: 12,
    marginTop: 4,
  },
  categories: {
    maxHeight: 46,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
  },
  categoryChipActive: {
  },
  categoryChipText: {
    fontSize: 12,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 8,
    paddingBottom: 96,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  saveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  gridOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  gridTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  sheetItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  sheetItemText: {
    fontSize: 15,
  },
});
