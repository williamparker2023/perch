import { collections, places, savedItems } from '@/constants/data';
import { router } from 'expo-router';
import { Bookmark, FileText } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Filter = 'all' | 'places' | 'collections';

export default function SavedScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const [activeNotesId, setActiveNotesId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      savedItems
        .map((item) => {
          if (item.type === 'place') {
            return { ...item, data: places.find((place) => place.id === item.placeId) };
          }
          return { ...item, data: collections.find((collection) => collection.id === item.collectionId) };
        })
        .filter((item) => item.data),
    []
  );

  const filteredItems =
    filter === 'all' ? items : items.filter((item) => item.type === filter.slice(0, -1));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>

      <View style={styles.filters}>
        {(['all', 'places', 'collections'] as Filter[]).map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.filterButton, filter === value && styles.filterButtonActive]}
            onPress={() => setFilter(value)}>
            <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
              {value === 'all' ? 'All Saves' : value[0].toUpperCase() + value.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.grid}>
        {filteredItems.map((item) => {
          if (item.type === 'place') {
            const place = item.data as (typeof places)[number];
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.placeCard}
                onPress={() => router.push(`/post/${place.id}`)}>
                <Image source={{ uri: place.image }} style={styles.placeImage} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{place.category}</Text>
                </View>
                <TouchableOpacity
                  style={styles.cornerIcon}
                  onPress={() => setActiveNotesId(activeNotesId === item.id ? null : item.id)}>
                  {place.notes ? <FileText size={16} color="#fff" /> : <Bookmark size={16} color="#fff" fill="#fff" />}
                </TouchableOpacity>
                <View style={styles.placeBody}>
                  <Text style={styles.placeTitle}>{place.name}</Text>
                  {activeNotesId === item.id && !!place.notes && (
                    <Text style={styles.placeNotes}>{place.notes}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          }

          const collection = item.data as (typeof collections)[number];
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.collectionCard}
              onPress={() => router.push(`/collection/${collection.id}`)}>
              <Image source={{ uri: collection.coverImage }} style={styles.collectionImage} />
              <View style={styles.collectionOverlay}>
                <Text style={styles.collectionTitle}>{collection.title}</Text>
                <Text style={styles.collectionLabel}>Collection</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterText: {
    fontSize: 12,
    color: '#374151',
  },
  filterTextActive: {
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },
  placeCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  placeImage: {
    width: '100%',
    aspectRatio: 4 / 5,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  badgeText: {
    fontSize: 10,
    color: '#374151',
  },
  cornerIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  placeBody: {
    padding: 12,
  },
  placeTitle: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  placeNotes: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    lineHeight: 18,
  },
  collectionCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  collectionImage: {
    width: '100%',
    height: '100%',
  },
  collectionOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  collectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  collectionLabel: {
    color: '#d1d5db',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
