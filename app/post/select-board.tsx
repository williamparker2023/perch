import { collections, currentUser } from '@/constants/data';
import { router } from 'expo-router';
import { ArrowLeft, ArrowUpDown, Check, ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native';

type SortOrder = 'alphabetical' | 'date_added' | 'last_accessed';

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: 'last_accessed', label: 'Last Accessed' },
  { id: 'date_added', label: 'Date Added' },
  { id: 'alphabetical', label: 'Alphabetical' },
];

export default function SelectBoardForPostScreen() {
  const [sortOrder, setSortOrder] = useState<SortOrder>('last_accessed');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const userCollections = collections.filter((collection) => collection.userId === currentUser.id);
  const sortedCollections = useMemo(() => {
    return [...userCollections].sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.title.localeCompare(b.title);
      }
      if (sortOrder === 'date_added') {
        return a.id.localeCompare(b.id);
      }
      return b.id.localeCompare(a.id);
    });
  }, [sortOrder, userCollections]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Board</Text>
        </View>

        <TouchableOpacity onPress={() => setIsSortMenuOpen((open) => !open)} style={styles.sortButton}>
          <ArrowUpDown size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.instructions}>Choose a board to add your new post to.</Text>

        <TouchableOpacity style={styles.createCard} onPress={() => router.push('/board/new')}>
          <View style={styles.createCardLeft}>
            <View style={styles.createIcon}>
              <Plus size={20} color="#000" />
            </View>
            <Text style={styles.createText}>Create New Board</Text>
          </View>
          <ChevronRight size={20} color="#9ca3af" />
        </TouchableOpacity>

        {sortedCollections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={styles.boardCard}
            onPress={() => router.push({ pathname: '/post/new', params: { boardId: collection.id } })}>
            <View style={styles.boardCardLeft}>
              <Image source={{ uri: collection.coverImage }} style={styles.boardImage} />
              <View>
                <Text style={styles.boardTitle}>{collection.title}</Text>
                <Text style={styles.boardMeta}>{collection.isPublic ? 'Public' : 'Private'}</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isSortMenuOpen && (
        <Pressable style={styles.menuOverlay} onPress={() => setIsSortMenuOpen(false)}>
          <View style={styles.menuContainer}>
            <Text style={styles.menuLabel}>Sort by</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.menuItem}
                onPress={() => {
                  setSortOrder(option.id);
                  setIsSortMenuOpen(false);
                }}>
                <Text style={styles.menuItemText}>{option.label}</Text>
                {sortOrder === option.id && <Check size={18} color="#000" />}
              </TouchableOpacity>
            ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  sortButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  instructions: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    marginBottom: 12,
  },
  createCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  createText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  boardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  boardCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  boardImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  boardTitle: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
  boardMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    alignItems: 'flex-end',
    paddingTop: 56,
    paddingRight: 16,
  },
  menuContainer: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
  },
  menuLabel: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: '#111827',
  },
});
