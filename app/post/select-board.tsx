import { collections, currentUser } from '@/constants/data';
import { router } from 'expo-router';
import { ArrowLeft, ArrowUpDown, Check, ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

type SortOrder = 'alphabetical' | 'date_added' | 'last_accessed';

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: 'last_accessed', label: 'Last Accessed' },
  { id: 'date_added', label: 'Date Added' },
  { id: 'alphabetical', label: 'Alphabetical' },
];

export default function SelectBoardForPostScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');
  const surfaceSubtleColor = useThemeColor({}, 'surfaceSubtle');
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
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>Select Board</Text>
        </View>

        <TouchableOpacity onPress={() => setIsSortMenuOpen((open) => !open)} style={styles.sortButton}>
          <ArrowUpDown size={20} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.instructions, { color: secondaryTextColor }]}>Choose a board to add your new post to.</Text>

        <TouchableOpacity style={[styles.createCard, { borderColor, backgroundColor: surfaceSubtleColor }]} onPress={() => router.push('/board/new')}>
          <View style={styles.createCardLeft}>
            <View style={[styles.createIcon, { backgroundColor: surfaceColor }]}>
              <Plus size={20} color={textColor} />
            </View>
            <Text style={[styles.createText, { color: textColor }]}>Create New Board</Text>
          </View>
          <ChevronRight size={20} color={secondaryTextColor} />
        </TouchableOpacity>

        {sortedCollections.map((collection) => (
          <TouchableOpacity
            key={collection.id}
            style={[styles.boardCard, { borderColor, backgroundColor: surfaceColor }]}
            onPress={() => router.push({ pathname: '/post/new', params: { boardId: collection.id } })}>
            <View style={styles.boardCardLeft}>
              <Image source={{ uri: collection.coverImage }} style={styles.boardImage} />
              <View>
                <Text style={[styles.boardTitle, { color: textColor }]}>{collection.title}</Text>
                <Text style={[styles.boardMeta, { color: secondaryTextColor }]}>{collection.isPublic ? 'Public' : 'Private'}</Text>
              </View>
            </View>
            <ChevronRight size={20} color={secondaryTextColor} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isSortMenuOpen && (
        <Pressable style={styles.menuOverlay} onPress={() => setIsSortMenuOpen(false)}>
          <View style={[styles.menuContainer, { backgroundColor: surfaceColor }]}>
            <Text style={[styles.menuLabel, { color: secondaryTextColor }]}>Sort by</Text>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.menuItem}
                onPress={() => {
                  setSortOrder(option.id);
                  setIsSortMenuOpen(false);
                }}>
                <Text style={[styles.menuItemText, { color: textColor }]}>{option.label}</Text>
                {sortOrder === option.id && <Check size={18} color={textColor} />}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  createCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
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
    fontWeight: '500',
  },
  boardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
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
    fontWeight: '500',
  },
  boardMeta: {
    fontSize: 12,
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
    borderRadius: 16,
    paddingVertical: 8,
  },
  menuLabel: {
    fontSize: 12,
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
  },
});
