import { currentUser, inspoBoards, inspoPlaces } from '@/constants/data';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Menu, Sparkles, X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InspoDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const board = inspoBoards.find((entry) => entry.id === id);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const boardPlaces = useMemo(() => {
    if (!board) {
      return [];
    }

    return board.isDefault
      ? inspoPlaces.filter((place) => place.userId === board.userId)
      : inspoPlaces.filter((place) => place.inspoBoardId === board.id);
  }, [board]);

  const categories = useMemo(
    () => Array.from(new Set(boardPlaces.map((place) => place.category))),
    [boardPlaces]
  );

  if (!board) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Inspo board not found.</Text>
      </View>
    );
  }

  const filteredPlaces =
    activeCategory === null
      ? boardPlaces
      : boardPlaces.filter((place) => place.category === activeCategory);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Menu size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: board.coverImage }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Image source={{ uri: currentUser.avatar }} style={styles.ownerAvatar} />
            <View>
              <Text style={styles.heroTitle}>{board.title}</Text>
              <Text style={styles.heroSubtitle}>{boardPlaces.length} Places</Text>
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
                style={[styles.categoryChip, activeCategory === category && styles.categoryChipActive]}
                onPress={() => setActiveCategory(activeCategory === category ? null : category)}>
                <Text
                  style={[styles.categoryChipText, activeCategory === category && styles.categoryChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.grid}>
          {filteredPlaces.length === 0 ? (
            <View style={styles.emptyState}>
              <Sparkles size={28} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No inspiration saved here yet.</Text>
            </View>
          ) : (
            filteredPlaces.map((place) => (
              <TouchableOpacity
                key={place.id}
                style={styles.gridItem}
                onPress={() => router.push(`/post/${place.id}`)}>
                <Image source={{ uri: place.image }} style={styles.gridImage} />
                <View style={styles.gridOverlay}>
                  <Text style={styles.gridTitle}>{place.name}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {showMenu && (
        <Pressable style={styles.sheetOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Options</Text>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <X size={20} color="#4b5563" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setShowMenu(false)}>
              <Text style={styles.sheetItemText}>Share Board</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetItem} onPress={() => setShowMenu(false)}>
              <Text style={styles.sheetItemText}>More Options</Text>
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
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  categoryChipActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  categoryChipText: {
    color: '#374151',
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
    paddingBottom: 24,
  },
  gridItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  gridImage: {
    width: '100%',
    height: '100%',
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
  emptyState: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 10,
  },
  emptyStateText: {
    color: '#6b7280',
    fontSize: 14,
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
    backgroundColor: '#fff',
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
    color: '#111827',
  },
  sheetItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  sheetItemText: {
    fontSize: 15,
    color: '#111827',
  },
});
