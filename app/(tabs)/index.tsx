import { collections, places, users } from '@/constants/data';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FeedScreen() {
  const feedItems = places.map(p => {
    const user = users.find(u => u.id === p.userId)!;
    const collection = collections.find(c => c.id === p.collectionId)!;
    return { ...p, user, collection };
  }).reverse();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Perch</Text>
      </View>

      {feedItems.map((item) => (
        <PostItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}

function PostItem({ item }: { item: any }) {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const heartScale = useRef(new Animated.Value(0)).current;

  const handleDoubleClick = () => {
    setIsLiked(true);
    setShowHeartAnim(true);
    heartScale.setValue(0);
    Animated.spring(heartScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => setShowHeartAnim(false), 800);
    });
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.userHandle}>{item.user.handle}</Text>
        </View>
      </View>

      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={handleDoubleClick}
        style={styles.imageContainer}
      >
        <Image source={{ uri: item.image }} style={styles.postImage} />
        {showHeartAnim && (
          <Animated.View 
            style={[
              styles.heartAnimation,
              { transform: [{ scale: heartScale }] }
            ]}
          >
            <Text style={styles.heartEmoji}>❤️</Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={styles.postContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
        <Text style={styles.collectionLabel}>{item.collection.title}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setIsLiked(!isLiked)}>
          <Heart size={20} color={isLiked ? '#ef4444' : '#111827'} />
          <Text style={[styles.actionLabel, isLiked && styles.likesActive]}>{isLiked ? 'Liked' : 'Like'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={20} color="#111827" />
          <Text style={styles.actionLabel}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Bookmark size={20} color="#111827" />
          <Text style={styles.actionLabel}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#111827" />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  postContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  userHandle: {
    fontSize: 12,
    color: '#666',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#f3f4f6',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  heartAnimation: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
  },
  heartEmoji: {
    fontSize: 60,
  },
  postContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
  },
  categoryText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '700',
  },
  collectionLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionLabel: {
    marginLeft: 8,
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  likesActive: {
    color: '#ef4444',
  },
});
