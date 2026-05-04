import { currentUser, inspoBoards, inspoPlaces } from '@/constants/data';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InspoScreen() {
  const [tab, setTab] = useState<'boards' | 'posts'>('boards');

  const userInspoBoards = inspoBoards.filter((board) => board.userId === currentUser.id && !board.isDefault);
  const userInspoPosts = inspoPlaces.filter((place) => {
    const board = inspoBoards.find((entry) => entry.id === place.inspoBoardId);
    return place.userId === currentUser.id && board && !board.isDefault;
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Inspo</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, tab === 'boards' && styles.tabActive]} onPress={() => setTab('boards')}>
          <Text style={[styles.tabText, tab === 'boards' && styles.tabTextActive]}>Boards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'posts' && styles.tabActive]} onPress={() => setTab('posts')}>
          <Text style={[styles.tabText, tab === 'posts' && styles.tabTextActive]}>Posts</Text>
        </TouchableOpacity>
      </View>

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
    </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#999',
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
